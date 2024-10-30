import calculateDistance from "../app/util/distance";

export default async function fetchStations(): Promise<StationInfo[]> {
  try {
    const response = await fetch(process.env.YOUBIKE_API);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch {
    return [];
  }
}

export const findClosestStation = async (lat: number, lng: number) => {
  let closestStation = null;
  let smallestDistance = Number.MAX_VALUE;

  const stationList = await fetchStations();

  stationList.forEach((station) => {
    const stationLat = parseFloat(station.lat);
    const stationLng = parseFloat(station.lng);
    const distance = calculateDistance(lat, lng, stationLat, stationLng);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestStation = station;
    }
  });

  return closestStation;
};
