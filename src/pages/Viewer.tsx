import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Lock, FileX, Clock, CheckCircle, Mail } from 'lucide-react';
import { storage } from '../utils/storage';
import { verifyPin, isExpired } from '../utils/helpers';
import { SharedLink } from '../types';

export function Viewer() {
  const { linkId } = useParams<{ linkId: string }>();
  const [sharedLink, setSharedLink] = useState<SharedLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (linkId) {
      const link = storage.getSharedLinkById(linkId);

      if (!link) {
        setError('Link not found or has been deleted');
        setLoading(false);
        return;
      }

      if (link.status !== 'active') {
        setError(`This link is ${link.status}`);
        setLoading(false);
        return;
      }

      if (link.document && isExpired(link.document.expiresAt)) {
        link.status = 'expired';
        storage.saveSharedLink(link);
        setError('This link has expired');
        setLoading(false);
        return;
      }

      setSharedLink(link);

      if (!link.pinRequired) {
        setIsPinVerified(true);
        logAccess(link.id, 'view', true);

        if (link.document?.autoDeleteAfterView) {
          setTimeout(() => {
            handleAutoDelete(link);
          }, 1000);
        }
      }

      setLoading(false);
    }

    const handleBeforeUnload = () => {
      if (sharedLink?.document?.autoDeleteAfterView && !hasPrinted) {
        handleAutoDelete(sharedLink);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [linkId]);

  useEffect(() => {
    if (isPinVerified && contentRef.current) {
      const disableContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      const disableKeys = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
          (e.metaKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
          e.key === 'PrintScreen'
        ) {
          e.preventDefault();
          return false;
        }
      };

      const element = contentRef.current;
      element.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('keydown', disableKeys);

      return () => {
        element.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableKeys);
      };
    }
  }, [isPinVerified]);

  const logAccess = (linkId: string, type: 'view' | 'print', success: boolean) => {
    console.log(`Access logged: ${type} - ${success ? 'success' : 'failed'}`);
  };

  const handleAutoDelete = (link: SharedLink) => {
    if (link.documentId) {
      storage.deleteDocument(link.documentId);
    }
    storage.deleteSharedLink(link.id);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sharedLink || !sharedLink.pinHash) return;

    if (verifyPin(pinInput, sharedLink.pinHash)) {
      setIsPinVerified(true);
      logAccess(sharedLink.id, 'view', true);
    } else {
      alert('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  const handlePrint = () => {
    if (!sharedLink) return;

    setIsPrinting(true);
    logAccess(sharedLink.id, 'print', true);

    setTimeout(() => {
      window.print();

      sharedLink.status = 'printed';
      sharedLink.printedAt = new Date().toISOString();
      sharedLink.useCount += 1;
      storage.saveSharedLink(sharedLink);

      setHasPrinted(true);
      setIsPrinting(false);

      if (sharedLink.document?.autoDeleteAfterPrint) {
        setTimeout(() => {
          handleAutoDelete(sharedLink);
          window.location.href = '/printed';
        }, 2000);
      }
    }, 500);
  };

  const contactSender = () => {
    if (sharedLink?.senderEmail) {
      window.open(`mailto:${sharedLink.senderEmail}?subject=Question about shared document`);
    } else {
      alert('No contact information available for this document.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <FileX className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (sharedLink && sharedLink.pinRequired && !isPinVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">PIN Required</h2>
              <p className="text-gray-600">This document is protected. Please enter the PIN to continue.</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Verify PIN
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!sharedLink?.document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{sharedLink.document.fileName}</h1>
              <p className="text-sm text-gray-600 mt-1">View-only document</p>
            </div>
            <div className="flex items-center space-x-3">
              {sharedLink.senderEmail && (
                <button
                  onClick={contactSender}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Sender</span>
                </button>
              )}
              <button
                onClick={handlePrint}
                disabled={isPrinting || hasPrinted}
                className={`
                  px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all
                  ${isPrinting || hasPrinted
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                {hasPrinted ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Printed</span>
                  </>
                ) : (
                  <>
                    <Printer className="h-5 w-5" />
                    <span>{isPrinting ? 'Printing...' : 'Print Now'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {hasPrinted && sharedLink.document.autoDeleteAfterPrint && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Document printed successfully</p>
              <p className="text-sm text-green-700 mt-1">This document will be deleted shortly for security.</p>
            </div>
          </div>
        )}

        <div
          ref={contentRef}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative select-none"
          style={{ userSelect: 'none' }}
        >
          {sharedLink.document.watermarkText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-10">
              <p className="text-6xl font-bold text-gray-900 transform rotate-45">
                {sharedLink.document.watermarkText}
              </p>
            </div>
          )}

          <div className="relative z-0">
            {sharedLink.document.fileType.startsWith('image/') ? (
              <img
                src={sharedLink.document.storagePath}
                alt={sharedLink.document.fileName}
                className="max-w-full h-auto mx-auto"
                draggable={false}
              />
            ) : sharedLink.document.fileType === 'application/pdf' ? (
              <div className="space-y-4">
                <embed
                  src={sharedLink.document.storagePath}
                  type="application/pdf"
                  className="w-full h-[800px] rounded-lg"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <FileX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Preview not available for this file type</p>
                <p className="text-sm text-gray-500">Use the Print button to print this document</p>
              </div>
            )}
          </div>
        </div>

        <div className="no-print mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Security Notice</p>
              <ul className="space-y-1">
                <li>This is a view-only document. Downloads and copying are disabled.</li>
                <li>Print settings: {sharedLink.printSettings.color === 'bw' ? 'Black & White' : 'Color'}, {sharedLink.printSettings.copies} {sharedLink.printSettings.copies === 1 ? 'copy' : 'copies'}</li>
                {sharedLink.document.autoDeleteAfterPrint && <li>This link will expire after printing.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
