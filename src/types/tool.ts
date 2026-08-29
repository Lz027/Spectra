export type Pricing = "Free" | "Freemium" | "Paid";

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  long_description?: string;
  category: string;
  pricing: string;
  website_url: string;
  logo_url?: string;
  featured?: boolean;
  created_at?: string;
}
