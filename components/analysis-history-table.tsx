'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HistoryItem {
  id: number
  fileName: string
  analysisDate: string
  status: 'completed' | 'failed' | 'pending'
}

interface AnalysisHistoryTableProps {
  data: HistoryItem[]
}

export function AnalysisHistoryTable({ data }: AnalysisHistoryTableProps) {
  const getStatusBadge = (status: string) => {
    const config = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: '✓ Completed'
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        label: '✕ Failed'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        label: '○ Pending'
      }
    }
    return config[status as keyof typeof config]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                File Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Analysis Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => {
              const statusConfig = getStatusBadge(item.status)
              return (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {item.fileName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(item.analysisDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'completed' ? (
                      <Link href="/results">
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        View Results
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
