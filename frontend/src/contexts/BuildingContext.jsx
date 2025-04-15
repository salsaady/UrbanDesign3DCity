import { createContext, useContext, useState } from "react";

/**
 * BuildingContext.js Provides a context to share the selected building state across the app.
 */

// BuildingContext created with a default value
const BuildingContext = createContext({
  selectedBuilding: null,
  setSelectedBuilding: () => {}
});

// Provider component to wrap the app
export default function BuildingProvider({ children }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const value = {
    selectedBuilding,
    setSelectedBuilding,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
}

// A custom hook to access the building context easily
export function useBuilding() {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error("useBuilding must be used within a BuildingProvider");
  }
  return context;
}
