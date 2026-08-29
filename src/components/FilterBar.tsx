import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPricing: string;
  onPricingChange: (pricing: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  icon?: React.ReactNode;
}

const Dropdown = ({ label, value, options, isOpen, onToggle, onSelect, icon }: DropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && isOpen) onToggle();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-1 rounded-lg border border-border/50 bg-secondary/50 px-2 py-1.5 text-xs font-medium transition-all duration-200 hover:border-border hover:bg-secondary sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm ${
          isOpen ? "border-primary/50 bg-secondary" : ""
        }`}
      >
        {icon && <span className="hidden sm:block">{icon}</span>}
        <span className="hidden text-muted-foreground sm:inline">{label}:</span>
        <span className="max-w-[80px] truncate text-foreground sm:max-w-none">{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-50 mt-2 max-h-[300px] min-w-[200px] overflow-y-auto rounded-xl border border-border bg-popover shadow-xl"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  onToggle();
                }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-secondary/50 ${
                  value === option
                    ? "bg-secondary/50 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value === option && (
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                )}
                <span className={value !== option ? "ml-3.5" : ""}>{option}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterBar = ({
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  selectedSort,
  onSortChange,
}: FilterBarProps) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown(openDropdown === name ? null : name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mb-4 sm:mb-8"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-border/30 bg-secondary/30 p-0.5 sm:gap-2 sm:rounded-2xl sm:p-1">
          <Dropdown
            label="Category"
            value={categoriesLoading ? "Loading..." : selectedCategory}
            options={categories}
            isOpen={openDropdown === "category"}
            onToggle={() => toggleDropdown("category")}
            onSelect={onCategoryChange}
            icon={<Filter className="h-4 w-4 text-primary" />}
          />

          <div className="h-6 w-px bg-border/50" />

          <Dropdown
            label="Pricing"
            value={selectedPricing}
            options={["All", "Free", "Freemium", "Paid"]}
            isOpen={openDropdown === "pricing"}
            onToggle={() => toggleDropdown("pricing")}
            onSelect={onPricingChange}
          />
        </div>

        <Dropdown
          label="Sort"
          value={selectedSort}
          options={["Popular", "Newest", "A-Z"]}
          isOpen={openDropdown === "sort"}
          onToggle={() => toggleDropdown("sort")}
          onSelect={onSortChange}
          icon={<ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
        />

        <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
          {Math.max(categories.length - 1, 0)} categories
        </span>
      </div>
    </motion.div>
  );
};

export default FilterBar;
