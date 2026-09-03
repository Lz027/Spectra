import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";
import type { Tool } from "@/types/tool";
import ToolCard from "./ToolCard";

interface ToolGridProps {
  tools: Tool[];
  onSelect: (tool: Tool) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onReset?: () => void;
}

const ToolGrid = ({ tools, onSelect, isFavorite, onToggleFavorite, onReset }: ToolGridProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (tools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div
          className="mb-4 rounded-2xl border border-border p-4 text-primary"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <SearchX className="h-6 w-6" />
        </div>
        <p className="text-lg text-foreground">No tools found</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Try adjusting your search or filters
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="mt-5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Clear all filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
      onMouseLeave={() => setHoveredId(null)}
    >
      <AnimatePresence mode="popLayout">
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            index={index}
            isAnyHovered={hoveredId !== null}
            isHovered={hoveredId === tool.id}
            onHover={setHoveredId}
            onSelect={onSelect}
            isFavorite={isFavorite(tool.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToolGrid;
