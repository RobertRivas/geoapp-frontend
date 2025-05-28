import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, MapRef, Popup } from 'react-map-gl';

import { fetchNeighborhoods, fetchPoints } from './api/apiService';
import { Feature, FeatureCollection, GeoJsonProperties} from 'geojson';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

function App() {
    const [neighborhoods, setNeighborhoods] = useState<FeatureCollection | null>(null);
    const [points, setPoints] = useState<FeatureCollection | null>(null);
    const [popupInfo, setPopupInfo] = useState<{
        lngLat: { lng: number; lat: number };
        properties: GeoJsonProperties;
    } | null>(null);

    const mapRef = useRef<MapRef>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const nData = (await fetchNeighborhoods()) as FeatureCollection;
                const pData = (await fetchPoints()) as FeatureCollection;

                nData.features.forEach((f: Feature, i: number) => {
                    if (!f.id) f.id = `neigh-${i}`;
                });

                pData.features.forEach((f: Feature, i: number) => {
                    if (!f.id) f.id = `point-${i}`;
                });

                setNeighborhoods(nData);
                setPoints(pData);
            } catch (error) {
                console.error('Failed to load GeoJSON data:', error);
            }
        };

        loadData();
    }, []);

    const handleClick = (event: mapboxgl.MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature && feature.properties) {
            setPopupInfo({
                lngLat: event.lngLat,
                properties: feature.properties as GeoJsonProperties,
            });
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: 40.7128,
                    longitude: -74.006,
                    zoom: 10,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                interactiveLayerIds={['homicide-points']}
                onClick={handleClick}
            >
                {neighborhoods && (
                    <Source id="neighborhoods" type="geojson" data={neighborhoods}>
                        <Layer
                            id="neighborhood-fill"
                            type="fill"
                            paint={{
                                'fill-color': '#d3d3d3',
                                'fill-opacity': 0.5,
                            }}
                        />
                        <Layer
                            id="neighborhood-outline"
                            type="line"
                            paint={{
                                'line-color': '#333',
                                'line-width': 1,
                            }}
                        />
                    </Source>
                )}

                {points && (
                    <Source id="homicides" type="geojson" data={points}>
                        <Layer
                            id="homicide-points"
                            type="circle"
                            paint={{
                                'circle-radius': 4,
                                'circle-color': 'red',
                                'circle-stroke-width': 1,
                                'circle-stroke-color': 'white',
                            }}
                        />
                    </Source>
                )}

                {popupInfo && popupInfo.properties && (
                    <Popup
                        longitude={popupInfo.lngLat.lng}
                        latitude={popupInfo.lngLat.lat}
                        closeOnClick={false}
                        onClose={() => setPopupInfo(null)}
                    >
                        <div style={{ maxWidth: 200 }}>
                            <strong>{popupInfo.properties.boroname}</strong><br />
                            Date: {popupInfo.properties.incident_d}<br />
                            Weapon: {popupInfo.properties.weapon}<br />
                            Victims: {popupInfo.properties.num_victim}<br />
                            Light/Dark: {popupInfo.properties.light_dark}
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}

export default App;
