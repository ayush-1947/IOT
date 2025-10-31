// src/components/PushDummyData.tsx
import React from "react";
import { db } from "@/lib/firebase"; // Import db from your firebase setup
import { ref, set } from "firebase/database"; // Import required methods from Firebase Realtime Database

// Function to write dummy data to Firebase
const writeDummyData = (): void => {
  set(ref(db, "telemetry"), {
    tempIn: 23.5,
    tempOut: 30.1,
    humIn: 55,
    humOut: 48,
    pressure: 1013,
    rainfall: 2.5,
    windDirection: "NE",
    windSpeed: 3.2,
    windAvg: 2.8,
  })
    .then(() => {
      console.log("Dummy data written successfully!");
    })
    .catch((error) => {
      console.error("Error writing dummy data: ", error);
    });
};

const PushDummyData: React.FC = () => {
  return (
    <div>
      <h2>Push Dummy Data to Firebase</h2>
      <button onClick={writeDummyData}>Push Dummy Data</button>
    </div>
  );
};

export default PushDummyData;
