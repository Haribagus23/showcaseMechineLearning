'use client'

import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DocumentUploadCardProps {
  isLoading?: boolean
  onUpload?: () => void
}

export function DocumentUploadCard({ isLoading = false, onUpload }: DocumentUploadCardProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loadingAnalyze, setLoadingAnalyze] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // 1. DRAG EVENTS
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  // 2. SET FILE
  const handleFile = (file: File) => {
    setSelectedFile(file)
    onUpload?.()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  // 3. ANALYZE FILE KE API HUGGINGFACE
  const analyzeDocument = async () => {
    if (!selectedFile) return

    setLoadingAnalyze(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await fetch(
        "https://haribagus1-DocAnalyzer-API1.hf.space/analyze",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await res.json()
      console.log("HASIL ANALISIS:", data)

      // Redirect ke page results + kirim hasil lewat localStorage
      localStorage.setItem("analysisResult", JSON.stringify(data))

      window.location.href = '/results'

    } catch (error) {
      console.error("UPLOAD ERROR:", error)
      alert("Gagal menganalisis dokumen.")
    }

    setLoadingAnalyze(false)
  }

  return (
    <Card 
      className={`p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border bg-secondary/30 hover:border-primary/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.txt,.docx"
        onChange={handleInputChange}
        disabled={isLoading}
      />

      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="text-5xl">📁</div>
        </div>

        {(isLoading || loadingAnalyze) ? (
          <>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Analyzing your document...
            </h3>
            <div className="flex justify-center gap-1 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Drag & drop your file here
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              or click to browse from your computer
            </p>

            <Button 
              size="lg"
              className="mt-6"
              onClick={(e) => {
                e.stopPropagation() // biar ga buka file picker
                if (!selectedFile) {
                  alert("Pilih file dulu.")
                  return
                }
                analyzeDocument()
              }}
            >
              Upload & Analyze
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
