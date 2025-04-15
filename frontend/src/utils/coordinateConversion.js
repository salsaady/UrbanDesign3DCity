/**
 * Provides helper functions to convert longitude/latitude coordinates
 * to local Cartesian coordinates using a fixed origin.
 */

// Constants for Earth (in meters)
const EARTH_RADIUS = 6378137; // meters
const DEG_TO_RAD = Math.PI / 180;

// Reference point near the center of dataset
export const ORIGIN_LON = -114.064;
export const ORIGIN_LAT = 51.045;

export function lonLatToLocal(lon, lat) {
  // convert degrees difference to meters
  const x =
    (lon - ORIGIN_LON) *
    DEG_TO_RAD *
    EARTH_RADIUS *
    Math.cos(ORIGIN_LAT * DEG_TO_RAD);
  const y = (lat - ORIGIN_LAT) * DEG_TO_RAD * EARTH_RADIUS;
  return [x, y];
}
