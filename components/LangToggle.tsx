import { Dispatch, SetStateAction } from "react";

interface LangToggleProps {
  lang: "id" | "en";
  setLang: Dispatch<SetStateAction<"id" | "en">>;
}

export function LangToggle({ lang, setLang }: LangToggleProps) {
  return (
    <button
      type="button"
      className="ml-3 px-2 py-1 border rounded text-xs"
      onClick={() => setLang(lang === "id" ? "en" : "id")}
    >
      {lang === "id" ? "Switch to English" : "Ganti ke Bahasa"}
    </button>
  );
}
