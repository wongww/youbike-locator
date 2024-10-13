"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
  };
  const [closestStation, setClosestStation] = useState(null);
  // Haversine formula to calculate the distance between two lat/lng points
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  };
  const findClosestStation = (data, lat, lng) => {
    let closest = null;
    let smallestDistance = Number.MAX_VALUE;

    data.forEach((station) => {
      const stationLat = parseFloat(station.lat);
      const stationLng = parseFloat(station.lng);
      const distance = getDistance(lat, lng, stationLat, stationLng);

      // Check if the distance is smaller than the current smallest
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closest = station;
      }
    });

    return closest;
  };
  const fetchStations = async () => {
    try {
      const response = await fetch(
        "https://apis.youbike.com.tw/json/station-yb2.json",
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse JSON data
      return data;
      // setStations(data); // Update the state with the fetched data
      // setLoading(false); // Set loading to false after data is loaded
    } catch (error) {
      console.error(error);
      // setError(error.message); // Handle any errors during fetch
      // setLoading(false);
    }
  };

  async function success(pos) {
    const crd = pos.coords;

    // Threshold for considering a "close" match
    const threshold = 0.001; // You can adjust this as needed

    const data = await fetchStations();
    const station = findClosestStation(data, crd.latitude, crd.longitude);
    setClosestStation(station);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          The closest <span>YouBike</span> Station near you is:
        </ol>

        <div>
          {closestStation ? (
            <a
              href={`https://www.google.com/maps?q=${closestStation.lat},${closestStation.lng}`}
            >
              {closestStation?.name_tw} {closestStation?.name_en} →
            </a>
          ) : (
            "Locating ..."
          )}
        </div>
      </main>
    </div>
  );
}
