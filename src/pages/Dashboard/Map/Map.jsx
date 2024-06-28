import "./Map.css";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { useGetMapData } from "../../../hooks/use-maps";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "sonner";

import "./AccuratePosition";  // Assuming AccuratePosition.js is the file that contains the AccuratePosition code

const Map = () => {
    const {
        data: victims,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useGetMapData();

    const mapContainer = useRef(null);
    const map = useRef(null);
    const userMarker = useRef(null); // Reference for the user marker
    const [zoom] = useState(12);

    var defaultIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
    var dangerIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
    var inProgressIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        if (!mapContainer.current) return; // Ensure the container is mounted

        if (!map.current) {
            map.current = L.map(mapContainer.current, {
                center: [32.303485, 35.035594], // Set an initial center
                zoom: zoom,
            });

            // Create a MapTiler Layer inside Leaflet
            const mapTilerLayer = new MaptilerLayer({
                apiKey: "q0y4wUaL3vWq9jZ5Yfa0",
            });
            mapTilerLayer.addTo(map.current);

            // Request accurate position
            map.current.findAccuratePosition({
                maxWait: 15000,
                desiredAccuracy: 30
            });

            // Event listeners for accurate position
            map.current.on('accuratepositionprogress', (e) => {
                console.log('Accuracy progress:', e.accuracy);
                console.log('Position:', e.latlng);
            });

            map.current.on('accuratepositionfound', (e) => {
                console.log('Accurate position found:', e.latlng);
                if (userMarker.current) {
                    userMarker.current.setLatLng(e.latlng);
                } else {
                    userMarker.current = L.marker(e.latlng, { icon: defaultIcon }).addTo(map.current);
                }
                userMarker.current.bindPopup("<b>Accurate Location</b>").openPopup();
                map.current.setView(e.latlng, zoom);
            });

            map.current.on('accuratepositionerror', (e) => {
                console.log('Accurate position error:', e.message);
                toast.error("Unable to retrieve your accurate location.");
            });
        }
    }, [zoom]);

    useEffect(() => {
        if (isSuccess && map.current) {
            victims.forEach((v) => {
                if (v.location) {
                    const marker = L.marker(
                        [v.location.latitude, v.location.longitude],
                        {
                            icon: v.status === "danger" ? dangerIcon : inProgressIcon,
                        }
                    ).addTo(map.current);
                    marker
                        .bindPopup(`<b>${v.name}, ${v.location.latitude}, ${v.location.longitude}</b>`)
                        .openPopup();
                }
            });
        }
    }, [victims, isSuccess]);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        toast.error(error.response.data.message || "Something went wrong");
    }

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
};

export default Map;
