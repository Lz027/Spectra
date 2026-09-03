/**
 * Reports a client-side error without coupling the application to a vendor
 * telemetry SDK. Applications embedding Spectra can attach their own reporter
 * to `window.__spectraReportError` when needed.
 */
type ErrorReporter = (payload: { error: unknown; context: Record<string, unknown> }) => void;

declare global {
  interface Window {
    __spectraReportError?: ErrorReporter;
  }
}

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  window.__spectraReportError?.({
    error,
    context: {
      route: window.location.pathname,
      ...context,
    },
  });
}
