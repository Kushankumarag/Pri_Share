import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Mail, Download, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { storage } from '../utils/storage';
import { getShareUrl } from '../utils/helpers';
import { SharedLink } from '../types';

export function Success() {
  const { linkId } = useParams<{ linkId: string }>();
  const [sharedLink, setSharedLink] = useState<SharedLink | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (linkId) {
      const link = storage.getSharedLinkById(linkId);
      setSharedLink(link);
    }
  }, [linkId]);

  if (!sharedLink) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Link not found</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Create a new link
        </Link>
      </div>
    );
  }

  const shareUrl = getShareUrl(sharedLink.id);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Document Shared with You');
    const body = encodeURIComponent(
      `I've shared a document with you. Access it here:\n\n${shareUrl}\n\n` +
      (sharedLink.pinRequired ? 'Note: This link requires a PIN to access.\n\n' : '') +
      'This is a secure, print-only link that will expire after use.'
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `prishare-qr-${sharedLink.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-100 p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Link Created Successfully!</h1>
              <p className="text-gray-600 mt-1">Share this secure link to allow print-only access</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={shareViaEmail}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Share via Email</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-gray-900 mb-4">QR Code</h3>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  id="qr-code"
                  value={shareUrl}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <button
                onClick={downloadQR}
                className="mt-4 px-6 py-2 text-sm border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download QR Code</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Link Details</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>Expires in {sharedLink.document?.expiryHours || 24} hours</li>
              <li>Print mode: {sharedLink.printSettings.color === 'bw' ? 'Black & White' : 'Color'}</li>
              <li>Copies: {sharedLink.printSettings.copies}</li>
              {sharedLink.pinRequired && <li>PIN protection enabled</li>}
              {sharedLink.document?.autoDeleteAfterPrint && <li>Auto-deletes after printing</li>}
              {sharedLink.document?.watermarkText && <li>Watermark: {sharedLink.document.watermarkText}</li>}
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Link
              to="/links"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>View All Links</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
