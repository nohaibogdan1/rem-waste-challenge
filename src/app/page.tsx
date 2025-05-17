"use client";

import SizesPicker  from "@/components/SizesPicker";
export default function Home() {
  return <SizesPicker hasHeavyWaste selectSize={(id: number) => {console.log("id", id)}} />
}
