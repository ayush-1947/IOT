// src/app/api/telemetry/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get ThingsBoard credentials from environment variables
    const TB_TOKEN = process.env.TB_TOKEN;
    const TB_DEVICE_ID = process.env.TB_DEVICE_ID;
    const TB_API_URL = process.env.TB_API_URL || 'https://demo.thingsboard.io';
    
    if (!TB_TOKEN || !TB_DEVICE_ID) {
      return NextResponse.json(
        { error: "ThingsBoard credentials not configured" },
        { status: 500 }
      );
    }

    // Set up time range - get data from last hour
    const endTs = Date.now();
    const startTs = endTs - 3600000; // 1 hour in milliseconds
    
    // Define keys to fetch
    const keys = 'temperature,humidity,windSpeed,pressure';
    
    // Construct the ThingsBoard API URL
    const tbApiUrl = `${TB_API_URL}/api/plugins/telemetry/DEVICE/${TB_DEVICE_ID}/values/timeseries?keys=${keys}&startTs=${startTs}&endTs=${endTs}`;
    
    // Fetch data from ThingsBoard
    const response = await fetch(tbApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${TB_TOKEN}`
      }
    });
    
    if (!response.ok) {
      console.error('ThingsBoard API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch data from ThingsBoard" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in telemetry API route:', error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch telemetry data" },
      { status: 500 }
    );
  }
}