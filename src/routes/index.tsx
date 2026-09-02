import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import ToolGrid from "@/components/ToolGrid";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import { useTools } from "@/hooks/useTools";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spectra — Discover the Best AI Tools" },
      {
        name: "description",
        content:
          "Spectra is a curated directory of 250+ AI tools. Search, filter by category and pricing, and find the right tool for your workflow.",
      },
      { property: "og:title", content: "Spectra — Discover the Best AI Tools" },
      {
        property: "og:description",
        content:
          "A curated directory of 250+ AI tools. Search, filter by category and pricing, and find the right tool for your workflow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Popular");
  const { theme, toggle } = useTheme();

  const { tools, isLoading, error } = useTools();

  const displayTools = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === "All" || tool.pricing === selectedPricing;
      return matchesSearch && matchesCategory && matchesPricing;
    });

    const sorted = [...filtered];
    switch (selectedSort) {
      case "Newest":
        sorted.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
        break;
      case "A-Z":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return sorted;
  }, [searchQuery, selectedCategory, selectedPricing, selectedSort, tools]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in oklab, var(--primary) 8%, transparent), transparent),
            radial-gradient(ellipse 60% 40% at 100% 100%, color-mix(in oklab, var(--primary-glow) 6%, transparent), transparent)`,
        }}
      />

      <main className="relative flex-1">
        <div className="min-h-full px-3 py-5 sm:px-6 sm:py-10 md:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-2 flex justify-end sm:mb-4">
              <button
                onClick={toggle}
                aria-label="Toggle color theme"
                className="rounded-full border border-border bg-card p-2 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-center sm:mb-10"
            >
              <h1
                className="font-display mb-1 bg-clip-text text-5xl font-bold tracking-tight text-transparent drop-shadow-[0_0_32px_color-mix(in_oklab,var(--primary)_40%,transparent)] sm:mb-3 sm:text-6xl md:text-7xl"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                Spectra
              </h1>
              <div className="mx-auto mb-2 h-px w-16 sm:mb-3 sm:w-24" style={{ background: "var(--gradient-primary)" }} />
              <p className="text-sm text-muted-foreground sm:text-base">
                Discover the best AI tools for your workflow
              </p>
            </motion.div>

            <SearchBar value={searchQuery} onChange={setSearchQuery} theme={theme} />

            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPricing={selectedPricing}
              onPricingChange={setSelectedPricing}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex items-center justify-between sm:mb-6"
            >
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing <span className="font-medium text-foreground">{displayTools.length}</span>{" "}
                tools
                {selectedCategory !== "All" && (
                  <>
                    {" "}
                    in <span className="text-primary">{selectedCategory}</span>
                  </>
                )}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-foreground">Couldn't load tools</p>
                <p className="mt-2 max-w-xl text-sm break-words text-muted-foreground">{error}</p>
              </div>
            ) : (
              <ToolGrid tools={displayTools} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
