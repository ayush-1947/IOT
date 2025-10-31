"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Card } from "./Card";
import { Icons } from "./icons";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  Parallax,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function Footer() {
  const [tempIn, setTempIn] = useState(0);
  const [tempOut, setTempOut] = useState(0);
  const [humIn, setHumIn] = useState(0);
  const [humOut, setHumOut] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [rainfall, setRainfall] = useState(0);
  const [windDirection, setWindDirection] = useState("NA");
  const [windSpeed, setWindSpeed] = useState(0);
  const [windAvg, setWindAvg] = useState(0);

  useEffect(() => {
    const telemetryRef = ref(db, "telemetry");

    const unsubscribe = onValue(telemetryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTempIn(data.tempIn);
        setTempOut(data.tempOut);
        setHumIn(data.humIn);
        setHumOut(data.humOut);
        setPressure(data.pressure);
        setRainfall(data.rainfall);
        setWindDirection(data.windDirection);
        setWindSpeed(data.windSpeed);
        setWindAvg(data.windAvg);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mx-4">
        <div className="flex flex-col">
          <div className="flex gap-3">
            <h3 className="text-2xl">Wind</h3>
            <Icons.wind className="h-8 w-8 rounded-full bg-[#0e1426] p-1" />
          </div>
          <div className="flex gap-2">
            <p className="text-xl text-[#5f6281]">Direction:</p>
            <p className="text-xl text-white">{windDirection}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-xl text-[#5f6281]">Speed:</p>
            <p className="text-xl text-white">{windSpeed} m/s</p>
          </div>
          <div className="flex gap-2">
            <p className="text-xl text-[#5f6281]">Average:</p>
            <p className="text-xl text-white">{windAvg}</p>
          </div>
        </div>
        <div className="flex items-end">
          <p className="text-xl text-[#5f6281]">Moon Phase</p>
          <Icons.moon className="h-12 w-12" />
        </div>
      </div>
      <div className="flex m-4 gap-3 min-h-60">
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
            Autoplay,
            Parallax,
          ]}
          spaceBetween={10}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          autoplay
          breakpoints={{
            200: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          <SwiperSlide>
            <Card title="Temperature IN" icon={<Icons.temperature />} value={tempIn} unit={"°F"} texts={["", "Indoor Temperature", ""]} />
          </SwiperSlide>
          <SwiperSlide>
            <Card title="Humidity IN" icon={<Icons.droplet />} value={humIn} unit={"%"} texts={["", "Indoor Humidity", ""]} />
          </SwiperSlide>
          <SwiperSlide>
            <Card title="Pressure" icon={<Icons.gauge />} value={pressure} unit={"hPa"} texts={["", "Absolute Pressure", ""]} />
          </SwiperSlide>
          <SwiperSlide>
            <Card title="Rainfall" icon={<Icons.cloudRain />} value={rainfall} unit={"mm"} texts={["", "Total", ""]} />
          </SwiperSlide>
          <SwiperSlide>
            <Card title="Temperature OUT" icon={<Icons.temperature />} value={tempOut} unit={"°F"} texts={["", "Outdoor Temperature", ""]} />
          </SwiperSlide>
          <SwiperSlide>
            <Card title="Humidity OUT" icon={<Icons.droplet />} value={humOut} unit={"%"} texts={["", "Outdoor Humidity", ""]} />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
