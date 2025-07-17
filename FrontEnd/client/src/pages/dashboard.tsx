import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, CheckCircle, FileText, Trophy, 
  Upload, Wand2, HelpCircle, Brain, 
  Flame, Settings, Bell
} from "lucide-react";
import { Link } from "wouter";
import ChatInterface from "@/components/chat-interface";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: reminders = [], isLoading: remindersLoading } = useQuery({
    queryKey: ['/api/reminders'],
  });

  const upcomingReminders = reminders.slice(0, 3);

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Good morning, Fawaz!</h2>
            <p className="text-slate-600 mt-1">Ready to ace your studies today?</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search your materials..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell size={20} />
              {reminders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Study Hours Today</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 mt-1">4.2h</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Clock className="text-primary" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-success">+12%</span>
                <span className="text-slate-500 ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Tests Completed</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.testsCompleted || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-success" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-success">+3</span>
                <span className="text-slate-500 ml-1">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Documents</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.documentsCount || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                  <FileText className="text-accent" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-slate-500">Ready for processing</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Average Score</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.averageScore || 0}%</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Trophy className="text-warning" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-success">+5%</span>
                <span className="text-slate-500 ml-1">improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/upload">
                <a className="flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary group-hover:bg-opacity-20">
                    <Upload className="text-primary" size={24} />
                  </div>
                  <span className="text-slate-900 font-medium">Upload Document</span>
                  <span className="text-slate-500 text-sm mt-1">PDF, Images, Text</span>
                </a>
              </Link>

              <Link href="/study-guides">
                <a className="flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-secondary hover:bg-indigo-50 transition-colors group">
                  <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:bg-opacity-20">
                    <Wand2 className="text-secondary" size={24} />
                  </div>
                  <span className="text-slate-900 font-medium">Generate Study Guide</span>
                  <span className="text-slate-500 text-sm mt-1">AI-powered summaries</span>
                </a>
              </Link>

              <Link href="/mock-tests">
                <a className="flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-success hover:bg-emerald-50 transition-colors group">
                  <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-success group-hover:bg-opacity-20">
                    <HelpCircle className="text-success" size={24} />
                  </div>
                  <span className="text-slate-900 font-medium">Create Mock Test</span>
                  <span className="text-slate-500 text-sm mt-1">Practice questions</span>
                </a>
              </Link>

              <Link href="/chat">
                <a className="flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-accent hover:bg-violet-50 transition-colors group">
                  <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent group-hover:bg-opacity-20">
                    <Brain className="text-accent" size={24} />
                  </div>
                  <span className="text-slate-900 font-medium">Ask AI Assistant</span>
                  <span className="text-slate-500 text-sm mt-1">Get instant help</span>
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity - simplified for MVP */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <p className="text-slate-500">No recent activity. Start by uploading a document!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming</CardTitle>
                <Link href="/reminders">
                  <Button variant="ghost" size="sm">+ Add</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {remindersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="w-2 h-2 rounded-full mt-2" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingReminders.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm">No upcoming reminders</p>
                  </div>
                ) : (
                  upcomingReminders.map((reminder: any) => (
                    <div key={reminder.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-medium text-sm">{reminder.title}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Study Streak */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flame className="text-white" size={24} />
                  </div>
                  <p className="text-slate-900 font-bold text-lg">7 Day</p>
                  <p className="text-slate-500 text-sm">Study Streak!</p>
                  <div className="mt-3 bg-slate-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">3 more days to reach your goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Chat */}
        <ChatInterface />
      </div>
    </div>
  );
}
