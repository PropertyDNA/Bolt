import { useState, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Hop as Home, MapPin, Calendar, Ruler, CircleCheck as CheckCircle2, Loader as Loader2, CircleAlert as AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { supabase } from "../lib/supabase";
import {
  COMPONENT_TEMPLATES,
  COMPONENT_WEIGHTS,
  type ConditionScore,
  type PropertyType,
  PROPERTY_TYPE_LABELS,
} from "../lib/types";
import {
  conditionLabel,
  repairUrgency,
  estimateRepairCost,
  remainingLifeYears,
  computeOverallScore,
  gradeFromScore,
  riskFromScore,
  totalRepairCost,
  defaultComponents,
} from "../lib/scoring";
import { cn, formatCurrency } from "../lib/utils";

type Step = "info" | "components" | "review" | "done";

interface PropertyInfo {
  name: string;
  address: string;
  property_type: PropertyType;
  year_built: string;
  square_footage: string;
}

interface ComponentRating {
  component_key: string;
  component_name: string;
  category: string;
  condition_score: ConditionScore;
  notes: string;
}

const conditionDescriptions: Record<ConditionScore, string> = {
  1: "Critical — needs immediate repair or replacement",
  2: "Poor — significant issues, repair needed soon",
  3: "Fair — functional but showing wear, monitor closely",
  4: "Good — minor wear, functioning well",
  5: "Excellent — like new, no issues visible",
};

export default function ScanPage() {
  const [step, setStep] = useState<Step>("info");
  const [property, setProperty] = useState<PropertyInfo>({
    name: "",
    address: "",
    property_type: "single_family",
    year_built: "",
    square_footage: "",
  });
  const [ratings, setRatings] = useState<ComponentRating[]>(
    COMPONENT_TEMPLATES.map((t) => ({
      component_key: t.key,
      component_name: t.name,
      category: t.category,
      condition_score: 3 as ConditionScore,
      notes: "",
    })),
  );
  const [activeComponent, setActiveComponent] = useState(0);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateRating = useCallback(
    (index: number, score: ConditionScore) => {
      setRatings((prev) =>
        prev.map((r, i) => (i === index ? { ...r, condition_score: score } : r)),
      );
    },
    [],
  );

  const updateNotes = useCallback((index: number, notes: string) => {
    setRatings((prev) =>
      prev.map((r, i) => (i === index ? { ...r, notes } : r)),
    );
  }, []);

  const canProceedInfo =
    property.name.trim().length > 0 && property.address.trim().length > 0;

  const computedScore = computeOverallScore(
    ratings.map((r) => ({
      component_key: r.component_key,
      condition_score: r.condition_score,
    })),
  );
  const computedGrade = gradeFromScore(computedScore);
  const computedRisk = riskFromScore(computedScore);

  const computedComponents = ratings.map((r) => {
    const template = COMPONENT_TEMPLATES.find((t) => t.key === r.component_key)!;
    return {
      ...r,
      condition_label: conditionLabel(r.condition_score),
      estimated_repair_cost: estimateRepairCost(template, r.condition_score),
      repair_urgency: repairUrgency(r.condition_score),
      remaining_life_years: remainingLifeYears(template, r.condition_score),
    };
  });

  const computedTotal = totalRepairCost(computedComponents);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const { data: propData, error: propError } = await supabase
        .from("properties")
        .insert({
          name: property.name,
          address: property.address,
          property_type: property.property_type,
          year_built: property.year_built ? parseInt(property.year_built) : null,
          square_footage: property.square_footage
            ? parseInt(property.square_footage)
            : null,
          overall_score: computedScore,
          overall_grade: computedGrade,
          estimated_total_repair_cost: computedTotal,
          risk_level: computedRisk,
          status: "completed",
        })
        .select("id")
        .single();

      if (propError) throw propError;
      const propertyId = propData.id;

      const { error: compError } = await supabase
        .from("property_components")
        .insert(
          computedComponents.map((c) => ({
            property_id: propertyId,
            component_key: c.component_key,
            component_name: c.component_name,
            category: c.category,
            condition_score: c.condition_score,
            condition_label: c.condition_label,
            estimated_repair_cost: c.estimated_repair_cost,
            repair_urgency: c.repair_urgency,
            remaining_life_years: c.remaining_life_years,
            notes: c.notes || null,
          })),
        );

      if (compError) throw compError;

      setCreatedId(propertyId);
      setStep("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save property scan",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (step === "done" && createdId) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100"
          >
            <CheckCircle2 className="h-12 w-12 text-brand-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-navy-900">Scan Complete!</h1>
          <p className="mt-3 text-lg text-navy-500">
            Your property has been scored and saved. Your Property Score is{" "}
            <span className="font-bold text-brand-600">{computedScore}</span>{" "}
            (Grade {computedGrade}).
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href={`/app/${createdId}`}
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              View Property Report
            </Link>
            <Link
              href="/app"
              className="rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar />

      {/* Progress bar */}
      <div className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            {[
              { key: "info", label: "Property Info" },
              { key: "components", label: "Components" },
              { key: "review", label: "Review" },
            ].map((s, i) => {
              const isActive = step === s.key;
              const isPast =
                (step === "components" && s.key === "info") ||
                (step === "review" &&
                  (s.key === "info" || s.key === "components")) ||
                (isSaving && s.key !== "info");
              return (
                <div key={s.key} className="flex flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition",
                      isActive
                        ? "bg-brand-500 text-white"
                        : isPast
                          ? "bg-brand-100 text-brand-700"
                          : "bg-navy-100 text-navy-400",
                    )}
                  >
                    {isPast ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-sm font-medium sm:block",
                      isActive
                        ? "text-navy-900"
                        : isPast
                          ? "text-navy-600"
                          : "text-navy-400",
                    )}
                  >
                    {s.label}
                  </span>
                  {i < 2 && (
                    <div
                      className={cn(
                        "ml-2 h-0.5 flex-1 rounded-full",
                        isPast ? "bg-brand-200" : "bg-navy-100",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Property Info */}
          {step === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-navy-900">
                Tell us about your property
              </h2>
              <p className="mt-2 text-navy-500">
                Basic details so we can identify and score this property.
              </p>
              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy-700">
                    Property Name *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                    <input
                      type="text"
                      value={property.name}
                      onChange={(e) =>
                        setProperty((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g. Maple Street Rental"
                      className="w-full rounded-xl border border-navy-200 py-3 pl-11 pr-4 text-navy-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy-700">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                    <input
                      type="text"
                      value={property.address}
                      onChange={(e) =>
                        setProperty((p) => ({ ...p, address: e.target.value }))
                      }
                      placeholder="123 Main St, Springfield, IL"
                      className="w-full rounded-xl border border-navy-200 py-3 pl-11 pr-4 text-navy-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy-700">
                      Property Type
                    </label>
                    <select
                      value={property.property_type}
                      onChange={(e) =>
                        setProperty((p) => ({
                          ...p,
                          property_type: e.target.value as PropertyType,
                        }))
                      }
                      className="w-full rounded-xl border border-navy-200 px-4 py-3 text-navy-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    >
                      {Object.entries(PROPERTY_TYPE_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy-700">
                      Year Built
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                      <input
                        type="number"
                        value={property.year_built}
                        onChange={(e) =>
                          setProperty((p) => ({
                            ...p,
                            year_built: e.target.value,
                          }))
                        }
                        placeholder="1995"
                        className="w-full rounded-xl border border-navy-200 py-3 pl-11 pr-4 text-navy-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy-700">
                      Square Footage
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                      <input
                        type="number"
                        value={property.square_footage}
                        onChange={(e) =>
                          setProperty((p) => ({
                            ...p,
                            square_footage: e.target.value,
                          }))
                        }
                        placeholder="2000"
                        className="w-full rounded-xl border border-navy-200 py-3 pl-11 pr-4 text-navy-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  disabled={!canProceedInfo}
                  onClick={() => setStep("components")}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Scan
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Component ratings */}
          {step === "components" && (
            <motion.div
              key="components"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">
                    Rate each component
                  </h2>
                  <p className="mt-1 text-navy-500">
                    Component {activeComponent + 1} of {ratings.length}
                  </p>
                </div>
                <span className="rounded-full bg-navy-50 px-3 py-1 text-sm font-medium text-navy-600">
                  {ratings[activeComponent].category}
                </span>
              </div>

              {/* Component tabs */}
              <div className="mb-8 flex flex-wrap gap-2">
                {ratings.map((r, i) => (
                  <button
                    key={r.component_key}
                    onClick={() => setActiveComponent(i)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      i === activeComponent
                        ? "bg-brand-500 text-white"
                        : r.condition_score <= 2
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : r.condition_score === 3
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            : "bg-navy-50 text-navy-600 hover:bg-navy-100",
                    )}
                  >
                    {r.component_name}
                  </button>
                ))}
              </div>

              {/* Active component */}
              <div className="rounded-xl border border-navy-100 bg-navy-50/50 p-6">
                <h3 className="text-xl font-semibold text-navy-900">
                  {ratings[activeComponent].component_name}
                </h3>
                <p className="mt-1 text-sm text-navy-500">
                  {COMPONENT_TEMPLATES.find(
                    (t) => t.key === ratings[activeComponent].component_key,
                  )?.description}
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-navy-700">
                    Condition Rating
                  </p>
                  <div className="grid gap-3 sm:grid-cols-5">
                    {([1, 2, 3, 4, 5] as ConditionScore[]).map((score) => (
                      <button
                        key={score}
                        onClick={() => updateRating(activeComponent, score)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition",
                          ratings[activeComponent].condition_score === score
                            ? score <= 2
                              ? "border-red-400 bg-red-50"
                              : score === 3
                                ? "border-amber-400 bg-amber-50"
                                : "border-brand-400 bg-brand-50"
                            : "border-navy-100 bg-white hover:border-navy-200",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                            score <= 2
                              ? "bg-red-100 text-red-600"
                              : score === 3
                                ? "bg-amber-100 text-amber-600"
                                : "bg-brand-100 text-brand-600",
                          )}
                        >
                          {score}
                        </div>
                        <span className="text-xs font-medium text-navy-700">
                          {conditionLabel(score)}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-navy-500">
                    {
                      conditionDescriptions[
                        ratings[activeComponent].condition_score
                      ]
                    }
                  </p>
                </div>

                <div className="mt-6">
                  <label className="mb-1.5 block text-sm font-medium text-navy-700">
                    Notes (optional)
                  </label>
                  <textarea
                    value={ratings[activeComponent].notes}
                    onChange={(e) => updateNotes(activeComponent, e.target.value)}
                    placeholder="What did you observe? Any visible damage, age of system, recent repairs..."
                    rows={3}
                    className="w-full rounded-xl border border-navy-200 px-4 py-3 text-navy-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep("info")}
                  className="inline-flex items-center gap-2 rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="flex gap-2">
                  {activeComponent < ratings.length - 1 && (
                    <button
                      onClick={() => setActiveComponent((c) => c + 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-navy-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
                    >
                      Next Component
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setStep("review")}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    Review Results
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-navy-900">
                Review your scan
              </h2>
              <p className="mt-2 text-navy-500">
                Here's your property's DNA. Save to add it to your dashboard.
              </p>

              {error && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Score summary */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-navy-50 p-5 text-center">
                  <p className="text-sm text-navy-500">Property Score</p>
                  <p className="mt-1 text-4xl font-extrabold text-navy-900">
                    {computedScore}
                  </p>
                  <p className="text-sm font-medium text-brand-600">
                    Grade {computedGrade}
                  </p>
                </div>
                <div className="rounded-xl bg-navy-50 p-5 text-center">
                  <p className="text-sm text-navy-500">Risk Level</p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-bold capitalize",
                      computedRisk === "low"
                        ? "text-emerald-600"
                        : computedRisk === "moderate"
                          ? "text-amber-600"
                          : computedRisk === "high"
                            ? "text-orange-600"
                            : "text-red-600",
                    )}
                  >
                    {computedRisk}
                  </p>
                </div>
                <div className="rounded-xl bg-navy-50 p-5 text-center">
                  <p className="text-sm text-navy-500">Est. Repair Total</p>
                  <p className="mt-1 text-2xl font-extrabold text-navy-900">
                    {formatCurrency(computedTotal)}
                  </p>
                </div>
              </div>

              {/* Component breakdown */}
              <div className="mt-6 overflow-hidden rounded-xl border border-navy-100">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-100 bg-navy-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-navy-600">
                        Component
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-navy-600">
                        Condition
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-navy-600">
                        Urgency
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-navy-600">
                        Est. Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedComponents.map((c) => (
                      <tr
                        key={c.component_key}
                        className="border-b border-navy-50 last:border-0"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-navy-800">
                          {c.component_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-1.5 w-3 rounded-full",
                                    i < c.condition_score
                                      ? c.condition_score >= 4
                                        ? "bg-brand-400"
                                        : c.condition_score === 3
                                          ? "bg-amber-400"
                                          : "bg-red-400"
                                      : "bg-navy-100",
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-navy-500">
                              {c.condition_label}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                              c.repair_urgency === "immediate"
                                ? "bg-red-50 text-red-600"
                                : c.repair_urgency === "short_term"
                                  ? "bg-orange-50 text-orange-600"
                                  : c.repair_urgency === "long_term"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-navy-50 text-navy-500",
                            )}
                          >
                            {c.repair_urgency.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-navy-800">
                          {formatCurrency(c.estimated_repair_cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep("components")}
                  className="inline-flex items-center gap-2 rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Components
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Property Scan
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
