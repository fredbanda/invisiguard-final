import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface InsightsPanelProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  insights: any
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  if (!insights || Object.keys(insights).length === 0) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Additional Insights</CardTitle>
        <CardDescription>Detailed information from the analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.ipLocation && (
          <div>
            <h3 className="font-medium mb-2">IP Location</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {insights.ipLocation.country && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country:</span>
                  <span className="font-medium">{insights.ipLocation.country}</span>
                </div>
              )}
              {insights.ipLocation.city && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{insights.ipLocation.city}</span>
                </div>
              )}
              {insights.ipLocation.isp && (
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">ISP:</span>
                  <span className="font-medium">{insights.ipLocation.isp}</span>
                </div>
              )}
            </div>
            <Separator className="my-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}


