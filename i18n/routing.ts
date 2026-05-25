import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["lt", "lv", "et", "en", "ru"],
  defaultLocale: "lt",
  localePrefix: "always",
});
