import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, MapPin, Calendar, TrendingUp, Wrench, TriangleAlert as AlertTriangle, Loader as Loader2, Building2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { supabase } from "../lib/supabase";
import type { Property } from "../lib/types";
import { PROPERTY_TYPE_LABELS, RISK_COLORS } from "../lib/types";
import { cn, formatCurrency, formatDate } from "../lib/utils";

export default function DashboardPage() {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Property[];
    },
  });

  const totalProperties = properties?.length ?? 0;
  const avgScore =
    properties && properties.length > 0
      ? Math.round(
          properties.reduce((sum, p) => sum + p.overall_score, 0) /
            properties.length,
        )
      : 0;
  const totalRepairCost =
    properties?.reduce((sum, p) => sum + p.estimated_total_repair_cost, 0) ??
    0;
  const highRiskCount =
    properties?.filter(
      (p) => p.risk_level === "high" || p.risk_level === "critical",
    ).length ?? 0;

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">
              Property Dashboard
            </h1>
            <p className="mt-1 text-navy-500">
              Manage and track all your property scans.
            </p>
          </div>
          <Link
            href="/scan"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            New Scan
          </Link>
        </div>

        {/* Stats */}
        {totalProperties > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Properties",
                value: totalProperties,
                icon: Building2,
                color: "text-navy-600 bg-navy-50",
              },
              {
                label: "Avg. Score",
                value: avgScore,
                icon: TrendingUp,
                color: "text-brand-600 bg-brand-50",
              },
              {
                label: "Est. Repair Total",
                value: formatCurrency(totalRepairCost),
                icon: Wrench,
                color: "text-amber-600 bg-amber-50",
              },
              {
                label: "High Risk",
                value: highRiskCount,
                icon: AlertTriangle,
                color: "text-red-600 bg-red-50",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-navy-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      stat.color,
                    )}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600">
                Failed to load properties. Please try again.
              </p>
            </div>
          ) : !properties || properties.length === 0 ? (
            <div className="rounded-2xl border border-navy-100 bg-white py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-50">
                <Building2 className="h-8 w-8 text-navy-300" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900">
                No properties yet
              </h3>
              <p className="mt-1 text-navy-500">
                Run your first property scan to get started.
              </p>
              <Link
                href="/scan"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                <Plus className="h-4 w-4" />
                Start Your First Scan
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/app/${prop.id}`}
                    className="group block rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-navy-900 group-hover:text-brand-600">
                          {prop.name}
                        </h3>
                        {prop.address && (
                          <p className="mt-1 flex items-center gap-1 text-sm text-navy-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {prop.address}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-navy-900">
                          {prop.overall_score}
                        </p>
                        <p className="text-sm font-medium text-brand-600">
                          Grade {prop.overall_grade}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-600">
                        {PROPERTY_TYPE_LABELS[prop.property_type]}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                          RISK_COLORS[prop.risk_level],
                        )}
                      >
                        {prop.risk_level} risk
                      </span>
                      {prop.year_built && (
                        <span className="flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-600">
                          <Calendar className="h-3 w-3" />
                          {prop.year_built}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4">
                      <span className="text-sm text-navy-500">
                        Est. repairs
                      </span>
                      <span className="text-lg font-bold text-navy-900">
                        {formatCurrency(prop.estimated_total_repair_cost)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-navy-400">
                      Scanned {formatDate(prop.created_at)}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
