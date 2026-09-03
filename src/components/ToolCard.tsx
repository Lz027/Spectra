import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, Sparkles, ArrowUpRight } from "lucide-react";
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
  onSelect: (tool: Tool) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number) => {
  let r = l, g = l, b = l;
  if (s !== 0) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (n: number) => {
      let k = (n + h) % 1;
      if (k < 0) k += 1;
      if (k < 1 / 6) return p + (q - p) * 6 * k;
      if (k < 1 / 2) return q;
      if (k < 2 / 3) return p + (q - p) * (2 / 3 - k) * 6;
      return p;
    };
    r = hue(1 / 3); g = hue(0); b = hue(-1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const rgbToCss = ({ r, g, b }: { r: number; g: number; b: number }) => `rgb(${r}, ${g}, ${b})`;

const ToolCard = ({ tool, index, isAnyHovered, isHovered, onHover }: ToolCardProps) => {
  const [palette, setPalette] = useState<ColorPalette | null>(null);

  useEffect(() => {
    if (!tool.logo_url) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 96;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const hueBuckets = new Map<number, { r: number; g: number; b: number; weight: number }>();
        const fallbackBuckets = new Map<number, { r: number; g: number; b: number; weight: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const a = data[i + 3] ?? 0;
          if (a < 160) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max > 245 && min > 235) continue;

          const saturation = (max - min) / max || 0;
          const weight = (a / 255) * (1 + saturation * 3);

          if (saturation < 0.08) {
            const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
            const bucket = fallbackBuckets.get(key);
            if (bucket) {
              bucket.r += r * weight; bucket.g += g * weight; bucket.b += b * weight; bucket.weight += weight;
            } else {
              fallbackBuckets.set(key, { r: r * weight, g: g * weight, b: b * weight, weight });
            }
            continue;
          }

          const { h } = rgbToHsl(r, g, b);
          const key = Math.round(h * 24);
          const bucket = hueBuckets.get(key);
          if (bucket) {
            bucket.r += r * weight; bucket.g += g * weight; bucket.b += b * weight; bucket.weight += weight;
          } else {
            hueBuckets.set(key, { r: r * weight, g: g * weight, b: b * weight, weight });
          }
        }

        const normalize = (buckets: Map<number, { r: number; g: number; b: number; weight: number }>) =>
          [...buckets.values()]
            .map((b) => ({
              r: Math.round(b.r / b.weight),
              g: Math.round(b.g / b.weight),
              b: Math.round(b.b / b.weight),
              weight: b.weight,
            }))
            .sort((a, b) => b.weight - a.weight);

        let ranked = normalize(hueBuckets);
        if (!ranked.length) ranked = normalize(fallbackBuckets);
        if (!ranked.length || cancelled) return;

        const c0 = ranked[0]!;
        const c1 = ranked[1] ?? c0;
        const c2 = ranked[2] ?? c1;

        const enhance = (color: { r: number; g: number; b: number }, boostSat: number, targetL: number) => {
          let { h, s, l } = rgbToHsl(color.r, color.g, color.b);
          s = Math.min(1, s * (1 + boostSat) + 0.12);
          l = l > targetL ? Math.max(targetL, l * 0.92) : Math.min(targetL, l * 1.08);
          return hslToRgb(h, s, l);
        };

        const primary = enhance(c0, 0.45, 0.48);
        const secondary = enhance(c1, 0.35, 0.55);
        const accentRaw = enhance(c2, 0.55, 0.62);
        const { h: ah, s: as, l: al } = rgbToHsl(accentRaw.r, accentRaw.g, accentRaw.b);
        const accent = hslToRgb((ah + 0.08) % 1, Math.min(1, as * 1.15), Math.min(0.78, al * 1.1));

        const luminance = (0.299 * primary.r + 0.587 * primary.g + 0.114 * primary.b) / 255;
        setPalette({
          primary: rgbToCss(primary),
          secondary: rgbToCss(secondary),
          accent: rgbToCss(accent),
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
      return { color: palette.accent, textShadow: `0 0 10px ${palette.accent}90` };
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
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.35, delay: index * 0.02, ease: "easeOut" }}
      onMouseEnter={() => onHover(tool.id)}
      onMouseLeave={() => onHover(null)}
      className="group relative"
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-3xl p-4 transition-all duration-300 sm:p-5"
        style={{
          background:
            isActive && palette
              ? `linear-gradient(145deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
              : "var(--card)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor:
            isActive && palette
              ? `color-mix(in srgb, ${palette.accent} 55%, white)`
              : "var(--border)",
          boxShadow:
            isActive && palette
              ? `0 28px 80px ${palette.primary}60, 0 0 60px ${palette.secondary}30, inset 0 1px 0 rgba(255,255,255,0.22)`
              : "var(--shadow-elevated)",
        }}
      >
        {/* Top sheen */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, white 18%, transparent), transparent)",
          }}
        />

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tool.id);
          }}
          whileTap={{ scale: 0.85 }}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${tool.name} from saved` : `Save ${tool.name}`}
          className={`absolute top-3 right-3 z-10 rounded-full p-1.5 transition-all duration-200 sm:top-4 sm:right-4 ${
            isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-70"
          }`}
          style={{
            background: "color-mix(in oklab, var(--background) 45%, transparent)",
            color: isActive && palette ? palette.textColor : "var(--primary)",
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </motion.button>

        <div className="relative mb-3 flex items-start gap-3 pr-7 sm:mb-4 sm:gap-4">

          <div
            className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-background/25 p-[3px] ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 group-hover:ring-white/25 sm:h-14 sm:w-14"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" }}
          >
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                loading="lazy"
                className="h-full w-full rounded-xl object-cover"
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
              className="font-display flex items-center gap-1.5 text-base leading-tight font-bold tracking-tight sm:gap-2 sm:text-lg"
              style={{ color: isActive && palette ? palette.textColor : "var(--foreground)" }}
            >
              <span className="truncate">{tool.name}</span>
              {tool.featured && (
                <Star
                  className="h-3.5 w-3.5 flex-shrink-0 fill-current sm:h-4 sm:w-4"
                  style={{ color: isActive && palette ? palette.accent : "var(--primary)" }}
                />
              )}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className="max-w-[130px] truncate rounded-full px-2 py-0.5 text-[10px] font-medium sm:max-w-none sm:text-[11px]"
                style={{
                  color: isActive && palette ? palette.textColor : "var(--muted-foreground)",
                  background: isActive
                    ? "color-mix(in oklab, white 18%, transparent)"
                    : "var(--secondary)",
                }}
              >
                {tool.category}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-[11px]"
                style={{
                  ...getPricingStyles(tool.pricing, isActive),
                  background: isActive
                    ? "color-mix(in oklab, white 18%, transparent)"
                    : "color-mix(in oklab, var(--primary) 8%, transparent)",
                }}
              >
                {tool.pricing}
              </span>
            </div>
          </div>
        </div>

        <p
          className="relative mb-4 line-clamp-2 flex-1 text-[13px] leading-relaxed sm:line-clamp-3 sm:text-sm"
          style={{
            color: isActive && palette ? palette.textColor : "var(--secondary-foreground)",
            opacity: isActive ? 0.92 : 0.85,
          }}
        >
          {tool.tagline || "No description available"}
        </p>

        {/* Visit link — hypertext style, always visible */}
        <motion.button
          onClick={handleVisit}
          whileTap={{ scale: 0.97 }}
          className="group/link relative mt-auto inline-flex w-fit items-center gap-1 pt-1 text-[13px] font-semibold tracking-wide transition-colors duration-200 sm:text-sm"
          style={{
            color: isActive && palette ? palette.textColor : "var(--primary)",
          }}
        >
          <span className="relative">
            Visit Website
            <span
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 transition-transform duration-300 group-hover/link:scale-x-75"
              style={{
                background: isActive && palette ? palette.textColor : "var(--primary)",
                opacity: 0.55,
              }}
            />
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 sm:h-4 sm:w-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ToolCard;
