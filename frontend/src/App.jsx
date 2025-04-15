import React, { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import './App.css';
import { useBuilding } from './contexts/BuildingContext';
import BuildingPopup from './components/BuildingPopup';

function App() {
  // State to hold the selected building when a user clicks on one
  const {selectedBuilding, setSelectedBuilding} = useBuilding();

  return (
    <div className="App">
      <Header title="Urban Design 3D City" />

      <MapView setSelectedBuilding={setSelectedBuilding} />

      {selectedBuilding && <BuildingPopup/>}
    </div>
  );
}

export default App;
