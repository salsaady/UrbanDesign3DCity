import React, { useRef } from 'react';
import * as THREE from 'three';
import { lonLatToLocal } from '../utils/coordinateConversion';
import { useBuilding } from '../contexts/BuildingContext';

/**
 * Building Component renders a 3D extruded building mesh using Three.js, mapping building height to an orange shade.
 * Uses BuildingContext to highlight the selected building.
 */

// Helper function that maps a height to an HSL colour string.
const getColourForHeight = (height) => {
  const minHeight = 10;   
  const maxHeight = 100;  

  // Clamp the height value.
  const clampedHeight = Math.max(minHeight, Math.min(height, maxHeight));

  const minLightness = 70;
  const maxLightness = 40;
  
  // Interpolate lightness
  const lightness = minLightness - ((clampedHeight - minHeight) / (maxHeight - minHeight)) * (minLightness - maxLightness);

  // Return an HSL colour string with hue fixed at 30 and saturation 100%
  return `hsl(30, 100%, ${lightness}%)`;
  };

const Building = ({ building}) => {
  const {selectedBuilding, setSelectedBuilding} = useBuilding();
  const meshRef = useRef();

  // Convert raw coordinates to local coordinates
  const rawCoords = building.geometry.coordinates[0];
  const localCoords = rawCoords.map(([lon, lat]) => lonLatToLocal(lon, lat));

  // Create a Three.js Shape from the local coordinates.
  const shape = new THREE.Shape();
  if (localCoords.length > 0) {
    const [firstX, firstY] = localCoords[0];
    shape.moveTo(firstX, firstY);
    for (let i = 1; i < localCoords.length; i++) {
      const [x, y] = localCoords[i];
      shape.lineTo(x, y);
    }
    // Close the shape by connecting back to the first coordinate.
    shape.lineTo(firstX, firstY);
  }

  const height = building.height
  const extrudeSettings = { depth: height};

  // Create the extruded geometry for the building
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  extrudeGeometry.rotateX(-Math.PI / 2);

    // Determine building color based on height
    const buildingColour = getColourForHeight(height);
    const isSelected = selectedBuilding && selectedBuilding.id === building.id;

  return (
    <mesh
      ref={meshRef}
      geometry={extrudeGeometry}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBuilding(building)
    }}
    >
      <meshStandardMaterial attach="material" color={isSelected ? 'hotpink' : buildingColour} />
    </mesh>
  );
};

export default Building;
