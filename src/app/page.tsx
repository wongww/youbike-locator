"use client";
import { useEffect, useState } from "react";
import { findClosestStation } from "./stations/stations";

const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
};

export default function Home() {
  const [closestStation, setClosestStation] = useState<StationInfo | null>(
    null
  );

  async function success({ coords }: GeolocationPosition) {
    const station = await findClosestStation(coords.latitude, coords.longitude);
    setClosestStation(station);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, null, options);
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
