import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { DocumentUploadCard } from "@/components/document-upload-card";
import { analyzeFormData } from "@/lib/api";
import { normalizeAnalysis } from "@/lib/normalizeAnalysis";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // New upload/analysis flow: analyzeFormData -> normalizeAnalysis -> sessionStorage + route
  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const rawRes = await analyzeFormData(formData);
      const normalized = normalizeAnalysis(rawRes, file?.name);

      const key = `analysis_${Date.now()}`;
      sessionStorage.setItem(key, JSON.stringify(normalized));

      router.push(`/results?analysisKey=${key}`);
    } catch (err: any) {
      setError(typeof err === "string" ? err : err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Document Analyzer
            </h1>
            <p className="text-muted-foreground">
              Upload and analyze your documents with AI
            </p>
          </div>

          {error && (
            <div className="mb-4 text-center text-red-600">{error}</div>
          )}

          <DocumentUploadCard
            isLoading={isUploading}
            onUpload={handleUpload}
          />
        </div>
      </main>
    </div>
  );
}
