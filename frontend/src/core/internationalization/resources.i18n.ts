import languages from "./languages/languages.json";
import auth from "./languages/sections/auth.json";
import sidebar from "./languages/sections/sidebar.json";
import common from "./languages/sections/common.json";

export type LangType = keyof typeof languages;

export type ResourcesType = {
  language: typeof languages.fr;
  auth: typeof auth.fr;
  common: typeof common.fr;
  sidebar: typeof sidebar.fr;
};

export const resources: { [key in LangType]: ResourcesType } = {
  ar: {
    language: languages.ar,
    auth: auth.ar,
    common: common.ar,
    sidebar: sidebar.ar,
  },

  fr: {
    language: languages.fr,
    auth: auth.fr,
    common: common.fr,
    sidebar: sidebar.fr,
  },

  en: {
    language: languages.en,
    auth: auth.fr, // Use French as fallback
    common: common.fr,
    sidebar: sidebar.fr,
  },
};
