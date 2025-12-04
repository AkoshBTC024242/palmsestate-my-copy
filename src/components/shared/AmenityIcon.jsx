import React from "react";
import { Wifi, Car, Droplet, Dumbbell, Trees, Wind, Waves, Shield, TvMinimal, Utensils, Sparkles, Home } from "lucide-react";

const amenityIcons = {
  "WiFi": Wifi,
  "Wi-Fi": Wifi,
  "Internet": Wifi,
  "Parking": Car,
  "Pool": Waves,
  "Swimming Pool": Waves,
  "Gym": Dumbbell,
  "Fitness Center": Dumbbell,
  "Laundry": Droplet,
  "In-Unit Laundry": Droplet,
  "Air Conditioning": Wind,
  "AC": Wind,
  "Central Air": Wind,
  "Balcony": Trees,
  "Patio": Trees,
  "Garden": Trees,
  "Security": Shield,
  "24/7 Security": Shield,
  "TV": TvMinimal,
  "Cable": TvMinimal,
  "Kitchen": Utensils,
  "Updated Kitchen": Utensils,
  "Dishwasher": Sparkles,
  "Pet Friendly": Home,
  "Pet-Friendly": Home
};

export default function AmenityIcon({ amenity, className = "w-4 h-4" }) {
  const Icon = amenityIcons[amenity] || Home;
  return <Icon className={className} />;
}

export function getAmenityIcon(amenity) {
  return amenityIcons[amenity] || Home;
}