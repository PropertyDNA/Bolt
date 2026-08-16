export type PropertyType =
  | "single_family"
  | "multi_family"
  | "condo"
  | "townhouse"
  | "commercial";

export type RiskLevel = "low" | "moderate" | "high" | "critical";
export type PropertyStatus = "draft" | "completed";
export type ConditionScore = 1 | 2 | 3 | 4 | 5;
export type RepairUrgency =
  | "immediate"
  | "short_term"
  | "long_term"
  | "monitor";

export type ComponentCategory =
  | "structural"
  | "mechanical"
  | "exterior"
  | "interior";

export interface Property {
  id: string;
  name: string;
  address: string | null;
  property_type: PropertyType;
  year_built: number | null;
  square_footage: number | null;
  overall_score: number;
  overall_grade: string;
  estimated_total_repair_cost: number;
  risk_level: RiskLevel;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface PropertyComponent {
  id: string;
  property_id: string;
  component_key: string;
  component_name: string;
  category: ComponentCategory;
  condition_score: ConditionScore;
  condition_label: string;
  estimated_repair_cost: number;
  repair_urgency: RepairUrgency;
  remaining_life_years: number;
  notes: string | null;
  created_at: string;
}

export interface PropertyWithComponents extends Property {
  components: PropertyComponent[];
}

export interface ComponentTemplate {
  key: string;
  name: string;
  category: ComponentCategory;
  defaultLifespan: number;
  baseRepairCost: number;
  description: string;
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    key: "roof",
    name: "Roof",
    category: "exterior",
    defaultLifespan: 25,
    baseRepairCost: 12000,
    description: "Shingles, underlayment, flashing, and structural decking",
  },
  {
    key: "foundation",
    name: "Foundation",
    category: "structural",
    defaultLifespan: 100,
    baseRepairCost: 15000,
    description: "Slab, crawlspace, or basement walls and footings",
  },
  {
    key: "hvac",
    name: "HVAC System",
    category: "mechanical",
    defaultLifespan: 15,
    baseRepairCost: 8000,
    description: "Furnace, AC compressor, ductwork, and thermostat",
  },
  {
    key: "plumbing",
    name: "Plumbing",
    category: "mechanical",
    defaultLifespan: 40,
    baseRepairCost: 5500,
    description: "Supply lines, drain lines, fixtures, and shut-off valves",
  },
  {
    key: "electrical",
    name: "Electrical",
    category: "mechanical",
    defaultLifespan: 50,
    baseRepairCost: 6000,
    description: "Panel, wiring, outlets, and grounding",
  },
  {
    key: "siding",
    name: "Siding",
    category: "exterior",
    defaultLifespan: 30,
    baseRepairCost: 9000,
    description: "Exterior cladding, trim, and weatherproofing",
  },
  {
    key: "windows",
    name: "Windows & Doors",
    category: "exterior",
    defaultLifespan: 25,
    baseRepairCost: 7000,
    description: "Frames, glass seals, weatherstripping, and hardware",
  },
  {
    key: "insulation",
    name: "Insulation",
    category: "interior",
    defaultLifespan: 80,
    baseRepairCost: 4000,
    description: "Attic, wall, and crawlspace insulation plus air sealing",
  },
  {
    key: "water_heater",
    name: "Water Heater",
    category: "mechanical",
    defaultLifespan: 12,
    baseRepairCost: 2200,
    description: "Tank or tankless unit, connections, and expansion tank",
  },
  {
    key: "garage",
    name: "Garage",
    category: "exterior",
    defaultLifespan: 30,
    baseRepairCost: 3500,
    description: "Door, opener, springs, and slab condition",
  },
];

export const COMPONENT_WEIGHTS: Record<string, number> = {
  roof: 0.18,
  foundation: 0.2,
  hvac: 0.14,
  plumbing: 0.12,
  electrical: 0.1,
  siding: 0.08,
  windows: 0.07,
  insulation: 0.04,
  water_heater: 0.04,
  garage: 0.03,
};

export const CONDITION_LABELS: Record<ConditionScore, string> = {
  1: "Critical",
  2: "Poor",
  3: "Fair",
  4: "Good",
  5: "Excellent",
};

export const URGENCY_FROM_SCORE: Record<ConditionScore, RepairUrgency> = {
  1: "immediate",
  2: "short_term",
  3: "long_term",
  4: "monitor",
  5: "monitor",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: "Single Family",
  multi_family: "Multi-Family",
  condo: "Condominium",
  townhouse: "Townhouse",
  commercial: "Commercial",
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "text-emerald-600 bg-emerald-50 border-emerald-200",
  moderate: "text-amber-600 bg-amber-50 border-amber-200",
  high: "text-orange-600 bg-orange-50 border-orange-200",
  critical: "text-red-600 bg-red-50 border-red-200",
};
