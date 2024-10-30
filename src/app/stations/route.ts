import fetchStations from "./stations";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await fetchStations());
}
