import { normalizeAnalysis } from "../lib/normalizeAnalysis";

describe("normalizeAnalysis", () => {
  it("normalizes basic backend response", () => {
    const raw = {
      fileName: "testfile.pdf",
      summary: "Ini ringkasan.",
      keywords: ["foo", "bar"],
      sentiment: "POSITIVE",
      word_count: 102,
    };
    const res = normalizeAnalysis(raw);

    expect(res.fileName).toBe("testfile.pdf");
    expect(res.summary.id).toBe("Ini ringkasan.");
    expect(res.summary.en).toBe("Ini ringkasan.");
    expect(res.keywords).toEqual(["foo", "bar"]);
    expect(res.sentiment).toBe("positive");
    expect(res.sentiment_label.id).toBe("Positif");
    expect(res.word_count).toBe(102);
  });

  it("falls back to neutral sentiment on numpy error", () => {
    const raw = {
      summary: "short",
      error: "Sentiment analysis failed: Numpy not available",
      keywords: "a, b, c",
    };
    const res = normalizeAnalysis(raw, "filex.pdf");

    expect(res.sentiment).toBe("neutral");
    expect(res.errors).not.toBeNull();
    expect(res.summary.id).toBe("short");
    expect(res.fileName).toBe("filex.pdf");
  });

  it("handles legacy fields and creates summary/en", () => {
    const raw = {
      filename: "custom.docx",
      summary_en: "A summary.",
      sentiment_label: "neg",
      keywords: "one two three",
      text: "x y z",
    };
    const res = normalizeAnalysis(raw);

    expect(res.fileName).toBe("custom.docx");
    expect(res.summary.en).toBe("A summary.");
    expect(res.sentiment).toBe("negative");
    expect(res.keywords).toEqual(["one", "two", "three"]);
  });
});
