// src/app/api/mock-telemetry/route.ts
import { NextResponse } from 'next/server';

// Function to generate random value within a range
function randomValue(min: number, max: number, precision: number = 1): number {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(precision));
}

// Function to generate timestamp array
function generateTimeSeries(count: number, startTime: number, interval: number = 60000): number[] {
  const series: number[] = [];
  let timestamp = startTime;
  
  for (let i = 0; i < count; i++) {
    series.push(timestamp);
    timestamp -= interval; // Move back in time
  }
  
  return series.reverse(); // Return in chronological order
}

export async function GET() {
  try {
    // Number of data points to generate
    const dataPoints = 60; // 1 hour of data at 1 minute intervals
    
    // Generate timestamps (now to 1 hour ago in 1 minute intervals)
    const endTime = Date.now();
    const timestamps = generateTimeSeries(dataPoints, endTime, 60000);
    
    // Generate sensor data with realistic patterns
    const result: Record<string, Array<{ts: number, value: number}>> = {
      temperature: [],
      humidity: [],
      windSpeed: [],
      pressure: []
    };
    
    // Base values
    let tempBase = 23.5;    // Starting temperature
    let humidityBase = 55;  // Starting humidity
    let windBase = 8;       // Starting wind speed
    let pressureBase = 1013; // Starting pressure
    
    // Generate data points with some realistic fluctuations
    for (let i = 0; i < dataPoints; i++) {
      // Add some random variation
      tempBase += randomValue(-0.5, 0.5, 2);
      humidityBase += randomValue(-2, 2, 1);
      windBase += randomValue(-1, 1, 1);
      pressureBase += randomValue(-0.5, 0.5, 1);
      
      // Keep within realistic bounds
      tempBase = Math.max(18, Math.min(35, tempBase));
      humidityBase = Math.max(30, Math.min(95, humidityBase));
      windBase = Math.max(0, Math.min(25, windBase));
      pressureBase = Math.max(970, Math.min(1040, pressureBase));
      
      // Add to result
      result.temperature.push({
        ts: timestamps[i],
        value: tempBase
      });
      
      result.humidity.push({
        ts: timestamps[i],
        value: humidityBase
      });
      
      result.windSpeed.push({
        ts: timestamps[i],
        value: windBase
      });
      
      result.pressure.push({
        ts: timestamps[i],
        value: pressureBase
      });
    }
    
    // Randomly trigger alerts in the last few readings
    if (Math.random() > 0.5) {
      // Temperature spike in the last few readings
      for (let i = dataPoints - 5; i < dataPoints; i++) {
        result.temperature[i].value = 27 + randomValue(0, 5, 1);
      }
    }
    
    if (Math.random() > 0.6) {
      // Humidity spike
      for (let i = dataPoints - 7; i < dataPoints; i++) {
        result.humidity[i].value = 62 + randomValue(0, 15, 1);
      }
    }
    
    if (Math.random() > 0.7) {
      // Wind speed increase
      for (let i = dataPoints - 3; i < dataPoints; i++) {
        result.windSpeed[i].value = 11 + randomValue(0, 8, 1);
      }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating mock data:', error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate mock data" },
      { status: 500 }
    );
  }
}