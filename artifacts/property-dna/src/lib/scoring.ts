import type { ComponentTemplate, ConditionScore, RepairUrgency } from "./types";
import {
  COMPONENT_TEMPLATES,
  COMPONENT_WEIGHTS,
  CONDITION_LABELS,
  URGENCY_FROM_SCORE,
} from "./types";

export function conditionLabel(score: ConditionScore): string {
  return CONDITION_LABELS[score];
}

export function repairUrgency(score: ConditionScore): RepairUrgency {
  return URGENCY_FROM_SCORE[score];
}

export function estimateRepairCost(
  template: ComponentTemplate,
  score: ConditionScore,
): number {
  const multiplier = (6 - score) / 5;
  return Math.round(template.baseRepairCost * multiplier);
}

export function remainingLifeYears(
  template: ComponentTemplate,
  score: ConditionScore,
): number {
  const factor = score / 5;
  return Math.max(0, Math.round(template.defaultLifespan * factor));
}

export function computeOverallScore(
  components: { component_key: string; condition_score: ConditionScore }[],
): number {
  if (components.length === 0) return 0;
  let total = 0;
  let weightSum = 0;
  for (const c of components) {
    const w = COMPONENT_WEIGHTS[c.component_key] ?? 0.05;
    total += (c.condition_score / 5) * w * 100;
    weightSum += w;
  }
  return Math.round(total / (weightSum || 1));
}

export function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function riskFromScore(score: number): "low" | "moderate" | "high" | "critical" {
  if (score >= 80) return "low";
  if (score >= 65) return "moderate";
  if (score >= 45) return "high";
  return "critical";
}

export function totalRepairCost(
  components: { estimated_repair_cost: number }[],
): number {
  return components.reduce((sum, c) => sum + c.estimated_repair_cost, 0);
}

export function defaultComponents() {
  return COMPONENT_TEMPLATES.map((t) => ({
    component_key: t.key,
    component_name: t.name,
    category: t.category,
    condition_score: 3 as ConditionScore,
    condition_label: conditionLabel(3),
    estimated_repair_cost: estimateRepairCost(t, 3),
    repair_urgency: repairUrgency(3),
    remaining_life_years: remainingLifeYears(t, 3),
    notes: "",
  }));
}
