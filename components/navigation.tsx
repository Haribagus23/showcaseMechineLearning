import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-foreground hover:opacity-80 transition-opacity">
          📄 DocAnalyzer
        </Link>
        
        <div className="flex gap-2">
          <Link href="/upload">
            <Button variant="ghost" size="sm">
              Upload
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              History
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
