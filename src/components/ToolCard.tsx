import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, Sparkles } from "lucide-react";
import type { Tool } from "@/types/tool";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
}

interface ToolCardProps {
  tool: Tool;
  index: number;
  isAnyHovered: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const ToolCard = ({ tool, index, isAnyHovered, isHovered, onHover }: ToolCardProps) => {
  const [palette, setPalette] = useState<ColorPalette | null>(null);

  useEffect(() => {
    if (!tool.logo_url) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 48;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        // Bucket pixels in a coarse RGB grid, ignoring transparent / near-white / near-black.
        const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const a = data[i + 3] ?? 0;
          if (a < 160) continue;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max > 245 && min > 235) continue;
          if (max < 18) continue;
          const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
          const bucket = buckets.get(key);
          if (bucket) {
            bucket.r += r;
            bucket.g += g;
            bucket.b += b;
            bucket.n += 1;
          } else {
            buckets.set(key, { r, g, b, n: 1 });
          }
        }

        const ranked = [...buckets.values()]
          .map((b) => ({
            r: Math.round(b.r / b.n),
            g: Math.round(b.g / b.n),
            b: Math.round(b.b / b.n),
            n: b.n,
          }))
          .sort((a, b) => {
            const sat = (c: { r: number; g: number; b: number }) =>
              Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);
            return b.n * (1 + sat(b) / 128) - a.n * (1 + sat(a) / 128);
          });

        if (!ranked.length || cancelled) return;
        const c0 = ranked[0]!;
        const c1 = ranked[1] ?? c0;
        const c2 = ranked[2] ?? c1;
        const rgb = (c: { r: number; g: number; b: number }) => `rgb(${c.r}, ${c.g}, ${c.b})`;
        const luminance = (0.299 * c0.r + 0.587 * c0.g + 0.114 * c0.b) / 255;
        setPalette({
          primary: rgb(c0),
          secondary: rgb(c1),
          accent: rgb(c2),
          textColor: luminance > 0.55 ? "#141414" : "#fafafa",
        });
      } catch {
        setPalette(null);
      }
    };
    img.src = tool.logo_url;
    return () => {
      cancelled = true;
    };
  }, [tool.logo_url]);


  const handleVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(tool.website_url, "_blank", "noopener,noreferrer");
  };

  const getPricingStyles = (pricing: string, isActive: boolean) => {
    if (isActive && palette) {
      return { color: palette.accent, textShadow: `0 0 8px ${palette.accent}80` };
    }
    switch (pricing) {
      case "Free":
        return { color: "oklch(0.65 0.17 155)" };
      case "Freemium":
        return { color: "oklch(0.62 0.16 250)" };
      case "Paid":
        return { color: "var(--primary)" };
      default:
        return {};
    }
  };

  const cardScale = isHovered ? 1 : isAnyHovered ? 0.97 : 1;
  const cardOpacity = isHovered ? 1 : isAnyHovered ? 0.5 : 1;
  const isActive = isHovered && !!palette;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: cardOpacity, y: isHovered ? -8 : 0, scale: cardScale }}
      transition={{ duration: 0.35, delay: index * 0.02, ease: "easeOut" }}
      onMouseEnter={() => onHover(tool.id)}
      onMouseLeave={() => onHover(null)}
      className="group relative"
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl p-4 transition-all duration-300 sm:p-5"
        style={{
          background:
            isActive && palette
              ? `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
              : "var(--card)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor:
            isActive && palette
              ? `color-mix(in srgb, ${palette.accent} 50%, white)`
              : "var(--border)",
          boxShadow:
            isActive && palette
              ? `0 24px 70px ${palette.primary}70, 0 0 50px ${palette.secondary}35, inset 0 1px 0 rgba(255,255,255,0.18)`
              : "var(--shadow-elevated)",
        }}
      >

        <div className="mb-2 flex items-start gap-2 sm:mb-4 sm:gap-4">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-background/20 ring-2 ring-transparent backdrop-blur-sm transition-all duration-300 group-hover:ring-white/20 sm:h-14 sm:w-14 sm:rounded-xl">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                loading="lazy"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Sparkles
                  className="h-5 w-5 sm:h-7 sm:w-7"
                  style={{
                    color: isActive && palette ? palette.textColor : "var(--muted-foreground)",
                  }}
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="flex items-center gap-1 text-sm leading-tight font-bold sm:gap-2 sm:text-lg"
              style={{ color: isActive && palette ? palette.textColor : "var(--foreground)" }}
            >
              <span className="truncate">{tool.name}</span>
              {tool.featured && (
                <Star
                  className="h-3 w-3 flex-shrink-0 fill-current sm:h-4 sm:w-4"
                  style={{ color: isActive && palette ? palette.accent : "var(--primary)" }}
                />
              )}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-1 sm:mt-1 sm:gap-2">
              <span
                className="max-w-[100px] truncate text-[10px] font-medium sm:max-w-none sm:text-xs"
                style={{
                  color: isActive && palette ? palette.textColor : "var(--muted-foreground)",
                  opacity: isActive ? 0.8 : 0.75,
                }}
              >
                {tool.category}
              </span>
              <span className="text-[10px] opacity-40 sm:text-xs">•</span>
              <span
                className="text-[10px] font-semibold sm:text-xs"
                style={getPricingStyles(tool.pricing, isActive)}
              >
                {tool.pricing}
              </span>
            </div>
          </div>
        </div>

        <p
          className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed sm:mb-4 sm:line-clamp-3 sm:text-sm"
          style={{
            color: isActive && palette ? palette.textColor : "var(--secondary-foreground)",
            opacity: isActive ? 0.9 : 1,
          }}
        >
          {tool.tagline || "No description available"}
        </p>

        {/* Always visible on touch/mobile */}
        <button
          onClick={handleVisit}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 active:scale-[0.98] sm:hidden"
          style={{
            background: "var(--gradient-primary)",
            color: "var(--primary-foreground)",
            boxShadow: "0 8px 24px -12px color-mix(in oklab, var(--primary) 70%, transparent)",
          }}
        >
          <span>Visit Website</span>
          <ExternalLink className="h-3 w-3" />
        </button>

        <div className="hidden sm:block">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <motion.button
                  onClick={handleVisit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-200"
                  style={{
                    background: palette
                      ? `linear-gradient(135deg, ${palette.accent}30, ${palette.secondary}40)`
                      : "var(--gradient-primary)",
                    color: palette?.textColor ?? "var(--primary-foreground)",
                    border: `1px solid ${palette ? `${palette.accent}40` : "transparent"}`,
                  }}
                >
                  <span>Visit Website</span>
                  <ExternalLink className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default ToolCard;
