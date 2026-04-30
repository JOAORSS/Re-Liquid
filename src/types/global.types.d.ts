import type ShopifyData from "./ShopifyData.types";

declare global {
  interface Window {
    __shopifyData__: ShopifyData;
  }
}