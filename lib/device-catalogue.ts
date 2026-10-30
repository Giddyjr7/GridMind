import {
  Snowflake,
  Refrigerator,
  Flame,
  BatteryCharging,
  Sun,
  Gauge,
  Zap,
  Lightbulb,
  Server,
  Droplets,
  PlusCircle,
  Wind,
  Layers,
  ThermometerSnowflake,
  Activity,
  LucideIcon,
} from "lucide-react";
import { ConnectedDevice, DeviceCategory, DevicePriority } from "@/types/energy";

export interface DeviceCatalogueItem {
  typeId: string;
  name: string;
  category: DeviceCategory;
  defaultPowerKw: number;
  defaultPriority: DevicePriority;
  icon: LucideIcon;
  accentColor: string; // Tailwind bg class for tinted squircle
  accentBorder: string;
  iconColor: string;
  description: string;
}

export const DEVICE_CATALOGUE: DeviceCatalogueItem[] = [
  // Cooling and storage
  {
    typeId: "cold_room",
    name: "Cold room or walk-in freezer",
    category: "cooling",
    defaultPowerKw: 24.0,
    defaultPriority: "critical",
    icon: Snowflake,
    accentColor: "bg-cyan-500/15",
    accentBorder: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    description: "Multi-zone commercial refrigerated storage room.",
  },
  {
    typeId: "blast_freezer",
    name: "Blast freezer",
    category: "cooling",
    defaultPowerKw: 32.0,
    defaultPriority: "critical",
    icon: ThermometerSnowflake,
    accentColor: "bg-blue-500/15",
    accentBorder: "border-blue-500/30",
    iconColor: "text-blue-400",
    description: "Rapid pull-down commercial refrigeration unit.",
  },
  {
    typeId: "display_chiller",
    name: "Display chiller or refrigerator",
    category: "cooling",
    defaultPowerKw: 3.5,
    defaultPriority: "important",
    icon: Refrigerator,
    accentColor: "bg-sky-500/15",
    accentBorder: "border-sky-500/30",
    iconColor: "text-sky-400",
    description: "Retail merchandiser or reach-in cabinet chiller.",
  },
  {
    typeId: "pharma_fridge",
    name: "Medical or vaccine fridge",
    category: "cooling",
    defaultPowerKw: 1.8,
    defaultPriority: "critical",
    icon: Activity,
    accentColor: "bg-emerald-500/15",
    accentBorder: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    description: "Temperature-regulated biologics and vaccine safe.",
  },

  // Power sources
  {
    typeId: "diesel_gen",
    name: "Diesel generator",
    category: "power_sources",
    defaultPowerKw: 80.0,
    defaultPriority: "critical",
    icon: Flame,
    accentColor: "bg-amber-500/15",
    accentBorder: "border-amber-500/30",
    iconColor: "text-amber-400",
    description: "Prime or standby diesel internal combustion genset.",
  },
  {
    typeId: "battery_ess",
    name: "Battery storage (ESS)",
    category: "power_sources",
    defaultPowerKw: 45.0,
    defaultPriority: "critical",
    icon: BatteryCharging,
    accentColor: "bg-emerald-500/15",
    accentBorder: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    description: "Lithium-ion or LiFePO4 battery storage system.",
  },
  {
    typeId: "solar_pv",
    name: "Solar PV array",
    category: "power_sources",
    defaultPowerKw: 40.0,
    defaultPriority: "important",
    icon: Sun,
    accentColor: "bg-yellow-500/15",
    accentBorder: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    description: "Rooftop or ground-mount photovoltaic solar string.",
  },
  {
    typeId: "grid_meter",
    name: "Grid utility meter",
    category: "power_sources",
    defaultPowerKw: 100.0,
    defaultPriority: "critical",
    icon: Gauge,
    accentColor: "bg-violet-500/15",
    accentBorder: "border-violet-500/30",
    iconColor: "text-violet-400",
    description: "Main utility distribution feeder incoming meter.",
  },
  {
    typeId: "inverter",
    name: "Inverter",
    category: "power_sources",
    defaultPowerKw: 50.0,
    defaultPriority: "critical",
    icon: Zap,
    accentColor: "bg-indigo-500/15",
    accentBorder: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    description: "Hybrid microgrid inverter and synchronizer.",
  },

  // Climate and comfort
  {
    typeId: "air_conditioner",
    name: "Air conditioner",
    category: "climate",
    defaultPowerKw: 12.0,
    defaultPriority: "nonessential",
    icon: Wind,
    accentColor: "bg-teal-500/15",
    accentBorder: "border-teal-500/30",
    iconColor: "text-teal-400",
    description: "Packaged office or floor comfort cooling unit.",
  },

  // Operations and other
  {
    typeId: "lighting",
    name: "Lighting",
    category: "operations",
    defaultPowerKw: 5.0,
    defaultPriority: "important",
    icon: Lightbulb,
    accentColor: "bg-orange-500/15",
    accentBorder: "border-orange-500/30",
    iconColor: "text-orange-400",
    description: "High-bay warehouse, facility and perimeter lighting.",
  },
  {
    typeId: "pos_it",
    name: "POS and network equipment",
    category: "operations",
    defaultPowerKw: 3.5,
    defaultPriority: "important",
    icon: Server,
    accentColor: "bg-purple-500/15",
    accentBorder: "border-purple-500/30",
    iconColor: "text-purple-400",
    description: "Server racks, point-of-sale terminals, gate automation.",
  },
  {
    typeId: "water_pump",
    name: "Water pump",
    category: "operations",
    defaultPowerKw: 7.5,
    defaultPriority: "nonessential",
    icon: Droplets,
    accentColor: "bg-cyan-500/15",
    accentBorder: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    description: "Borehole, circulation, or booster pump.",
  },
  {
    typeId: "custom_device",
    name: "Custom device",
    category: "operations",
    defaultPowerKw: 10.0,
    defaultPriority: "important",
    icon: PlusCircle,
    accentColor: "bg-slate-500/15",
    accentBorder: "border-slate-500/30",
    iconColor: "text-slate-300",
    description: "Configure your own monitored equipment.",
  },
];

