import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import logoMark from "@/assets/spectra-logo-spark.png";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  theme: "light" | "dark";
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && typing && target === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
          <img
            src={logoMark}
            alt="Spectra"
            width={1024}
            height={1024}
            className="h-10 w-10 flex-shrink-0 object-contain drop-shadow-[0_0_14px_color-mix(in_oklab,var(--primary)_40%,transparent)] sm:h-12 sm:w-12"
          />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search AI tools…"
            aria-label="Search AI tools"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-lg"
          />

          <AnimatePresence initial={false}>
            {value && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  onChange("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground md:block">
            /
          </kbd>

          <Search className="h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
