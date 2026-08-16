import { cn } from "../lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy-700 to-navy-900">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M4 21V8l8-5 8 5v13"
            className="text-brand-400"
            strokeLinejoin="round"
          />
          <path d="M9 21v-6h6v6" className="text-white" />
          <circle cx="12" cy="11" r="1.5" className="text-brand-400" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight text-navy-800">
        Property<span className="text-brand-500">DNA</span>
      </span>
    </div>
  );
}
