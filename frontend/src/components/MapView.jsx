import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Building from './Building';
import { Loader2Icon } from "lucide-react";

/**
 * MapView component renders the 3D map by fetching building data from the backend and displaying
 * each building using the <Building /> component.
 */

const MapView = () => {
  // Initialize state variable to hold building data
  const [buildings, setBuildings] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  console.log("Backend URL:", backendURL);
  
  // Fetch building data from the backend when the component mounts
  useEffect(() => {
    fetch(`${backendURL}/api/buildings`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched building data:', data);
        setBuildings(data);
      })
      .catch((error) => {
        console.error('Error fetching building data:', error);
      });
  }, []);


  // If no building data is loaded yet, display a loading indicator.
  if (buildings.length === 0) {
    return (
      <div style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'column'}}>
        <Loader2Icon
          size={48}
          style={{
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
            display: 'inline-block'
            }}
          />        
        <p>Fetching building data...</p>
      </div>
    );
  }
  
  return (
    <div className="map-container" style={{ width: '100%', height: '600px' }}>
      <Canvas
        camera={{ position: [350, 300, 0], fov: 50 }}
        style={{ background: '#e0e0e0' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 150]} intensity={1} />
        <OrbitControls />

        {/* Render the ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[2000, 2000]} />
          <meshStandardMaterial color="#259131" />
        </mesh>
        {/* Render buildings */}
        {buildings.map((building) => (
          <Building
            key={building.id}
            building={building}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default MapView;
