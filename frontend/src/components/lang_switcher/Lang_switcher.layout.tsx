import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useLanguages } from "@/core/internationalization/languages";

const LangSwitcherComponent = () => {
  const { languages } = useLanguages();
  const [t] = useTranslation("language");
  const { i18n } = useTranslation();

  const [position, setPosition] = useState(
    localStorage.getItem("lang") ?? languages[0].value,
  );
  const handleTranslate = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="focus-visible:ring-transparent rounded-full"
        >
          {position.toUpperCase()}
          <span className="sr-only">{t("CHANGE_LANGUAGE")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.name}
            onClick={() => {
              setPosition(() => {
                handleTranslate(lang.value);
                return lang.value;
              });
              localStorage.setItem("lang", lang.value);
            }}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangSwitcherComponent;
