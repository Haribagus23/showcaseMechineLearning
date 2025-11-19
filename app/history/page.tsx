'use client'

import { getHistory } from "@/lib/api";
import { HistoryItem } from "@/types/history";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HistoryPage() {
  let data: HistoryItem[] = [];
  let error: string | null = null;
  try {
    data = await getHistory();
  } catch (e: any) {
    error = e?.message || "Failed to load history.";
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Analysis History</h1>
        {error ? (
          <div className="text-red-600 mb-8">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground">No analysis history yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <HistoryCardItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCardItem({ item }: { item: HistoryItem }) {
  const sentimentColor = {
    positive: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    neutral: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    negative: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }[item.sentiment as "positive" | "neutral" | "negative"] || sentimentColor["neutral"];

  return (
    <Card className="p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-lg text-foreground truncate w-2/3" title={item.fileName}>{item.fileName}</span>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${sentimentColor}`}>{item.sentiment}</span>
      </div>
      <div className="text-sm text-muted-foreground mb-1">{new Date(item.timestamp).toLocaleString()}</div>
      <div className="mb-2 text-xs text-primary flex flex-wrap gap-1">
        {item.keywords.slice(0, 3).map((kw, i) => (
          <span key={i} className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full">{kw}</span>
        ))}
      </div>
      <div className="line-clamp-2 text-sm mb-3">{item.summary}</div>
      <Button size="sm" variant="outline" disabled>
        View Full Result
      </Button>
    </Card>
  );
}
