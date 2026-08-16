import { Route, Switch, Link } from "wouter";
import { lazy, Suspense } from "react";
import { Logo } from "./components/Logo";

const LandingPage = lazy(() => import("./pages/landing-page"));
const ScanPage = lazy(() => import("./pages/scan-page"));
const DashboardPage = lazy(() => import("./pages/dashboard-page"));
const PropertyDetailPage = lazy(() => import("./pages/property-detail-page"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50">
      <div className="flex flex-col items-center gap-4">
        <Logo className="h-10 w-auto animate-pulse" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-brand-500" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-50">
      <p className="text-6xl font-bold text-navy-700">404</p>
      <p className="text-lg text-navy-500">Page not found</p>
      <Link
        href="/"
        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/scan" component={ScanPage} />
        <Route path="/app" component={DashboardPage} />
        <Route path="/app/:id" component={PropertyDetailPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
