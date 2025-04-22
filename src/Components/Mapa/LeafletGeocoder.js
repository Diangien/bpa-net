import  { useEffect, } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";


const atms = async () => {

  try {
   
    const response = await fetch('atms.json'
    
    );
    const result = await response.json();
    console.log(result);
    return result.elements;
  } catch (error) {
    console.error(error);
  }
};
  const atmIconD = L.icon({
    iconUrl: "/icons/atmD.png",
    iconSize: [30, 41],
    iconAnchor: [20, 41],
    popupAnchor: [2, -40],
  });
    const atmIconN = L.icon({
      iconUrl: "/icons/atmS.png",
      iconSize: [30, 41],
      iconAnchor: [20, 41],
      popupAnchor: [2, -40],
    });

const LeafletGeocoder = ({ setAtmMarkers}) => {
  const map = useMap();

  useEffect(() => {
    atms().then((res) => {
      const markers = res.map((el) => {
        const marker = L.marker([el.lat, el.lon],{icon:el.dinheiro? atmIconD:atmIconN}).addTo(map);
        marker.atmData = el;  // Armazena dados do ATM no marcador
        return marker;
      });
      setAtmMarkers(markers);  // Atualiza o estado com os marcadores
    });
  }, [map, setAtmMarkers]);

  return null;
};

export default LeafletGeocoder;
