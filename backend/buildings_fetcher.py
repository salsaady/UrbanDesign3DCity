import requests
import geopandas as gpd
import os
from shapely.geometry import shape, Polygon
from geopy.geocoders import Nominatim

def reverse_geocode(lat, lon, geolocator):
    """
    Reverse geocodes the given latitude and longitude using the provided geolocator.

    Args:
        lat (float): Latitude of the point.
        lon (float): Longitude of the point.
        geolocator (object): Geocoder instance with a reverse() method.

    Returns:
        str: Address string if found; "Unknown" if not; "Error" on exception.
    """
    try:
        location = geolocator.reverse((lat, lon), timeout=10)
        return location.address if location else "Unknown"
    except Exception as e:
        print(f"Reverse geocoding error at ({lat}, {lon}): {e}")
        return "Error"

def compute_height(row):
    """
    Computes the building's height as the difference between the rooftop elevation and 
    the maximum ground elevation, rounded to two decimal places.

    Args:
        row (pandas.Series): A row from the GeoDataFrame containing building data.

    Returns:
        float or None: The rounded height if the values are valid, otherwise None.
    """
    try:
        height_diff = float(row["building_top_z"]) - float(row["ground_max_z"])
        return round(height_diff, 2)
    except (ValueError, TypeError):
        return None


def compute_centroids(gdf, source_crs="EPSG:4326", proj_crs="EPSG:3857"):
    """
    Computes centroids for the geometries in the GeoDataFrame.

    Args:
        gdf (GeoDataFrame): The input GeoDataFrame with geometries.
        source_crs (str): The coordinate reference system of the input GeoDataFrame.
        proj_crs (str): The projected CRS to use for centroid computation.

    Returns:
        GeoSeries: A GeoSeries of centroids reprojected back to source_crs.
    """
    # Reproject the GeoDataFrame to a projected CRS for accurate centroid computation
    gdf_proj = gdf.to_crs(proj_crs)
    gdf_proj["centroid_proj"] = gdf_proj.geometry.centroid
    # Reproject the centroid column back to the source CRS
    centroids_wgs84 = gdf_proj["centroid_proj"].to_crs(source_crs)
    return centroids_wgs84

def get_buildings():
    """
    Fetch building data from the City of Calgary 3D Buildings dataset,
    filter to a bounding area, compute centroids and addresses, and store the result locally as a GeoJSON file
    
    Returns:
        GeoDataFrame: Filtered GeoDataFrame
    """
    # retrieve the dataset URL
    BASE_URL = "https://data.calgary.ca/resource/cchr-krqg.geojson"
    
    # Define bounding coordinated (around 3 blocks in downtown Calgary)
    north = 51.0465
    south = 51.0440
    west = -114.0685
    east = -114.0635

    # Use the Socrata within_box function to filter the data
    params = {
        "$where": f"within_box(polygon, {north}, {west}, {south}, {east})",
        "$limit": 1000
    }
    
    # Make the GET request with the parameters.
    resp = requests.get(BASE_URL, params=params)
    resp.raise_for_status()

    # Load the JSON response into a GeoDataFrame.
    geojson_data = resp.json()
    gdf = gpd.GeoDataFrame.from_features(geojson_data["features"])
    
    if gdf.crs is None:
        gdf.crs = "EPSG:4326"
    else:
        gdf = gdf.to_crs("EPSG:4326")
    
    print("Total features fetched after SoQL filtering:", len(gdf))
    print("Dataset bounds (xmin, ymin, xmax, ymax):", gdf.total_bounds)
    
    # rename some columns for clarity
    gdf = gdf.rename(
        columns={
            "struct_id": "id",
            "grd_elev_min_z": "ground_min_z",
            "grd_elev_max_z": "ground_max_z",
            "rooftop_elev_z": "building_top_z"
        }
    )
    
    gdf["height"] = gdf.apply(compute_height, axis=1)
    
    # find centroids
    gdf["centroid"] = compute_centroids(gdf)
    
    # Perform reverse geocoding on each centroid
    geolocator = Nominatim(user_agent="urban_design_app")
    gdf["address"] = gdf["centroid"].apply(lambda point: reverse_geocode(point.y, point.x, geolocator))
    
    # only save geometry column
    gdf = gdf.set_geometry("geometry")
    gdf = gdf.drop(columns=["centroid", "centroid_proj"], errors="ignore")
    
    # Save the resulting GeoDataFrame locally to a GeoJSON file
    output_path = os.path.join("data", "buildings.geojson")
    gdf.to_file(output_path, driver="GeoJSON")
    print(f"Saved {len(gdf)} filtered buildings to {output_path}")
    
    return gdf

if __name__ == "__main__":
    downtown_buildings = get_buildings()
