# Urban Design 3D City Dashboard

A web application that that displays a 3D visualization of Calgary's buildings. The backend uses Flask to serve building data (processed with GeoPandas), and the frontend renders the 3D buildings using React with Three.js (via @react-three/fiber). Users can interact with the map by clicking on buildings to view details such as ID, address, and height.

## Live Demo

Checkout the live application here: https://urban-design-city.vercel.app/

## Features

- **3D Visualization:**  
  Buildings are rendered in 3D with extrusion proportional to their height, and their colors vary based on height.
- **Interactive Selection:**  
  Click on a building to highlight it and view its details in a popup below the map.
- **Geospatial Processing:**  
  Uses GeoPandas to filter building data from Calgary’s open data portal based on a downtown bounding box.
- **Reverse Geocoding:**  
  Retrieves building addresses using reverse geocoding for more informative details.
- **REST API:**  
  A Flask backend serves building data as JSON, which is then fetched by the React frontend.
- **Global State Management:**  
  Uses React context (BuildingContext) to manage the state of the selected building across components.

## Data Source and Update Strategy

The backend loads building data from a static GeoJSON file (data/buildings.geojson), which is generated using a custom Python script (get_buildings.py). This file is updated manually rather than being fetched live from the City of Calgary 3D Buildings API on every request because for this use case the buildings aren't changing often and it would take a really long time to fetch the data upon request. This approach provides better performance and consistency for this use case.

## Diagrams

A UML sequence diagram that documents the application’s flow is included at the root of the repository. See the file named UrbanDesign3DCitySequence.png for a visual representation of the interaction between the frontend and backend.

## Installation

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask backend server:
   ```bash
   python app.py
   ```

### Frontend

1. Navigate to the frontend directory and install the required dependencies:
   ```bash
   npm install
   ```
2. Create a .env file in the frontend directory and add your backend URL as needed:
   ```bash
   VITE_BACKEND_URL=http://127.0.0.1:5000
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```

### Teck Stack

- **Frontend:**

  - React
  - @react-three/fiber
  - @react-three/drei

- **Backend:**
  - Python
  - Flask
  - Flask-CORS
  - GeoPandas
