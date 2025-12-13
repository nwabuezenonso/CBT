import { Card } from "@/components/ui/card";
import { FileOutput } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and download detailed reports.</p>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 border-dashed">
         <div className="rounded-full bg-background p-4 shadow-sm mb-4">
           <FileOutput className="h-8 w-8 text-muted-foreground" />
         </div>
         <h3 className="font-semibold text-lg">Reports module coming soon</h3>
         <p className="text-muted-foreground max-w-sm mt-1">
           Exportable PDF and Excel reports will be generated here.
         </p>
      </Card>
    </div>
  );
}
