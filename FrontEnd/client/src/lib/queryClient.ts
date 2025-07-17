import { QueryClient } from "@tanstack/react-query";
import { mockApi } from "@/services/mockApi";

// Frontend-only query client with mock data
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [endpoint] = queryKey as string[];
        
        switch (endpoint) {
          case '/api/documents':
            return await mockApi.getDocuments();
          case '/api/study-guides':
            return await mockApi.getStudyGuides();
          case '/api/mock-tests':
            return await mockApi.getMockTests();
          case '/api/chat':
            return await mockApi.getChatMessages();
          case '/api/reminders':
            return await mockApi.getReminders();
          case '/api/dashboard/stats':
            return await mockApi.getDashboardStats();
          default:
            throw new Error(`Unknown endpoint: ${endpoint}`);
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Mock API helper for mutations
export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: any
) {
  // Return mock responses based on URL and method
  const mockResponse = {
    ok: true,
    status: 200,
    json: async () => {
      if (method === "POST" && url === "/api/upload") {
        const file = body.get('file') as File;
        return await mockApi.uploadDocument(file);
      }
      
      if (method === "POST" && url === "/api/study-guides") {
        return await mockApi.generateStudyGuide(body.documentId);
      }
      
      if (method === "POST" && url === "/api/mock-tests") {
        return await mockApi.generateMockTest(body.documentId);
      }
      
      if (method === "POST" && url === "/api/test-results") {
        return await mockApi.submitTestResult(body.mockTestId, body.answers);
      }
      
      if (method === "POST" && url === "/api/chat") {
        const messages = await mockApi.sendChatMessage(body.message);
        return messages[messages.length - 1]; // Return the AI response
      }
      
      if (method === "POST" && url === "/api/reminders") {
        return await mockApi.createReminder(body);
      }
      
      if (method === "PUT" && url.includes("/api/reminders/")) {
        const id = parseInt(url.split("/").pop() || "0");
        return await mockApi.updateReminder(id, body);
      }
      
      if (method === "DELETE" && url.includes("/api/reminders/")) {
        const id = parseInt(url.split("/").pop() || "0");
        await mockApi.deleteReminder(id);
        return { message: "Reminder deleted successfully" };
      }
      
      if (method === "DELETE" && url.includes("/api/documents/")) {
        const id = parseInt(url.split("/").pop() || "0");
        await mockApi.deleteDocument(id);
        return { message: "Document deleted successfully" };
      }
      
      return {};
    }
  };
  
  return mockResponse as Response;
}
