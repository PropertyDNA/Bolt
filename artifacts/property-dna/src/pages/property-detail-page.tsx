import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Ruler, Building2, Loader as Loader2, CircleAlert as AlertCircle, Wrench, Clock, TrendingUp, ShieldCheck, Trash2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScoreRing } from "../components/ScoreRing";
import { supabase } from "../lib/supabase";
import type { Property, PropertyComponent } from "../lib/types";
import { PROPERTY_TYPE_LABELS, RISK_COLORS } from "../lib/types";
import { cn, formatCurrency, formatDate } from "../lib/utils";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const propertyId = params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const { data: prop, error: propError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .maybeSingle();
      if (propError) throw propError;
      if (!prop) throw new Error("Property not found");

      const { data: components, error: compError } = await supabase
        .from("property_components")
        .select("*")
        .eq("property_id", propertyId)
        .order("category", { ascending: true });
      if (compError) throw compError;

      return {
        property: prop as Property,
        components: (components ?? []) as PropertyComponent[],
      };
    },
  });

  async function handleDelete() {
    if (!data) return;
    if (!confirm("Delete this property and all its scan data?")) return;
    await supabase.from("properties").delete().eq("id", propertyId);
    window.location.href = "/app";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-navy-50">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-xl font-semibold text-navy-900">
            {error?.message === "Property not found"
              ? "Property not found"
              : "Failed to load property"}
          </h2>
          <Link
            href="/app"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { property, components } = data;

  const categoryGroups = {
    structural: components.filter((c) => c.category === "structural"),
    mechanical: components.filter((c) => c.category === "mechanical"),
    exterior: components.filter((c) => c.category === "exterior"),
    interior: components.filter((c) => c.category === "interior"),
  };

  const urgentComponents = components
    .filter(
      (c) => c.repair_urgency === "immediate" || c.repair_urgency === "short_term",
    )
    .sort((a, b) => a.repair_urgency.localeCompare(b.repair_urgency));

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 transition hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 p-8 shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{property.name}</h1>
              {property.address && (
                <p className="mt-2 flex items-center gap-2 text-navy-200">
                  <MapPin className="h-4 w-4" />
                  {property.address}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-navy-700/50 px-3 py-1 text-xs font-medium text-navy-200">
                  {PROPERTY_TYPE_LABELS[property.property_type]}
                </span>
                {property.year_built && (
                  <span className="flex items-center gap-1 rounded-full bg-navy-700/50 px-3 py-1 text-xs font-medium text-navy-200">
                    <Calendar className="h-3 w-3" />
                    Built {property.year_built}
                  </span>
                )}
                {property.square_footage && (
                  <span className="flex items-center gap-1 rounded-full bg-navy-700/50 px-3 py-1 text-xs font-medium text-navy-200">
                    <Ruler className="h-3 w-3" />
                    {property.square_footage.toLocaleString()} sq ft
                  </span>
                )}
                <span className="rounded-full bg-navy-700/50 px-3 py-1 text-xs font-medium text-navy-200">
                  Scanned {formatDate(property.created_at)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 justify-center">
              <ScoreRing
                score={property.overall_score}
                size={160}
                label="Property Score"
              />
            </div>
          </div>
        </motion.div>

        {/* Summary stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                <ShieldCheck className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-navy-500">Overall Grade</p>
                <p className="text-xl font-bold text-navy-900">
                  {property.overall_grade}{" "}
                  <span className="text-sm font-normal text-navy-400">
                    ({property.overall_score}/100)
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Wrench className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-navy-500">Est. Repair Total</p>
                <p className="text-xl font-bold text-navy-900">
                  {formatCurrency(property.estimated_total_repair_cost)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  property.risk_level === "low"
                    ? "bg-emerald-50"
                    : property.risk_level === "moderate"
                      ? "bg-amber-50"
                      : property.risk_level === "high"
                        ? "bg-orange-50"
                        : "bg-red-50",
                )}
              >
                <TrendingUp
                  className={cn(
                    "h-5 w-5",
                    property.risk_level === "low"
                      ? "text-emerald-600"
                      : property.risk_level === "moderate"
                        ? "text-amber-600"
                        : property.risk_level === "high"
                          ? "text-orange-600"
                          : "text-red-600",
                  )}
                />
              </div>
              <div>
                <p className="text-sm text-navy-500">Risk Level</p>
                <p
                  className={cn(
                    "text-xl font-bold capitalize",
                    property.risk_level === "low"
                      ? "text-emerald-600"
                      : property.risk_level === "moderate"
                        ? "text-amber-600"
                        : property.risk_level === "high"
                          ? "text-orange-600"
                          : "text-red-600",
                  )}
                >
                  {property.risk_level}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent repairs */}
        {urgentComponents.length > 0 && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-700">
              <Clock className="h-5 w-5" />
              Priority Repairs
            </h3>
            <p className="mt-1 text-sm text-orange-600">
              These components need attention soon to prevent further damage.
            </p>
            <div className="mt-4 space-y-2">
              {urgentComponents.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                        c.repair_urgency === "immediate"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700",
                      )}
                    >
                      {c.repair_urgency.replace("_", " ")}
                    </span>
                    <span className="text-sm font-medium text-navy-800">
                      {c.component_name}
                    </span>
                    <span className="text-xs text-navy-400">
                      {c.condition_label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-navy-900">
                    {formatCurrency(c.estimated_repair_cost)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Component breakdown by category */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-navy-900">
            Component Breakdown
          </h2>
          <p className="mt-1 text-navy-500">
            Detailed scores and estimates for each system.
          </p>

          <div className="mt-6 space-y-8">
            {Object.entries(categoryGroups).map(([cat, comps]) => {
              if (comps.length === 0) return null;
              const catLabel =
                cat.charAt(0).toUpperCase() + cat.slice(1);
              return (
                <div key={cat}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy-400">
                    {catLabel}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {comps.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-navy-900">
                              {c.component_name}
                            </h4>
                            <p className="mt-0.5 text-xs text-navy-400">
                              {c.remaining_life_years} years remaining
                            </p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "h-2 w-3 rounded-full",
                                  idx < c.condition_score
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
                        </div>

                        <div className="mt-3 flex items-center justify-between">
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
                          <span className="text-lg font-bold text-navy-900">
                            {formatCurrency(c.estimated_repair_cost)}
                          </span>
                        </div>

                        {c.notes && (
                          <p className="mt-3 border-t border-navy-50 pt-3 text-sm text-navy-500">
                            {c.notes}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-navy-100 bg-white p-4 text-center text-xs text-navy-400">
          PropertyDNA provides estimates for informational purposes only and is
          not a substitute for a professional inspection. Repair costs are
          estimates based on national averages and may vary by region.
        </div>
      </div>

      <Footer />
    </div>
  );
}
