import { Card } from "@/components/ui/card";
import type { NormalizedAnalysis } from "@/lib/normalizeAnalysis";

interface AnalysisResultsProps {
  data: NormalizedAnalysis;
  lang: "id" | "en";
}

// Sentiment error banner bilingual
const SENTIMENT_WARN_LABELS = {
  id: "Analisis sentimen mengalami masalah di server; hasil mungkin tidak akurat.",
  en: "Sentiment analysis had server issues; result may be inaccurate.",
};

const LABELS = {
  summary: { id: "Ringkasan", en: "Summary" },
  sentiment: { id: "Analisis Sentimen", en: "Sentiment Analysis" },
  keywords: { id: "Topik Kunci", en: "Key Topics" },
  word_count: { id: "Jumlah Kata", en: "Word Count" },
  error: { id: "Terjadi kesalahan", en: "Error" },
};

export function AnalysisResults({ data, lang }: AnalysisResultsProps) {
  const sentiment = data.sentiment?.toLowerCase();
  const sentimentConfig =
    {
      positive: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
      },
      neutral: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
      },
      negative: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
      },
    }[sentiment as "positive" | "neutral" | "negative"] || {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
    };

  // Detect server sentiment errors (numpy / CPU / internal)
  const showSentimentWarn =
    Array.isArray(data.errors) &&
    data.errors.some(
      (err) => typeof err === "string" && /numpy|sentiment|cpu|server/i.test(err)
    );

  // If errors exist but not sentiment-related → show error card
  if (data.errors?.length && !showSentimentWarn) {
    return (
      <Card className="p-6 rounded-xl text-red-600 text-base font-medium">
        <div>
          {LABELS.error[lang]}: {data.errors.join(" ")}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary */}
      <Card className="p-6 rounded-xl lg:col-span-1">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {LABELS.summary[lang]}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.summary[lang]}
        </p>
      </Card>

      {/* Sentiment */}
      <Card className="p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {LABELS.sentiment[lang]}
        </h2>

        <div
          className={`inline-block px-4 py-2 rounded-lg ${sentimentConfig.bg} ${sentimentConfig.text}`}
        >
          <span className="font-medium">{data.sentiment_label[lang]}</span>
        </div>

        {showSentimentWarn && (
          <div className="mt-3 text-xs text-orange-500 font-medium">
            {SENTIMENT_WARN_LABELS[lang]}
          </div>
        )}
      </Card>

      {/* Keywords */}
      <Card className="p-6 rounded-xl lg:col-span-2">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {LABELS.keywords[lang]}
        </h2>

        <div className="flex flex-wrap gap-2">
          {data.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/30 hover:bg-primary/20 transition-colors"
            >
              {keyword}
            </span>
          ))}
        </div>
      </Card>

      {/* Word Count */}
      {typeof data.word_count === "number" && (
        <Card className="p-6 rounded-xl lg:col-span-2">
          <div className="text-sm text-muted-foreground">
            <strong>{LABELS.word_count[lang]}:</strong> {data.word_count}
          </div>
        </Card>
      )}
    </div>
  );
}
