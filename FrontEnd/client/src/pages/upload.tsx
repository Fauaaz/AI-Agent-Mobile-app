import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon } from "lucide-react";
import FileUpload from "@/components/file-upload";

export default function Upload() {
  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
            <UploadIcon className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upload Files</h2>
            <p className="text-slate-600">Upload your study materials for AI processing</p>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-8">
        <FileUpload />
      </div>
    </div>
  );
}
