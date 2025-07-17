import { Link, useLocation } from "wouter";
import { 
  Home,
  Upload,
  BookOpen,
  MessageSquare,
  Clock,
  FileText,
  PenTool,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Study Guides", href: "/study-guides", icon: BookOpen },
  { name: "Mock Tests", href: "/mock-tests", icon: PenTool },
  { name: "AI Chat", href: "/chat", icon: Brain },
  { name: "Reminders", href: "/reminders", icon: Clock },
  { name: "Library", href: "/library", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white" size={16} />
          </div>
          <span className="text-xl font-bold text-slate-900">StudyMate AI</span>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-2">Ready to boost your studies?</p>
          <p className="text-xs text-slate-500">Upload documents and get AI-powered study guides!</p>
        </div>
      </div>
    </div>
  );
}