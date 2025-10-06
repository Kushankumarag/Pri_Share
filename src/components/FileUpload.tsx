import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { isValidFileType, formatFileSize } from '../utils/helpers';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onClearFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (isValidFileType(file)) {
      onFileSelect(file);
    } else {
      alert('Invalid file type. Please upload PDF, DOCX, PPTX, or image files.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
          `}
        >
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your document here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Supports PDF, DOCX, PPTX, PPT, DOC, PNG, JPG
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.pptx,.ppt,.doc,.png,.jpg,.jpeg"
            onChange={handleFileInputChange}
          />
        </div>
      ) : (
        <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                <p className="text-xs text-green-600 mt-1">Ready to share</p>
              </div>
            </div>
            <button
              onClick={onClearFile}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
