import { Card } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into exam performance and student trends.</p>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 border-dashed">
         <div className="rounded-full bg-background p-4 shadow-sm mb-4">
           <PieChart className="h-8 w-8 text-muted-foreground" />
         </div>
         <h3 className="font-semibold text-lg">Analytics module coming soon</h3>
         <p className="text-muted-foreground max-w-sm mt-1">
           Detailed charts and insights will be available here.
         </p>
      </Card>
    </div>
  );
}
