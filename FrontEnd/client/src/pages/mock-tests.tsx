import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle, Plus, Calendar, Target, Play } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MockTest, Document } from "@shared/schema";

export default function MockTests() {
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [title, setTitle] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mockTests = [], isLoading: testsLoading } = useQuery({
    queryKey: ['/api/mock-tests'],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['/api/documents'],
  });

  const processedDocuments = documents.filter((doc: Document) => doc.processed && doc.extractedText);

  const generateMutation = useMutation({
    mutationFn: async ({ documentId, title, questionCount }: { documentId: number; title?: string; questionCount: number }) => {
      const response = await apiRequest('POST', '/api/mock-tests', { documentId, title, questionCount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mock-tests'] });
      setIsDialogOpen(false);
      setSelectedDocument("");
      setTitle("");
      setQuestionCount("5");
      toast({ title: "Mock test generated successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate mock test",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const submitMutation = useMutation({
    mutationFn: async ({ mockTestId, answers }: { mockTestId: number; answers: number[] }) => {
      const response = await apiRequest('POST', '/api/test-results', { mockTestId, answers });
      return response.json();
    },
    onSuccess: (result) => {
      const percentage = Math.round((result.score / result.totalQuestions) * 100);
      toast({ 
        title: `Test completed! Score: ${result.score}/${result.totalQuestions} (${percentage}%)`,
        description: "Great job! Keep practicing to improve your scores."
      });
      setActiveTest(null);
      setCurrentAnswers([]);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit test",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    if (!selectedDocument) return;
    generateMutation.mutate({ 
      documentId: parseInt(selectedDocument), 
      title: title.trim() || undefined,
      questionCount: parseInt(questionCount)
    });
  };

  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setCurrentAnswers(new Array(test.questions.length).fill(-1));
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setCurrentAnswers(newAnswers);
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    submitMutation.mutate({
      mockTestId: activeTest.id,
      answers: currentAnswers
    });
  };

  if (activeTest) {
    return (
      <div>
        <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{activeTest.title}</h2>
              <p className="text-slate-600">{activeTest.questions.length} questions</p>
            </div>
            <Button variant="outline" onClick={() => setActiveTest(null)}>
              Exit Test
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {activeTest.questions.map((question, questionIndex) => (
              <Card key={questionIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {questionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-900 mb-4">{question.question}</p>
                  <RadioGroup
                    value={currentAnswers[questionIndex]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(questionIndex, parseInt(value))}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-o${optionIndex}`} />
                        <Label htmlFor={`q${questionIndex}-o${optionIndex}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleSubmitTest}
                disabled={currentAnswers.includes(-1) || submitMutation.isPending}
                size="lg"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Test"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <HelpCircle className="text-success" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Mock Tests</h2>
              <p className="text-slate-600">Practice with AI-generated questions</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Mock Test</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document">Select Document</Label>
                  <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a processed document" />
                    </SelectTrigger>
                    <SelectContent>
                      {processedDocuments.map((doc: Document) => (
                        <SelectItem key={doc.id} value={doc.id.toString()}>
                          {doc.originalName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Custom Title (Optional)</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter custom title..."
                  />
                </div>
                <div>
                  <Label htmlFor="questionCount">Number of Questions</Label>
                  <Select value={questionCount} onValueChange={setQuestionCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleGenerate}
                  disabled={!selectedDocument || generateMutation.isPending}
                  className="w-full"
                >
                  {generateMutation.isPending ? "Generating..." : "Create Mock Test"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-8">
        {testsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : mockTests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No mock tests yet</h3>
              <p className="text-slate-500 mb-4">Upload documents and create your first mock test</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Your First Test
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mockTests as MockTest[]).map((test) => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{test.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <Target size={12} className="mr-1" />
                      Test
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Questions:</span>
                      <span className="font-medium">{test.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Estimated time:</span>
                      <span className="font-medium">{test.questions.length * 2} min</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartTest(test)}
                    className="w-full mt-4"
                  >
                    <Play size={16} className="mr-2" />
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
