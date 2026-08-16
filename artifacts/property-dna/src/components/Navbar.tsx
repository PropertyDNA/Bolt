import { Link } from "wouter";
import { Logo } from "./Logo";
import { cn } from "../lib/utils";

export function Navbar({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-colors",
        isDark
          ? "bg-navy-900/80 border-b border-navy-700/50"
          : "bg-white/80 border-b border-navy-100",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/app"
            className={cn(
              "text-sm font-medium transition",
              isDark
                ? "text-navy-200 hover:text-white"
                : "text-navy-600 hover:text-navy-900",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/scan"
            className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 hover:shadow-md"
          >
            Start Scan
          </Link>
        </div>
      </nav>
    </header>
  );
}
