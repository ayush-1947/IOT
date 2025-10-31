// src/app/page.tsx
import { redirect } from "next/navigation";
import { Footer, Header, Navbar } from "../components";
import SplineComponent from "../components/SplineComponent";
import DashboardClient from "../components/DashboardClient";
import readUserSession from "@/actions";

// This is a Server Component (default in Next.js App Router)
export default async function Home() {
  // Server-side auth check
  const { data } = await readUserSession();
  
  if (!data.session) {
    redirect("/auth");
  }

  return (
    <div className="bg-gradient-to-t from-[#111627] to-[#344378] min-h-screen text-white">
      <div className="absolute w-full h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <Navbar />
          <Header />
        </div>
        <Footer />
      </div>

      <SplineComponent />
      
      {/* Client component that contains all the React hooks and real-time functionality */}
      <DashboardClient />
    </div>
  );
}