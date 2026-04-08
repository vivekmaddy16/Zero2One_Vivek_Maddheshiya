import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';

const defaultMarkerStyle = (color, label) => new Style({
  image: new CircleStyle({
    radius: 10,
    fill: new Fill({ color: color || '#2563eb' }),
    stroke: new Stroke({ color: '#fff', width: 2 })
  }),
  text: new Text({
    text: label || '',
    offsetY: -18,
    fill: new Fill({ color: '#000' }),
    stroke: new Stroke({ color: '#fff', width: 3 }),
    font: 'bold 12px Arial'
  })
});

export default function MapView({ markers = [], center, zoom = 12, className = '' }) {
  const mapElement = useRef();
  const mapRef = useRef();
  const vectorSourceRef = useRef();

  useEffect(() => {
    if (!mapElement.current) return;

    if (!mapRef.current) {
      vectorSourceRef.current = new VectorSource();
      const vectorLayer = new VectorLayer({ source: vectorSourceRef.current });

      mapRef.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayer
        ],
        view: new View({
          center: center ? fromLonLat([center.lng, center.lat]) : fromLonLat([0, 0]),
          zoom,
          minZoom: 2,
          maxZoom: 18
        })
      });
      mapRef.current.updateSize();
    }

    const view = mapRef.current.getView();
    if (center) {
      view.setCenter(fromLonLat([center.lng, center.lat]));
      view.setZoom(zoom);
    }
    requestAnimationFrame(() => mapRef.current?.updateSize());
  }, [center, zoom]);

  useEffect(() => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();
    const validMarkers = markers.filter((marker) => Number.isFinite(marker.lat) && Number.isFinite(marker.lng));

    validMarkers.forEach((marker) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([marker.lng, marker.lat])),
        name: marker.label || marker.name || ''
      });
      feature.setStyle(defaultMarkerStyle(marker.color, marker.label?.slice(0, 2).toUpperCase()));
      vectorSourceRef.current.addFeature(feature);
    });

    if (validMarkers.length > 0 && !center) {
      const first = validMarkers[0];
      mapRef.current.getView().setCenter(fromLonLat([first.lng, first.lat]));
      mapRef.current.getView().setZoom(zoom);
    }
  }, [markers, center, zoom]);

  return (
    <div className={`rounded-2xl overflow-hidden border border-slate-200 bg-white w-full h-80 ${className}`}>
      <div ref={mapElement} className="w-full h-full" />
    </div>
  );
}
