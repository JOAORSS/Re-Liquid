export interface TBasicProduct {
    id: number;
    title: string;
    url: string;
    price: number;
    compare_at_price: number;
    tags: string[];
    image: string;
    collections?: string[];
    imageHover: string;
    description: string;
    quantity: number;
    stone?: string[];
}

export interface TBundleItem {
    id: number;
    name: string;
    subtitle: string;
    price: number;
    image: string;
}

export interface TBundleData {
    discount: number;
    items: TBundleItem[];
}

export interface TShowcaseGallery {
    title: string;
    products: TBasicProduct[];
}

export interface TImage {
  id: number;
  src: string;
  alt: string | null;
  width: number;
  height: number;
  aspect_ratio: number;
}

export interface TMedia {
  id: number;
  media_type: "image" | "video" | "external_video" | "model";
  preview_image: TImage;
  src: string;
  width: number;
  height: number;
  aspect_ratio: number;
}

export interface TProductCategory {
  id: string;
  name: string;
}

export interface TCollection {
  id: number;
  handle: string;
  title: string;
  url: string;
}

export interface TProductOption {
  name: string;
  position: number;
  values: string[];
  selected_value: string;
}

export interface TSellingPlan {
  id: number;
  name: string;
  description: string | null;
  options: Record<string, string>[];
}

export interface TSellingPlanAllocation {
  compare_at_price: number;
  per_delivery_price: number;
  price: number;
  unit_price: number | null;
  selling_plan: TSellingPlan;
}

export interface TSellingPlanGroup {
  id: string;
  name: string;
  options: Record<string, string>[];
  selling_plans: TSellingPlan[];
  app_id: string;
}

export interface TVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: TImage | null;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: number | null;
  inventory_management: string | null;
  barcode: string;
}

export interface TProduct {
  available: boolean;
  category: TProductCategory | null;
  collections: TCollection[];
  compare_at_price: number | null;
  compare_at_price_max: number;
  compare_at_price_min: number;
  compare_at_price_varies: boolean;
  content: string;
  created_at: string;
  description: string;
  featured_image: TImage | null;
  featured_media: TMedia | null;
  first_available_variant: TVariant | null;
  gift_card: boolean;
  handle: string;
  has_only_default_variant: boolean;
  id: number;
  images: TImage[];
  media: TMedia[];
  metafields: Record<string, any>;
  options: string[];
  options_by_name: Record<string, string[]>;
  options_with_values: TProductOption[];
  price: number;
  price_max: number;
  price_min: number;
  price_varies: boolean;
  published_at: string;
  quantity_price_breaks_configured: boolean;
  requires_selling_plan: boolean;
  selected_or_first_available_selling_plan_allocation: TSellingPlanAllocation | null;
  selected_or_first_available_variant: TVariant;
  selected_selling_plan: TSellingPlan | null;
  selected_selling_plan_allocation: TSellingPlanAllocation | null;
  selected_variant: TVariant | null;
  selling_plan_groups: TSellingPlanGroup[];
  tags: string[];
  template_suffix: string | null;
  title: string;
  type: string;
  url: string;
  variants: TVariant[];
  variants_count: number;
  vendor: string;
}