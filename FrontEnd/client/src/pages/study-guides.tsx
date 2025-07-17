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
import { BookOpen, Plus, Calendar, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { StudyGuide, Document } from "@shared/schema";

export default function StudyGuides() {
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [title, setTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: studyGuides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ['/api/study-guides'],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['/api/documents'],
  });

  const processedDocuments = documents.filter((doc: Document) => doc.processed && doc.extractedText);

  const generateMutation = useMutation({
    mutationFn: async ({ documentId, title }: { documentId: number; title?: string }) => {
      const response = await apiRequest('POST', '/api/study-guides', { documentId, title });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/study-guides'] });
      setIsDialogOpen(false);
      setSelectedDocument("");
      setTitle("");
      toast({ title: "Study guide generated successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate study guide",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    if (!selectedDocument) return;
    generateMutation.mutate({ 
      documentId: parseInt(selectedDocument), 
      title: title.trim() || undefined 
    });
  };

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <BookOpen className="text-secondary" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Study Guides</h2>
              <p className="text-slate-600">AI-generated study materials</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Generate Guide
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Study Guide</DialogTitle>
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
                <Button 
                  onClick={handleGenerate}
                  disabled={!selectedDocument || generateMutation.isPending}
                  className="w-full"
                >
                  {generateMutation.isPending ? "Generating..." : "Generate Study Guide"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-8">
        {guidesLoading ? (
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
        ) : studyGuides.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No study guides yet</h3>
              <p className="text-slate-500 mb-4">Upload documents and generate your first study guide</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Generate Your First Guide
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(studyGuides as StudyGuide[]).map((guide) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        <span>{new Date(guide.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <FileText size={12} className="mr-1" />
                      Guide
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {guide.summary}
                  </p>
                  {guide.keyPoints && guide.keyPoints.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-900 mb-2">Key Points:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {guide.keyPoints.slice(0, 3).map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span className="line-clamp-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Guide
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
