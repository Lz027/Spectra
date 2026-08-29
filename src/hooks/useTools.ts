import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabaseClient";
import type { Tool } from "@/types/tool";

interface UseToolsReturn {
  tools: Tool[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

type Row = Record<string, unknown>;

const normalizeToolRow = (row: Row, index: number): Tool => {
  const pickString = (keys: string[]) => {
    for (const k of keys) {
      const v = row?.[k];
      if (typeof v === "string" && v.trim() !== "") return v.trim();
      if (v !== null && v !== undefined && v !== "") return String(v);
    }
    return undefined;
  };

  return {
    id: pickString(["id", "uuid", "tool_id", "slug"]) ?? `tool-${index}`,
    name:
      pickString(["name", "tool_name", "title", "app_name", "product_name"]) ??
      "Unnamed Tool",
    tagline:
      pickString(["tagline", "description", "short_description", "summary", "subtitle"]) ?? "",
    long_description: pickString(["long_description", "full_description", "details", "content"]),
    category: pickString(["category", "tool_category", "type"]) ?? "General",
    pricing: pickString(["pricing", "pricing_tier", "pricing_type", "price_type", "plan"]) ?? "Free",
    website_url: pickString(["website_url", "url", "website", "link", "homepage"]) ?? "",
    logo_url: pickString(["logo_url", "logo", "image_url", "icon_url"]),
    featured: Boolean(row?.["featured"] ?? row?.["is_featured"] ?? row?.["starred"]),
    created_at: pickString(["created_at", "created", "inserted_at"]),
  };
};

export const useTools = (): UseToolsReturn => {
  const {
    data: tools = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from("tools").select("*").limit(500);
      if (error) throw error;
      return ((data ?? []) as Row[]).map((row, idx) => normalizeToolRow(row, idx));
    },
  });

  return {
    tools,
    isLoading,
    error: error?.message ?? null,
    refetch: async () => {
      await refetch();
    },
  };
};
