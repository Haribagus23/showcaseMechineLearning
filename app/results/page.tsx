import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { AnalysisResults } from "@/components/analysis-results";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { normalizeAnalysis } from "@/lib/normalizeAnalysis";

// Results page always reads from sessionStorage or legacy param, normalizes and renders only real analysis
export default function ResultsPage() {
  const params = useSearchParams();
  const analysisKey = params.get("analysisKey");
  const legacy = params.get("data");

  const [lang, setLang] = useState<"id" | "en">("id");
  const [normalized, setNormalized] = useState<any>(null);

  useEffect(() => {
    if (analysisKey) {
      const s = sessionStorage.getItem(analysisKey);
      if (s) {
        setNormalized(JSON.parse(s));
        return;
      }
    }

    if (legacy) {
      try {
        const raw = JSON.parse(decodeURIComponent(legacy));
        setNormalized(normalizeAnalysis(raw, raw.filename || raw.name));
      } catch {
        setNormalized(null);
      }
      return;
    }

    setNormalized(null);
  }, [analysisKey, legacy]);

  if (!normalized)
    return (
      <div className="p-10">
        Tidak ada data ditemukan. / No data found.{" "}
        <Link href="/upload">Coba lagi / Try again</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {lang === "id" ? "Hasil Analisis" : "Analysis Results"}
            </h1>
            <p className="text-muted-foreground">{normalized.fileName}</p>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "id" ? "en" : "id")}
            >
              {lang === "id" ? "Switch to English" : "Ganti ke Bahasa"}
            </Button>
          </div>
        </div>

        <AnalysisResults data={normalized} lang={lang} />

        <div className="flex gap-4 justify-center mt-12">
          <Link href="/upload">
            <Button variant="outline" size="lg">
              {lang === "id" ? "Upload File Baru" : "Upload New File"}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
