import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import lngIt from "./it";
import lngEn from "./en";

const search = window.location.search;
const params = new URLSearchParams(search);
const lang = params.get("lang");

const validLanguages = ["it", "en"];

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "it",
    lng: validLanguages.some((l) => l === lang) ? lang : "it",
    debug: process.env.NODE_ENV !== "production",
    resources: {
      it: lngIt,
      en: lngEn,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
