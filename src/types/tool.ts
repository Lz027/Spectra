export type Pricing = "Free" | "Freemium" | "Paid";

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  long_description?: string | undefined;
  category: string;
  pricing: string;
  website_url: string;
  logo_url?: string | undefined;
  featured?: boolean | undefined;
  created_at?: string | undefined;
}
