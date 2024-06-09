import "./Map.css";
import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const center = { lng:35.06069 , lat:32.32978  }; // Coordinates for Anabta city
    const [zoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // stops map from initializing more than once

        map.current = new L.Map(mapContainer.current, {
            center: L.latLng(center.lat, center.lng),
            zoom: zoom,
        });

        // Create a MapTiler Layer inside Leaflet
        const mtLayer = new MaptilerLayer({
            // Get your free API key at https://cloud.maptiler.com
            apiKey: "q0y4wUaL3vWq9jZ5Yfa0",
        }).addTo(map.current);

        // Add a marker to the map at the center coordinates
        const marker = L.marker([center.lat, center.lng]).addTo(map.current);
        marker.bindPopup("<b>My Location</b>").openPopup();
    }, [center.lng, center.lat, zoom]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
};

export default Map;
