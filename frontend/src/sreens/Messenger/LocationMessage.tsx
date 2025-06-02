// import { useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMap, MapContainerProps } from 'react-leaflet';
// import L, { LatLngExpression } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import './LocationMessage.scss';

// // Фикс для маркеров
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // @ts-ignore
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: markerIcon,
//   iconRetinaUrl: markerIcon2x,
//   shadowUrl: markerShadow,
// });

// type LocationMessageProps = {
//   lat: number;
//   lng: number;
//   address?: string;
//   onViewDetails?: () => void;
//   onClose?: () => void;
// };

// const DefaultMarker = () => {
//   const map = useMap();
//   map.setView([map.getCenter().lat, map.getCenter().lng], 13);
//   return null;
// };

// export const LocationPreview = ({ lat, lng, address, onViewDetails }: LocationMessageProps) => {
//   const position: LatLngExpression = [lat, lng];
  
//   return (
//     <div className="location-preview" onClick={onViewDetails}>
//       <MapContainer
//         center={position}
//         zoom={13}
//         scrollWheelZoom={false}
//         dragging={false}
//         doubleClickZoom={false}
//         zoomControl={false}
//         touchZoom={false}
//         className="mini-map"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         />
//         <Marker position={position} />
//         <DefaultMarker />
//       </MapContainer>
//       {address && <div className="location-address">{address}</div>}
//     </div>
//   );
// };

// export const LocationModal = ({ lat, lng, address, onClose }: LocationMessageProps) => {
//   const position: LatLngExpression = [lat, lng];
  
//   return (
//     <div className="location-modal-overlay" onClick={onClose}>
//       <div className="location-modal-content" onClick={(e) => e.stopPropagation()}>
//         <MapContainer
//           center={position}
//           zoom={13}
//           scrollWheelZoom={true}
//           className="full-map"
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           />
//           <Marker position={position} />
//         </MapContainer>
//         <div className="location-modal-footer">
//           {address && <div className="address">{address}</div>}
//           <button onClick={onClose} className="close-btn">
//             Закрыть
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
export {}