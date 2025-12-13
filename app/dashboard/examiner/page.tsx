import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  FileCheck, 
  CheckCircle, 
  Activity, 
  Plus, 
  Settings, 
  ExternalLink,
  BookOpen
} from "lucide-react";
import { getDashboardStats } from "@/app/actions/get-dashboard-stats";

export default async function ExaminerDashboard() {
  const statsRes = await getDashboardStats();
  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    totalExams: 0,
    activeExaminees: 0,
    completedExams: 0,
    averageScore: 0,
    recentExams: []
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your examination system performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/dashboard/examiner/exams">
            <Button variant="outline">
              Manage Exams
            </Button>
          </Link>
          <Link href="/dashboard/examiner/exams?create=true">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Exam
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Exams" 
          value={stats.totalExams} 
          icon={FileCheck} 
          description="Created so far"
          trend="+2 this week"
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatsCard 
          title="Active Students" 
          value={stats.activeExaminees} 
          icon={Users} 
          description="Registered examinees"
          trend="+12% vs last month"
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/20"
        />
        <StatsCard 
          title="Completions" 
          value={stats.completedExams} 
          icon={CheckCircle} 
          description="Total submissions"
          trend="98% completion rate"
          color="text-orange-600"
          bgColor="bg-orange-100 dark:bg-orange-900/20"
        />
        <StatsCard 
          title="Avg. Score" 
          value={`${stats.averageScore}%`} 
          icon={Activity} 
          description="Global performance"
          trend="+3.2% improvement"
          color="text-purple-600"
          bgColor="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Exams List */}
        <Card className="md:col-span-12 lg:col-span-4 xl:col-span-5 border-none shadow-md">
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
            <CardDescription>
              The most recent exams created in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentExams && stats.recentExams.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentExams.map((exam: any) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded bg-muted">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="truncate max-w-[150px] sm:max-w-xs" title={exam.title}>
                             {exam.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{exam.questionCount}</TableCell>
                      <TableCell>
                        <Badge variant={exam.isActive ? "default" : "secondary"} className={exam.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                          {exam.isActive ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/examiner/exams`}>
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                           </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  <p>No exams created yet.</p>
                  <Button variant="link" size="sm" className="mt-2">Create your first exam</Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <div className="md:col-span-12 lg:col-span-3 xl:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
               <Link href="/dashboard/examiner/students">
                  <Button variant="outline" className="w-full justify-start h-12 text-left">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Students
                  </Button>
               </Link>
               <Link href="/dashboard/examiner/results">
                  <Button variant="outline" className="w-full justify-start h-12 text-left">
                    <Activity className="mr-2 h-4 w-4" />
                    View Results Analysis
                  </Button>
               </Link>
               <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start h-12 text-left">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
               </Link>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-none shadow-none">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold text-foreground">All Systems Operational</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last backup: 2 hours ago
                  <br/>
                  Server load: Normal
                </p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description, trend, color, bgColor }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${bgColor}`}>
           <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
          {trend && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{trend}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
