import { SharedLink, Document, UserSettings } from '../types';

const STORAGE_KEYS = {
  SHARED_LINKS: 'prishare_shared_links',
  DOCUMENTS: 'prishare_documents',
  USER_SETTINGS: 'prishare_user_settings',
};

export const storage = {
  getSharedLinks(): SharedLink[] {
    const data = localStorage.getItem(STORAGE_KEYS.SHARED_LINKS);
    return data ? JSON.parse(data) : [];
  },

  saveSharedLink(link: SharedLink): void {
    const links = this.getSharedLinks();
    const index = links.findIndex(l => l.id === link.id);
    if (index >= 0) {
      links[index] = link;
    } else {
      links.push(link);
    }
    localStorage.setItem(STORAGE_KEYS.SHARED_LINKS, JSON.stringify(links));
  },

  getSharedLinkById(id: string): SharedLink | null {
    const links = this.getSharedLinks();
    return links.find(l => l.id === id) || null;
  },

  deleteSharedLink(id: string): void {
    const links = this.getSharedLinks().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.SHARED_LINKS, JSON.stringify(links));
  },

  getDocuments(): Document[] {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : [];
  },

  saveDocument(doc: Document): void {
    const docs = this.getDocuments();
    const index = docs.findIndex(d => d.id === doc.id);
    if (index >= 0) {
      docs[index] = doc;
    } else {
      docs.push(doc);
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  getDocumentById(id: string): Document | null {
    const docs = this.getDocuments();
    return docs.find(d => d.id === id) || null;
  },

  deleteDocument(id: string): void {
    const docs = this.getDocuments().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

    const links = this.getSharedLinks().filter(l => l.documentId !== id);
    localStorage.setItem(STORAGE_KEYS.SHARED_LINKS, JSON.stringify(links));
  },

  getUserSettings(): UserSettings {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return data ? JSON.parse(data) : {
      userId: 'default',
      defaultPrintMode: 'bw',
      defaultCopies: 1,
      defaultExpiryHours: 24,
      theme: 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  saveUserSettings(settings: UserSettings): void {
    settings.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  },
};
