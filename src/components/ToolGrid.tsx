import { useState } from "react";
import { motion } from "framer-motion";
import type { Tool } from "@/types/tool";
import ToolCard from "./ToolCard";

interface ToolGridProps {
  tools: Tool[];
}

const ToolGrid = ({ tools }: ToolGridProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (tools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <p className="text-lg text-muted-foreground">No tools found</p>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Try adjusting your search or filters
        </p>
      </motion.div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
      onMouseLeave={() => setHoveredId(null)}
    >
      {tools.map((tool, index) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          index={index}
          isAnyHovered={hoveredId !== null}
          isHovered={hoveredId === tool.id}
          onHover={setHoveredId}
        />
      ))}
    </div>
  );
};

export default ToolGrid;
