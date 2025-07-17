import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, FileText, Calendar, Download, Trash2 } from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

export default function Library() {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['/api/documents'],
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="text-red-600" size={20} />;
    if (fileType.includes('image')) return <FileText className="text-blue-600" size={20} />;
    return <FileText className="text-gray-600" size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
              <Folder className="text-accent" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">My Library</h2>
              <p className="text-slate-600">Manage your uploaded documents</p>
            </div>
          </div>
          <Link href="/upload">
            <Button>Upload New File</Button>
          </Link>
        </div>
      </header>

      <div className="p-6 lg:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No documents yet</h3>
              <p className="text-slate-500 mb-4">Upload your first document to get started</p>
              <Link href="/upload">
                <Button>Upload Document</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(documents as Document[]).map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100">
                        {getFileIcon(document.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{document.originalName}</CardTitle>
                        <p className="text-sm text-slate-500">{formatFileSize(document.fileSize)}</p>
                      </div>
                    </div>
                    <Badge variant={document.processed ? "secondary" : "outline"}>
                      {document.processed ? "Ready" : "Processing"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      <span>Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    
                    {document.processed && document.extractedText && (
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {document.extractedText.substring(0, 150)}...
                      </p>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" disabled>
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
