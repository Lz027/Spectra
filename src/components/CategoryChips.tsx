import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

const CategoryChips = ({
  categories,
  selected,
  onSelect,
  favoritesOnly,
  onToggleFavorites,
  favoritesCount,
}: CategoryChipsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="relative mb-4 sm:mb-6"
    >
      <div className="scrollbar-none -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
        <button
          onClick={onToggleFavorites}
          aria-pressed={favoritesOnly}
          className={`relative flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
            favoritesOnly
              ? "border-primary text-primary"
              : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
          style={
            favoritesOnly
              ? { background: "color-mix(in oklab, var(--primary) 12%, transparent)" }
              : undefined
          }
        >
          <Heart className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-current" : ""}`} />
          Saved{favoritesCount > 0 ? ` · ${favoritesCount}` : ""}
        </button>

        {categories.map((category) => {
          const isActive = selected === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`relative flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? "border-primary/60 text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="category-chip-active"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                />
              )}
              <span className="relative">{category}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryChips;
