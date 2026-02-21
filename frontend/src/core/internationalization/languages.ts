import { useTranslation } from "react-i18next";
import { resources, type LangType } from "./resources.i18n";

type Language = {
  name: string;
  label: string;
  value: string;
};

const getLanguageName = (lang: LangType): string => {
  return resources[lang].language[
    lang.toUpperCase() as keyof (typeof resources)[LangType]["language"]
  ];
};

export const useLanguages = () => {
  const { t } = useTranslation("language");

  const LANGUAGES: Language[] = (Object.keys(resources) as LangType[]).map(
    (lang: LangType) => ({
      name: getLanguageName(lang),
      label: t(lang.toUpperCase()),
      value: lang,
    }),
  );

  return {
    languages: LANGUAGES,
  };
};
