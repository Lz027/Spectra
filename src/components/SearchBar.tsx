import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import logoMark from "@/assets/spectra-logo-bricks.png";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  theme: "light" | "dark";
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto mb-5 w-full max-w-3xl sm:mb-8"
    >
      <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""}`}>
        <motion.div
          initial={false}
          animate={{ opacity: isFocused ? 1 : 0.35 }}
          className="pointer-events-none absolute -inset-1 rounded-2xl"
          style={{ boxShadow: "var(--shadow-glow)" }}
        />

        <div
          className={`relative flex items-center gap-3 rounded-2xl border bg-card px-3 py-2.5 backdrop-blur-sm transition-all duration-300 sm:gap-4 sm:px-5 sm:py-3.5 ${
            isFocused ? "border-primary" : "border-border"
          }`}
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/60 sm:h-11 sm:w-11">
            <img
              src={logoMark}
              alt="Spectra"
              width={1024}
              height={1024}
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
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
