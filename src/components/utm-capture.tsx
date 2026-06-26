"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";

// Mounts once in the root layout; records first-touch attribution.
export function UtmCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
