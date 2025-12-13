import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Guides, tutorials, and support for using the platform.</p>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 border-dashed">
         <div className="rounded-full bg-background p-4 shadow-sm mb-4">
           <HelpCircle className="h-8 w-8 text-muted-foreground" />
         </div>
         <h3 className="font-semibold text-lg">Help Center</h3>
         <p className="text-muted-foreground max-w-sm mt-1">
           Documentation and support resources will be populated here.
         </p>
      </Card>
    </div>
  );
}
