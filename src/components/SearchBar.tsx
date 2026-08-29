import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import logoLight from "@/assets/spectra-logo-books-light.png";
import logoDark from "@/assets/spectra-logo-books-dark.png";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  theme: "light" | "dark";
}

const SearchBar = ({ value, onChange, theme }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto mb-4 w-full max-w-3xl sm:mb-8"
    >
      <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""}`}>
        <motion.div
          initial={false}
          animate={{ opacity: isFocused ? 1 : 0 }}
          className="pointer-events-none absolute -inset-1 rounded-xl sm:rounded-2xl"
          style={{ boxShadow: "var(--shadow-glow)" }}
        />

        <div
          className={`relative flex items-center gap-2 rounded-xl border-2 bg-card px-3 py-2 transition-all duration-300 sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-3 ${
            isFocused ? "border-primary" : "border-border"
          }`}
        >
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg sm:h-12 sm:w-12 sm:rounded-xl">
            <img
              src={theme === "dark" ? logoDark : logoLight}
              alt="Spectra"
              className="h-full w-full object-cover"
            />
          </div>

          <input
            type="text"
            placeholder="Search AI tools…"
            aria-label="Search AI tools"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-lg"
          />

          <Search className="h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
