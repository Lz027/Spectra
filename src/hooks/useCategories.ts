import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabaseClient";

export const useCategories = () => {
  const { data: categories = ["All"], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("tools")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      const unique = [
        ...new Set(
          (data as { category: string }[])
            .map((t) => (t.category ?? "").trim())
            .filter(Boolean),
        ),
      ];

      return ["All", ...unique.sort((a, b) => a.localeCompare(b))];
    },
  });

  return { categories, isLoading };
};
