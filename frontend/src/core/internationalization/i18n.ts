import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources.i18n";

i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem("lang") ?? "fr",
  fallbackLng: "fr",
  ns: Object.keys(resources.fr),
  resources: resources,
});

export default i18n;
