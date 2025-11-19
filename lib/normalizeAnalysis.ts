export type NormalizedAnalysis = {
    fileName: string;
    summary: { id: string; en: string };
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative' | string;
    sentiment_label: { id: string; en: string };
    word_count: number;
    raw?: any;
    errors?: string[] | null;
  };
  
  export function normalizeAnalysis(raw: any, fallbackFileName?: string): NormalizedAnalysis {
    const fileName =
      raw.fileName ||
      raw.filename ||
      raw.name ||
      fallbackFileName ||
      'unknown.pdf';
  
    const summaryText =
      raw.summary ||
      raw.summary_text ||
      raw.summary_en ||
      raw.text_summary ||
      raw.text ||
      '';
  
    const summary = {
      id: raw.summary_id || summaryText,
      en: raw.summary_en || summaryText,
    };
  
    const keywords = Array.isArray(raw.keywords)
      ? raw.keywords
      : typeof raw.keywords === 'string'
      ? raw.keywords
          .split(/[\s,;]+/)
          .map((k: string) => k.trim())
          .filter(Boolean)
      : [];
  
    let sentiment = raw.sentiment || raw.sentiment_label || 'neutral';
    let numpyProb = false;
  
    if (typeof sentiment === 'string') {
      const s = sentiment.toLowerCase();
      if (s.includes('pos')) sentiment = 'positive';
      else if (s.includes('neg')) sentiment = 'negative';
      else sentiment = 'neutral';
    }
  
    // Sentinel for sentiment analysis error
    let errors: string[] | null =
      raw.error
        ? [raw.error]
        : raw.errors
        ? Array.isArray(raw.errors)
          ? raw.errors
          : [raw.errors]
        : null;
  
    if (
      (errors && errors.some((e) => typeof e === 'string' && /numpy/i.test(e))) ||
      (raw.error && typeof raw.error === 'string' && /numpy/i.test(raw.error))
    ) {
      sentiment = 'neutral';
      numpyProb = true;
    }
  
    const sentiment_label = {
      id:
        sentiment === 'positive'
          ? 'Positif'
          : sentiment === 'negative'
          ? 'Negatif'
          : 'Netral',
      en:
        sentiment === 'positive'
          ? 'Positive'
          : sentiment === 'negative'
          ? 'Negative'
          : 'Neutral',
    };
  
    const textForCount =
      raw.extracted_text || raw.text || summaryText || '';
  
    const word_count =
      raw.word_count ||
      raw.wordCount ||
      (typeof textForCount === 'string'
        ? textForCount.split(/\s+/).filter(Boolean).length
        : 0);
  
    // Add numpy sentinel to errors if detected
    if (numpyProb && (!errors || errors.length === 0)) {
      errors = [
        'Analisis sentimen gagal karena Numpy/Numpy error, fallback to neutral',
      ];
    }
  
    return {
      fileName,
      summary,
      keywords,
      sentiment,
      sentiment_label,
      word_count,
      raw,
      errors,
    };
  }
  