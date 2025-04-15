import React from 'react';
import { useBuilding } from '../contexts/BuildingContext';

/**
 * BuildingPopup component renders details for the currently selected building.
 * It uses the BuildingContext to access selectedBuilding and setSelectedBuilding.
 */
const BuildingPopup = () => {
  const { selectedBuilding, setSelectedBuilding } = useBuilding();

  // If no building is selected, don't render the popup.
  if (!selectedBuilding) return null;

  return (
    <div >
      <h3>Building Details</h3>
      <p>
        <strong>ID:</strong> {selectedBuilding.id}
      </p>
      <p>
        <strong>Address:</strong> {selectedBuilding.address || 'N/A'}
      </p>
      <p>
        <strong>Height:</strong> {selectedBuilding.height} ft
      </p>
      <button onClick={() => setSelectedBuilding(null)}>Close</button>
    </div>
  );
};

export default BuildingPopup;
