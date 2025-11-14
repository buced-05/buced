import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLanguageStore } from "../../stores/language";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { useState } from "react";

type Language = "fr" | "es" | "ko" | "zh" | "en";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "en", name: "English", nativeName: "English" },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2",
          theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
        )}
      >
        <GlobeAltIcon className="h-5 w-5" />
        <span className="hidden sm:inline">{currentLanguage?.nativeName || "Français"}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg z-50",
              theme === "dark"
                ? "bg-[#1A1A2E] border-neon-cyan/30"
                : "bg-white border-gray-200"
            )}
          >
            <div className="p-2">
              <div className={cn("px-3 py-2 text-xs font-semibold uppercase", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                {t("language.select")}
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    language === lang.code
                      ? theme === "dark"
                        ? "bg-neon-cyan/20 text-neon-cyan"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-[#2A2A3E]"
                        : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                    {lang.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

