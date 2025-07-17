import { Document, StudyGuide, MockTest, TestResult, ChatMessage, Reminder, DashboardStats } from "../../../shared/schema";

// Mock data storage
let documents: Document[] = [
  {
    id: 1,
    userId: 1,
    filename: "algebra-notes.pdf",
    originalName: "Algebra Chapter 1 Notes.pdf",
    fileType: "application/pdf",
    fileSize: 1024000,
    extractedText: "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. Variables represent numbers in equations and expressions.",
    uploadedAt: new Date("2024-01-15"),
    processed: true
  },
  {
    id: 2,
    userId: 1,
    filename: "chemistry-formulas.pdf",
    originalName: "Chemistry Formulas Reference.pdf",
    fileType: "application/pdf",
    fileSize: 2048000,
    extractedText: "Chemical formulas represent the composition of chemical compounds. H2O represents water molecule with two hydrogen atoms and one oxygen atom.",
    uploadedAt: new Date("2024-01-10"),
    processed: true
  }
];

let studyGuides: StudyGuide[] = [
  {
    id: 1,
    userId: 1,
    documentId: 1,
    title: "Algebra Fundamentals",
    content: "# Algebra Fundamentals\n\n## Key Concepts\n- Variables and expressions\n- Solving equations\n- Graphing functions",
    summary: "Comprehensive guide covering basic algebra concepts including variables, equations, and functions.",
    keyPoints: ["Variables represent unknown values", "Equations can be solved systematically", "Functions show relationships between variables"],
    createdAt: new Date("2024-01-16")
  },
  {
    id: 2,
    userId: 1,
    documentId: 2,
    title: "Chemistry Basics",
    content: "# Chemistry Basics\n\n## Chemical Formulas\n- Understanding molecular composition\n- Balancing equations\n- Types of reactions",
    summary: "Essential chemistry concepts focusing on chemical formulas and reactions.",
    keyPoints: ["Chemical formulas show atomic composition", "Reactions must be balanced", "Different reaction types exist"],
    createdAt: new Date("2024-01-12")
  }
];

let mockTests: MockTest[] = [
  {
    id: 1,
    userId: 1,
    documentId: 1,
    title: "Algebra Quiz",
    questions: [
      {
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1,
        explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
      },
      {
        question: "Which represents a linear function?",
        options: ["y = x²", "y = 2x + 3", "y = x³", "y = 1/x"],
        correctAnswer: 1,
        explanation: "A linear function has the form y = mx + b, where m and b are constants"
      }
    ],
    createdAt: new Date("2024-01-17")
  }
];

let testResults: TestResult[] = [
  {
    id: 1,
    userId: 1,
    mockTestId: 1,
    score: 8,
    totalQuestions: 10,
    answers: [1, 1, 0, 1, 2, 1, 0, 1, 1, 0],
    completedAt: new Date("2024-01-18")
  }
];

let chatMessages: ChatMessage[] = [
  {
    id: 1,
    userId: 1,
    message: "Can you help me understand quadratic equations?",
    isFromUser: true,
    timestamp: new Date("2024-01-19T10:00:00")
  },
  {
    id: 2,
    userId: 1,
    message: "Quadratic equations are polynomials of degree 2, typically written as ax² + bx + c = 0. They can be solved using the quadratic formula, factoring, or completing the square.",
    isFromUser: false,
    timestamp: new Date("2024-01-19T10:00:30")
  }
];

let reminders: Reminder[] = [
  {
    id: 1,
    userId: 1,
    title: "Math Quiz Tomorrow",
    description: "Study algebra fundamentals and practice solving equations",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    completed: false,
    createdAt: new Date("2024-01-19")
  },
  {
    id: 2,
    userId: 1,
    title: "Chemistry Lab Report",
    description: "Complete lab report on chemical reactions",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    completed: false,
    createdAt: new Date("2024-01-18")
  }
];

// Helper function to simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to generate AI responses
function generateAIResponse(userMessage: string): string {
  const responses = [
    "I'd be happy to help you with that! Let me break it down for you.",
    "That's a great question! Here's what you need to know:",
    "Let me explain this concept step by step.",
    "I can help clarify that for you. Here's the key information:",
    "That's an important topic. Let me provide some guidance."
  ];
  return responses[Math.floor(Math.random() * responses.length)] + " " + 
         "Based on your study materials, here are the key points to focus on.";
}

