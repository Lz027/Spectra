import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Heart, Sparkles, X } from "lucide-react";
import type { Tool } from "@/types/tool";

interface ToolDetailDialogProps {
  tool: Tool | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ToolDetailDialog = ({
  tool,
  onClose,
  isFavorite,
  onToggleFavorite,
}: ToolDetailDialogProps) => {
  useEffect(() => {
    if (!tool) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [tool, onClose]);

  return (
    <AnimatePresence>
      {tool && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${tool.name} details`}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl border border-border bg-card p-5 sm:rounded-3xl sm:p-7"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-60"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--primary) 12%, transparent), transparent)",
              }}
            />

            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />

            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-4 right-4 rounded-full border border-border bg-background/60 p-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex items-start gap-4">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-background/40 p-[3px] sm:h-16 sm:w-16">
                {tool.logo_url ? (
                  <img
                    src={tool.logo_url}
                    alt={`${tool.name} logo`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Sparkles className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pr-8">
                <h2 className="font-display truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {tool.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {tool.category}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                    style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}
                  >
                    {tool.pricing}
                  </span>
                </div>
              </div>
            </div>

            <p className="relative mt-5 max-h-[40vh] overflow-y-auto text-sm leading-relaxed text-secondary-foreground">
              {tool.long_description || tool.tagline || "No description available."}
            </p>

            <div className="relative mt-6 flex items-center gap-3">
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 active:scale-[0.97]"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                Visit Website
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>

              <button
                onClick={() => onToggleFavorite(tool.id)}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? "Remove from saved" : "Save tool"}
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Heart
                  className={`h-4 w-4 transition-transform duration-200 ${isFavorite ? "fill-current text-primary" : ""}`}
                />
                {isFavorite ? "Saved" : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolDetailDialog;
