import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FileText, Copy, Share2, Ban, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { getShareUrl, formatRelativeTime, isExpired } from '../utils/helpers';
import { SharedLink } from '../types';

export function Links() {
  const [links, setLinks] = useState<SharedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    const allLinks = storage.getSharedLinks();

    allLinks.forEach(link => {
      if (link.status === 'active' && link.document && isExpired(link.document.expiresAt)) {
        link.status = 'expired';
        storage.saveSharedLink(link);
      }
    });

    setLinks(allLinks.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const copyLink = (linkId: string) => {
    const url = getShareUrl(linkId);
    navigator.clipboard.writeText(url);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeLink = (linkId: string) => {
    if (!confirm('Are you sure you want to revoke this link? It will no longer be accessible.')) {
      return;
    }

    const link = storage.getSharedLinkById(linkId);
    if (link) {
      link.status = 'revoked';
      link.revokedAt = new Date().toISOString();
      storage.saveSharedLink(link);
      loadLinks();
    }
  };

  const deleteLink = (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link and its document?')) {
      return;
    }

    const link = storage.getSharedLinkById(linkId);
    if (link && link.documentId) {
      storage.deleteDocument(link.documentId);
    }
    storage.deleteSharedLink(linkId);
    loadLinks();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'printed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'revoked':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'printed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'revoked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Links</h1>
          <p className="text-gray-600">Manage your shared document links</p>
        </div>
        <RouterLink
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Share2 className="h-5 w-5" />
          <span>New Link</span>
        </RouterLink>
      </div>

      {links.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No links yet</h3>
          <p className="text-gray-600 mb-6">Create your first secure share link to get started</p>
          <RouterLink
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Create Link</span>
          </RouterLink>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {link.document?.fileName || 'Unknown file'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created {formatRelativeTime(link.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(link.status)}`}>
                        {getStatusIcon(link.status)}
                        <span className="capitalize">{link.status}</span>
                      </span>
                      {link.pinRequired && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          PIN Protected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                {link.status === 'active' && (
                  <>
                    <button
                      onClick={() => copyLink(link.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>{copiedId === link.id ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <button
                      onClick={() => revokeLink(link.id)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all flex items-center space-x-2"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Revoke</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteLink(link.id)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
