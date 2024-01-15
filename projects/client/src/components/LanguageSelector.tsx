import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface Lang {
  id: string;
  label: string;
}

interface AvailableLang {
  [key: string]: Lang;
}

const availableLang: AvailableLang = {
  en: {
    id: "en",
    label: "English",
  },
  id: {
    id: "id",
    label: "Indonesia",
  },
  jp: {
    id: "jp",
    label: "Japan",
  },
};

const LanguageSelector = ({
  align = "end",
}: {
  align?: "end" | "center" | "start" | undefined;
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  useEffect(() => {
    let savedLang = localStorage.getItem("i18nLng");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    if (lang) {
      localStorage.setItem("i18nLng", lang);
    }
  }, [lang]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-2 items-center">
          <span>{availableLang[lang!].label}</span>
          <img src={`/lang/${lang}.png`} className="w-5 h-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {Object.keys(availableLang).map((key) => (
          <DropdownMenuItem
            onClick={() => i18n.changeLanguage(availableLang[key].id)}
            key={key}
          >
            <div className="flex gap-2 items-center justify-end w-full">
              <span>{availableLang[key].label}</span>
              <img
                src={`/lang/${availableLang[key].id}.png`}
                className="w-5 h-5"
              />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
