import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { PrintSettings } from '../components/PrintSettings';
import { SecurityOptions } from '../components/SecurityOptions';
import { generateId, hashPin, fileToBase64 } from '../utils/helpers';
import { storage } from '../utils/storage';
import { Document, SharedLink, PrintSettings as PrintSettingsType } from '../types';

export function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const userSettings = storage.getUserSettings();

  const [printSettings, setPrintSettings] = useState<PrintSettingsType>({
    color: userSettings.defaultPrintMode,
    copies: userSettings.defaultCopies,
    pages: 'all',
  });

  const [pinRequired, setPinRequired] = useState(false);
  const [pin, setPin] = useState('');
  const [senderEmail, setSenderEmail] = useState(userSettings.notificationEmail || '');
  const [watermark, setWatermark] = useState(userSettings.defaultWatermark || '');
  const [autoDeleteAfterPrint, setAutoDeleteAfterPrint] = useState(true);
  const [autoDeleteAfterView, setAutoDeleteAfterView] = useState(false);
  const [expiryHours, setExpiryHours] = useState(userSettings.defaultExpiryHours);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (pinRequired && (!pin || pin.length < 4)) {
      alert('Please enter a PIN of at least 4 digits');
      return;
    }

    setIsUploading(true);

    try {
      const fileData = await fileToBase64(selectedFile);
      const documentId = generateId();
      const linkId = generateId();
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

      const document: Document = {
        id: documentId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        storagePath: fileData,
        watermarkText: watermark || undefined,
        autoDeleteAfterPrint,
        autoDeleteAfterView,
        expiryHours,
        createdAt: now,
        expiresAt,
      };

      const sharedLink: SharedLink = {
        id: linkId,
        documentId,
        pinRequired,
        pinHash: pinRequired ? hashPin(pin) : undefined,
        maxUses: 1,
        useCount: 0,
        status: 'active',
        printSettings,
        senderEmail: senderEmail || undefined,
        createdAt: now,
        document,
      };

      storage.saveDocument(document);
      storage.saveSharedLink(sharedLink);

      navigate(`/success/${linkId}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to create share link. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Document</h1>
        <p className="text-gray-600">Upload a document and create a secure, print-only share link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onClearFile={() => setSelectedFile(null)}
          />
        </div>

        {selectedFile && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <PrintSettings settings={printSettings} onChange={setPrintSettings} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <SecurityOptions
                pinRequired={pinRequired}
                onPinRequiredChange={setPinRequired}
                pin={pin}
                onPinChange={setPin}
                senderEmail={senderEmail}
                onSenderEmailChange={setSenderEmail}
                watermark={watermark}
                onWatermarkChange={setWatermark}
                autoDeleteAfterPrint={autoDeleteAfterPrint}
                onAutoDeleteAfterPrintChange={setAutoDeleteAfterPrint}
                autoDeleteAfterView={autoDeleteAfterView}
                onAutoDeleteAfterViewChange={setAutoDeleteAfterView}
                expiryHours={expiryHours}
                onExpiryHoursChange={setExpiryHours}
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`
                w-full py-4 rounded-xl font-semibold text-white
                transition-all duration-200 flex items-center justify-center space-x-2
                ${isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              <Share2 className="h-5 w-5" />
              <span>{isUploading ? 'Creating Link...' : 'Generate Share Link'}</span>
            </button>
          </>
        )}
      </form>
    </div>
  );
}