export const mockApi = {
  // Documents
  getDocuments: async (): Promise<Document[]> => {
    await delay(300);
    return [...documents];
  },

  uploadDocument: async (file: File): Promise<Document> => {
    await delay(2000); // Simulate upload time
    
    const newDoc: Document = {
      id: documents.length + 1,
      userId: 1,
      filename: `doc_${Date.now()}.${file.name.split('.').pop()}`,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date(),
      processed: false
    };
    
    documents.push(newDoc);
    
    // Simulate processing
    setTimeout(async () => {
      newDoc.processed = true;
      newDoc.extractedText = `Extracted text from ${file.name}. This would contain the actual content of the uploaded document.`;
      
      // Auto-generate study guide
      const newGuide: StudyGuide = {
        id: studyGuides.length + 1,
        userId: 1,
        documentId: newDoc.id,
        title: `Study Guide: ${file.name}`,
        content: `# Study Guide for ${file.name}\n\n## Summary\nThis guide covers the main concepts from your uploaded document.\n\n## Key Points\n- Important concept 1\n- Important concept 2\n- Important concept 3`,
        summary: `AI-generated study guide for ${file.name}`,
        keyPoints: ["Key concept from document", "Important formula or definition", "Practice recommendation"],
        createdAt: new Date()
      };
      studyGuides.push(newGuide);
      
      // Auto-generate mock test
      const newTest: MockTest = {
        id: mockTests.length + 1,
        userId: 1,
        documentId: newDoc.id,
        title: `Quiz: ${file.name}`,
        questions: [
          {
            question: `Based on ${file.name}, what is the main concept discussed?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "This is the correct answer based on the document content."
          }
        ],
        createdAt: new Date()
      };
      mockTests.push(newTest);
    }, 3000);
    
    return newDoc;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await delay(300);
    documents = documents.filter(doc => doc.id !== id);
    studyGuides = studyGuides.filter(guide => guide.documentId !== id);
    mockTests = mockTests.filter(test => test.documentId !== id);
  },

  // Study Guides
  getStudyGuides: async (): Promise<StudyGuide[]> => {
    await delay(300);
    return [...studyGuides];
  },

  generateStudyGuide: async (documentId: number): Promise<StudyGuide> => {
    await delay(2000);
    const document = documents.find(doc => doc.id === documentId);
    if (!document) throw new Error("Document not found");
    
    const newGuide: StudyGuide = {
      id: studyGuides.length + 1,
      userId: 1,
      documentId,
      title: `Study Guide: ${document.originalName}`,
      content: `# Study Guide\n\n## Overview\nAI-generated content based on ${document.originalName}\n\n## Key Concepts\n- Concept 1\n- Concept 2\n- Concept 3`,
      summary: `Comprehensive study guide for ${document.originalName}`,
      keyPoints: ["Important point 1", "Important point 2", "Important point 3"],
      createdAt: new Date()
    };
    
    studyGuides.push(newGuide);
    return newGuide;
  },

  // Mock Tests
  getMockTests: async (): Promise<MockTest[]> => {
    await delay(300);
    return [...mockTests];
  },

  generateMockTest: async (documentId: number): Promise<MockTest> => {
    await delay(2000);
    const document = documents.find(doc => doc.id === documentId);
    if (!document) throw new Error("Document not found");
    
    const newTest: MockTest = {
      id: mockTests.length + 1,
      userId: 1,
      documentId,
      title: `Practice Test: ${document.originalName}`,
      questions: [
        {
          question: "Sample question based on the document content?",
          options: ["Answer A", "Answer B", "Answer C", "Answer D"],
          correctAnswer: 0,
          explanation: "This is why this answer is correct."
        },
        {
          question: "Another question to test understanding?",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 2,
          explanation: "Detailed explanation of the correct answer."
        }
      ],
      createdAt: new Date()
    };
    
    mockTests.push(newTest);
    return newTest;
  },

  submitTestResult: async (mockTestId: number, answers: number[]): Promise<TestResult> => {
    await delay(500);
    const test = mockTests.find(t => t.id === mockTestId);
    if (!test) throw new Error("Test not found");
    
    const score = answers.reduce((correct, answer, index) => {
      return correct + (answer === test.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const result: TestResult = {
      id: testResults.length + 1,
      userId: 1,
      mockTestId,
      score,
      totalQuestions: test.questions.length,
      answers,
      completedAt: new Date()
    };
    
    testResults.push(result);
    return result;
  },

  getTestResults: async (): Promise<TestResult[]> => {
    await delay(300);
    return [...testResults];
  },

  // Chat
  getChatMessages: async (): Promise<ChatMessage[]> => {
    await delay(300);
    return [...chatMessages];
  },

  sendChatMessage: async (message: string): Promise<ChatMessage[]> => {
    await delay(800);
    
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      userId: 1,
      message,
      isFromUser: true,
      timestamp: new Date()
    };
    chatMessages.push(userMessage);
    
    const aiResponse: ChatMessage = {
      id: chatMessages.length + 1,
      userId: 1,
      message: generateAIResponse(message),
      isFromUser: false,
      timestamp: new Date()
    };
    chatMessages.push(aiResponse);
    
    return [userMessage, aiResponse];
  },

  // Reminders
  getReminders: async (): Promise<Reminder[]> => {
    await delay(300);
    return [...reminders];
  },

  createReminder: async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>): Promise<Reminder> => {
    await delay(400);
    
    const newReminder: Reminder = {
      id: reminders.length + 1,
      userId: 1,
      ...reminderData,
      createdAt: new Date()
    };
    
    reminders.push(newReminder);
    return newReminder;
  },

  updateReminder: async (id: number, updates: Partial<Reminder>): Promise<Reminder> => {
    await delay(400);
    const index = reminders.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Reminder not found");
    
    reminders[index] = { ...reminders[index], ...updates };
    return reminders[index];
  },

  deleteReminder: async (id: number): Promise<void> => {
    await delay(300);
    reminders = reminders.filter(r => r.id !== id);
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(400);
    
    const completedTests = testResults.length;
    const avgScore = testResults.length > 0 
      ? testResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / testResults.length
      : 0;
    
    return {
      documentsCount: documents.length,
      studyGuidesCount: studyGuides.length,
      testsCompleted: completedTests,
      pendingReminders: reminders.filter(r => !r.completed && new Date(r.dueDate) > new Date()).length,
      averageScore: Math.round(avgScore)
    };
  }
};