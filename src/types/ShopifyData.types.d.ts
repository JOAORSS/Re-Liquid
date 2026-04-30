import type NavLink from "./NavLink.types";
import type { TBasicProduct } from "./store.types";

export default interface ShopifyData {
  menus: Record<string, NavLink[]>;
  collection: {
    title: string;
    products: TBasicProduct[];
  };
}