export const CATEGORY_LABELS: Record<DeviceCategory, string> = {
  cooling: "Cooling and storage",
  power_sources: "Power sources",
  climate: "Climate and comfort",
  operations: "Operations and other",
};

/**
 * Generate a clean URL-friendly workspace handle from a business name.
 * e.g., "Krystal Ice Cold Storage" -> "krystal-ice-cold-storage"
 */
export function slugifyHandle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Pre-configured demo devices matching Krystal Ice Cold Storage mock business.
 */
export function getKrystalDemoDevices(): ConnectedDevice[] {
  const now = new Date().toISOString();
  return [
    {
      id: "dev_krystal_blast_freezer",
      name: "Blast Freezer Room A",
      deviceTypeId: "blast_freezer",
      category: "cooling",
      ratedPowerKw: 32.0,
      priority: "critical",
      connectionState: "simulated",
      source: "demo",
      createdAt: now,
      notes: "Strict threshold: spoilage risk if above -18°C for > 45 mins",
    },
    {
      id: "dev_krystal_cold_room",
      name: "Cold Storage Room B",
      deviceTypeId: "cold_room",
      category: "cooling",
      ratedPowerKw: 24.0,
      priority: "critical",
      connectionState: "simulated",
      source: "demo",
      createdAt: now,
      notes: "Continuous buffer required",
    },
    {
      id: "dev_krystal_pharma_fridge",
      name: "Medical Grade Vaccine Safe",
      deviceTypeId: "pharma_fridge",
      category: "cooling",
      ratedPowerKw: 6.5,
      priority: "critical",
      connectionState: "simulated",
      source: "demo",
      createdAt: now,
      notes: "Zero interruption tolerance; dedicated battery sub-circuit",
    },
    {
      id: "dev_krystal_lighting",
      name: "High-Bay LED Warehouse Lighting",
      deviceTypeId: "lighting",
      category: "operations",
      ratedPowerKw: 5.0,
      priority: "important",
      connectionState: "simulated",
      source: "demo",
      createdAt: now,
    },
    {
      id: "dev_krystal_packaging_ac",
      name: "Packaging Floor HVAC 1 & 2",
      deviceTypeId: "air_conditioner",
      category: "climate",
      ratedPowerKw: 18.0,
      priority: "nonessential",
      connectionState: "simulated",
      source: "demo",
      createdAt: now,
    },
    {
      id: "dev_krystal_admin_ac",
      name: "Admin Office AC Units",
      deviceTypeId: "air_conditioner",
      category: "climate",
      ratedPowerKw: 8.5,
      priority: "nonessential",
      connectionState: "simulated",
      source: "demo",
      createdAt: now,
    },
  ];
}
