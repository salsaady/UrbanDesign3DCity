from flask import Flask, jsonify
from flask_cors import CORS
import geopandas as gpd
import os

"""
A simple Flask API that serves building data from a GeoJSON file.
The data is loaded from the City of Calgary 3D Buildings dataset and 
exposed via the /api/buildings endpoint in JSON format.
"""

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# Set the path to the downloaded GeoJSON file from the dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GEOJSON_PATH = os.path.join(BASE_DIR, 'data', 'buildings.geojson')

gdf = gpd.read_file(GEOJSON_PATH)

# Build a list of dictionaries to serve via the API
buildings = []
for _, row in gdf.iterrows():
    # Convert geometry to the GeoJSON format
    geometry = row["geometry"].__geo_interface__

    # Compute the building's height
    try:
        rooftop = float(row.get("rooftop_elev_z", 0))
        ground_max = float(row.get("grd_elev_max_z", 0))
        height = rooftop - ground_max
    except Exception:
        height = None

    buildings.append({
        "id": row.get("id"),     
        "geometry": geometry,
        "height": row.get("height"),
        "stage": row.get("stage"),        
        "address": row.get("address"),
    })

@app.route("/api/buildings")
def get_buildings():
    return jsonify(buildings)

if __name__ == "__main__":
    app.run(debug=True)
