import { Brain } from "lucide-react";
import ChatInterface from "@/components/chat-interface";

export default function Chat() {
  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Assistant</h2>
            <p className="text-slate-600">Get instant help with your studies</p>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
