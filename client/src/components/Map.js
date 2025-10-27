import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "400px" };
const center = { lat: -1.2921, lng: 36.8219 }; // Nairobi default

const SafeMap = ({ stations }) => (
  <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      {stations.map((s, i) => (
        <Marker key={i} position={{ lat: s.lat, lng: s.lng }} title={s.name} />
      ))}
    </GoogleMap>
  </LoadScript>
);

export default SafeMap;
