
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  File
} from 'lucide-react';

interface FilePreviewProps {
  fileUrl: string;
  fileName: unknown;
  fileSize: unknown;
  fileMimeType?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ 
  fileUrl, 
  fileName, 
  fileSize, 
  fileMimeType 
}) => {
  const formatFileSize = (fileSize: unknown): string => {
    if (typeof fileSize === 'number') {
      return `${(fileSize / 1024).toFixed(1)} KB`;
    }
    if (typeof fileSize === 'string') {
      const sizeNum = Number(fileSize);
      if (!isNaN(sizeNum)) {
        return `${(sizeNum / 1024).toFixed(1)} KB`;
      }
    }
    return '';
  };

  const safeFileName = (fileName: unknown): string => {
    if (typeof fileName === 'string') {
      return fileName;
    }
    return 'File';
  };

  const isImage = fileMimeType?.startsWith('image/');
  const isVideo = fileMimeType?.startsWith('video/');
  const displayFileName = safeFileName(fileName);
  const displayFileSize = formatFileSize(fileSize);

  return (
    <div className="mt-2">
      {isImage && (
        <img
          src={fileUrl}
          alt={displayFileName}
          className="max-w-xs rounded-lg shadow-sm"
        />
      )}
      {isVideo && (
        <video
          src={fileUrl}
          controls
          className="max-w-xs rounded-lg shadow-sm"
        />
      )}
      {!isImage && !isVideo && (
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-xs">
          <File className="h-5 w-5 text-gray-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayFileName}</p>
            <p className="text-xs text-gray-500">{displayFileSize}</p>
          </div>
          <Button size="sm" variant="ghost" asChild>
            <a href={fileUrl} download={displayFileName}>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};
