import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen } from "lucide-react";

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Results & Grading</h1>
        <p className="text-muted-foreground">
          View exam results and grade essay submissions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Submissions awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 border-dashed">
         <div className="rounded-full bg-background p-4 shadow-sm mb-4">
           <Award className="h-8 w-8 text-muted-foreground" />
         </div>
         <h3 className="font-semibold text-lg">No Results Available</h3>
         <p className="text-muted-foreground max-w-sm mt-1">
           Once students take your exams, their results and submissions will appear here for grading and analysis.
         </p>
      </Card>
    </div>
  );
}
