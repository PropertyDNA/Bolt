import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <div className="flex gap-6 text-sm text-navy-500">
            <span>PropertyDNA</span>
            <span>Know your home inside and out</span>
          </div>
        </div>
        <div className="mt-8 border-t border-navy-50 pt-6 text-center text-xs text-navy-400">
          PropertyDNA provides estimates for informational purposes only and is
          not a substitute for a professional inspection.
        </div>
      </div>
    </footer>
  );
}
