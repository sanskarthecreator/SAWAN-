import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import L, { LatLng, Map } from 'leaflet';
import * as turf from '@turf/turf';
import { RoofMaterial } from '../types';

interface Step1LocationProps {
    onNext: (data: { lat: number; lng: number; roofArea: number; roofMaterial: RoofMaterial }) => void;
    initialData: { roofArea?: number; roofMaterial?: RoofMaterial };
}

const ROOF_MATERIAL_OPTIONS = [
    { value: RoofMaterial.RCC, label: 'RCC (Concrete)' },
    { value: RoofMaterial.METAL, label: 'Metal Sheet' },
    { value: RoofMaterial.TILES, label: 'Tiles' },
    { value: RoofMaterial.ASPHALT, label: 'Asphalt Shingles' },
    { value: RoofMaterial.THATCH, label: 'Thatch' },
];

const Step1Location: React.FC<Step1LocationProps> = ({ onNext, initialData }) => {
    const [map, setMap] = useState<Map | null>(null);
    const [center] = useState<L.LatLngExpression>([20.5937, 78.9629]); // Default to India
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<LatLng[]>([]);
    const [roofArea, setRoofArea] = useState<string>(initialData.roofArea?.toString() || '');
    const [roofMaterial, setRoofMaterial] = useState<RoofMaterial>(initialData.roofMaterial || RoofMaterial.RCC);
    
    useEffect(() => {
        if (map) {
            const container = map.getContainer();
            if (isDrawing) {
                L.DomUtil.addClass(container, 'crosshair-cursor');
            } else {
                L.DomUtil.removeClass(container, 'crosshair-cursor');
            }
        }
    }, [isDrawing, map]);

    const handleMapClick = (latlng: LatLng) => {
        if (!isDrawing) return;

        const newPoints = [...points, latlng];
        setPoints(newPoints);

        if (newPoints.length === 4) {
            setIsDrawing(false);
            // Close the polygon for turf.js
            const turfPoints = [...newPoints.map(p => [p.lng, p.lat]), [newPoints[0].lng, newPoints[0].lat]];
            const turfPolygon = turf.polygon([turfPoints]);
            const calculatedArea = turf.area(turfPolygon);
            setRoofArea(Math.round(calculatedArea).toString());
        }
    };

    const MapEventsHandler: React.FC = () => {
        useMapEvents({
            click(e) {
                handleMapClick(e.latlng);
            },
        });
        return null;
    };

    const handleLocateMe = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (map) {
                    map.flyTo(latLng, 16); // Zoom in closer
                }
            },
            () => {
                alert('Could not get your location. Please enable location services.');
            }
        );
    };

    const handleDrawStart = () => {
        setIsDrawing(true);
        setPoints([]);
        setRoofArea('');
    };

    const handleClearSelection = () => {
        setIsDrawing(false);
        setPoints([]);
        setRoofArea('');
    };

    const isNextDisabled = points.length !== 4 || !roofArea || parseFloat(roofArea) <= 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        
        const turfPoints = points.map(p => [p.lng, p.lat]);
        // Create a valid polygon for centroid calculation
        const polygonForCentroid = turf.polygon([[...turfPoints, turfPoints[0]]]);
        const centerPoint = turf.centroid(polygonForCentroid);
        
        onNext({
            lat: centerPoint.geometry.coordinates[1],
            lng: centerPoint.geometry.coordinates[0],
            roofArea: parseFloat(roofArea),
            roofMaterial,
        });
    };

    const getInstruction = () => {
        if (isDrawing) {
            return `Click corner ${points.length + 1} of 4`;
        }
        if (points.length === 4) {
            return "Roof area drawn. You can now proceed.";
        }
        return "Click 'Draw Roof Area' to start.";
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-2">Step 1: Location & Roof Details</h2>
            <p className="text-gray-600 mb-6">Use the map tools to outline your roof. The area will be calculated automatically, but you can adjust it manually below.</p>
            
            <div className="h-96 md:h-[500px] mb-4 relative border-2 border-gray-400">
                 <MapContainer center={center} zoom={5} scrollWheelZoom={true} className="h-full w-full" ref={setMap}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {points.length > 0 && <Polygon positions={points} pathOptions={{ color: 'blue' }} />}
                    <MapEventsHandler />
                </MapContainer>
                <div className="absolute top-2 left-2 z-[1000] flex flex-col space-y-2">
                    <button type="button" onClick={handleLocateMe} className="bg-white p-2 border border-gray-400">Locate Me</button>
                    <button type="button" onClick={handleDrawStart} disabled={isDrawing} className="bg-white p-2 border border-gray-400 disabled:bg-gray-200">Draw Roof Area</button>
                    <button type="button" onClick={handleClearSelection} className="bg-white p-2 border border-gray-400">Clear Selection</button>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 px-4 py-2 text-sm font-medium text-black border border-gray-400">
                    {getInstruction()}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label htmlFor="roofArea" className="block text-sm font-medium text-gray-700 mb-1">Rooftop Area (m²)</label>
                    <input
                        type="number"
                        id="roofArea"
                        value={roofArea}
                        onChange={(e) => setRoofArea(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-400 focus:outline-blue-500"
                        placeholder="e.g., 150"
                        required
                    />
                     <p className="text-xs text-gray-500 mt-1">Auto-calculated from map, but can be edited.</p>
                </div>
                <div>
                    <label htmlFor="roofMaterial" className="block text-sm font-medium text-gray-700 mb-1">Rooftop Material</label>
                    <select
                        id="roofMaterial"
                        value={roofMaterial}
                        onChange={(e) => setRoofMaterial(e.target.value as RoofMaterial)}
                        className="w-full px-3 py-2 border bg-white border-gray-400"
                    >
                        {ROOF_MATERIAL_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={isNextDisabled}
                    className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default Step1Location;