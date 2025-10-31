// src/components/DashboardClient.tsx
"use client"; // This directive marks this as a Client Component

import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Interfaces for our data types
interface TelemetryPoint {
  ts: number;
  value: number;
  time: string;
  index: number;
}

interface TelemetryData {
  temperature: TelemetryPoint[];
  humidity: TelemetryPoint[];
  windSpeed: TelemetryPoint[];
  pressure: TelemetryPoint[];
}

interface CurrentValues {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

interface Alerts {
  temperature: boolean;
  humidity: boolean;
  windSpeed: boolean;
  pressure: boolean;
}

interface ThresholdValues {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

export default function DashboardClient() {
  // State management
  const [loading, setLoading] = useState<boolean>(true);
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    temperature: [],
    humidity: [],
    windSpeed: [],
    pressure: []
  });
  const [currentValues, setCurrentValues] = useState<CurrentValues>({
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    pressure: 0
  });
  const [alerts, setAlerts] = useState<Alerts>({
    temperature: false,
    humidity: false,
    windSpeed: false,
    pressure: false
  });

  // Alert thresholds
  const thresholds: ThresholdValues = {
    temperature: 25, // °C
    humidity: 60,    // %
    windSpeed: 10,   // km/h
    pressure: 1010   // hPa
  };

  // Fetch telemetry data from ThingsBoard (or mock API)
  useEffect(() => {
    async function fetchTelemetry() {
      try {
        // Using mock API for development - switch to /api/telemetry for production
        const response = await fetch("/api/mock-telemetry");
        
        if (!response.ok) throw new Error("Failed to fetch telemetry");
        
        const data = await response.json();
        
        // Process the data
        const formattedData = processThingsboardData(data);
        setTelemetryData(formattedData.historical);
        setCurrentValues(formattedData.current);
        
        // Check for alerts
        checkAlerts(formattedData.current);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching telemetry:", error);
        setLoading(false);
      }
    }
    
    // Fetch initial data
    fetchTelemetry();
    
    // Set up polling interval
    const intervalId = setInterval(fetchTelemetry, 10000); // Fetch every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Process ThingsBoard data format
  function processThingsboardData(data: any) {
    // Assuming data structure from ThingsBoard API
    const historical = {
      temperature: data.temperature ? data.temperature.map((item: any, index: number) => ({
        time: new Date(item.ts).toLocaleTimeString(),
        value: item.value,
        ts: item.ts,
        index,
      })) : [],
      humidity: data.humidity ? data.humidity.map((item: any, index: number) => ({
        time: new Date(item.ts).toLocaleTimeString(),
        value: item.value,
        ts: item.ts,
        index,
      })) : [],
      windSpeed: data.windSpeed ? data.windSpeed.map((item: any, index: number) => ({
        time: new Date(item.ts).toLocaleTimeString(),
        value: item.value,
        ts: item.ts,
        index,
      })) : [],
      pressure: data.pressure ? data.pressure.map((item: any, index: number) => ({
        time: new Date(item.ts).toLocaleTimeString(),
        value: item.value,
        ts: item.ts,
        index,
      })) : [],
    };
    
    // Get current values (last value from each array)
    const current = {
      temperature: historical.temperature.length ? historical.temperature[historical.temperature.length - 1].value : 0,
      humidity: historical.humidity.length ? historical.humidity[historical.humidity.length - 1].value : 0,
      windSpeed: historical.windSpeed.length ? historical.windSpeed[historical.windSpeed.length - 1].value : 0,
      pressure: historical.pressure.length ? historical.pressure[historical.pressure.length - 1].value : 0,
    };
    
    return { historical, current };
  }

  // Check for alert conditions
  function checkAlerts(values: CurrentValues) {
    setAlerts({
      temperature: values.temperature > thresholds.temperature,
      humidity: values.humidity > thresholds.humidity,
      windSpeed: values.windSpeed > thresholds.windSpeed,
      pressure: values.pressure < thresholds.pressure,
    });
  }

  // Show loading state
  if (loading) {
    return (
      <section className="relative z-10 px-6 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading sensor data...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">📈 Realtime IoT Dashboard</h2>

      {/* Current Values & Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <AlertCard 
          label="🌡️ Temperature" 
          value={`${currentValues.temperature.toFixed(1)}°C`} 
          warning={alerts.temperature} 
          threshold={`>${thresholds.temperature}°C`}
        />
        <AlertCard 
          label="💧 Humidity" 
          value={`${currentValues.humidity.toFixed(1)}%`} 
          warning={alerts.humidity} 
          threshold={`>${thresholds.humidity}%`}
        />
        <AlertCard 
          label="💨 Wind Speed" 
          value={`${currentValues.windSpeed.toFixed(1)} km/h`} 
          warning={alerts.windSpeed} 
          threshold={`>${thresholds.windSpeed} km/h`}
        />
        <AlertCard 
          label="🔄 Pressure" 
          value={`${currentValues.pressure.toFixed(0)} hPa`} 
          warning={alerts.pressure} 
          threshold={`<${thresholds.pressure} hPa`}
        />
      </div>

      {/* 📉 Graphs section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Live Data Visualization</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">Temperature History</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData.temperature}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                  />
                  <YAxis 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                    domain={['auto', 'auto']} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Temperature (°C)"
                    stroke="#ff7300" 
                    activeDot={{ r: 8 }} 
                  />
                  {/* Threshold Line */}
                  <Line 
                    type="monotone" 
                    dataKey={() => thresholds.temperature} 
                    name="Threshold"
                    stroke="#f44336" 
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Humidity Chart */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">Humidity History</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData.humidity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                  />
                  <YAxis 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Humidity (%)"
                    stroke="#2196f3" 
                    activeDot={{ r: 8 }} 
                  />
                  {/* Threshold Line */}
                  <Line 
                    type="monotone" 
                    dataKey={() => thresholds.humidity} 
                    name="Threshold"
                    stroke="#f44336" 
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Wind Speed Chart */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">Wind Speed History</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData.windSpeed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                  />
                  <YAxis 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                    domain={[0, 'auto']} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Wind Speed (km/h)"
                    stroke="#4caf50" 
                    activeDot={{ r: 8 }} 
                  />
                  {/* Threshold Line */}
                  <Line 
                    type="monotone" 
                    dataKey={() => thresholds.windSpeed} 
                    name="Threshold"
                    stroke="#f44336" 
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Pressure Chart */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">Pressure History</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData.pressure}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                  />
                  <YAxis 
                    stroke="#ddd"
                    tick={{ fill: '#ddd' }}
                    domain={['auto', 'auto']} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Pressure (hPa)"
                    stroke="#9c27b0" 
                    activeDot={{ r: 8 }} 
                  />
                  {/* Threshold Line */}
                  <Line 
                    type="monotone" 
                    dataKey={() => thresholds.pressure} 
                    name="Threshold"
                    stroke="#f44336" 
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Enhanced alert card component
interface AlertCardProps {
  label: string;
  value: string;
  warning: boolean;
  threshold: string;
}

function AlertCard({ label, value, warning, threshold }: AlertCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border shadow-lg transition-all duration-300 ${
        warning 
        ? "border-red-500 bg-red-500/10 animate-pulse" 
        : "border-green-500 bg-green-500/10"
      }`}
    >
      <h4 className="text-lg font-medium mb-1">{label}</h4>
      <p className="text-3xl font-bold">{value}</p>
      {warning && (
        <div className="mt-2 flex items-center text-red-400">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
          <p className="text-sm">⚠️ Alert Triggered</p>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2">Threshold: {threshold}</p>
    </div>
  );
}