"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { mountDoodles } from "@/lib/doodles";
export function DoodleLayer() {
  const path = usePathname();
  useEffect(() => mountDoodles(path), [path]);
  return null;
}
