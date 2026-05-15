import type NavLink from "./NavLink.types";
import type { TBasicProduct } from "./store.types";

export default interface ShopifyData {
  menus: Record<string, NavLink[]>;
  collection: {
    title: string;
    products: TBasicProduct[];
  };
  searchProducts: {
    products: TBasicProduct[];
  };
}


export interface Block {
  id: string;
  type: string;
  settings: Any;
}
