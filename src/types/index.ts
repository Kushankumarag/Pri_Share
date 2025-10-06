export interface Document {
  id: string;
  userId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  watermarkText?: string;
  autoDeleteAfterPrint: boolean;
  autoDeleteAfterView: boolean;
  expiryHours: number;
  createdAt: string;
  expiresAt: string;
}

export interface PrintSettings {
  color: 'color' | 'bw';
  copies: number;
  pages: string;
}

export interface SharedLink {
  id: string;
  documentId: string;
  pinRequired: boolean;
  pinHash?: string;
  maxUses: number;
  useCount: number;
  status: 'active' | 'printed' | 'expired' | 'revoked';
  printSettings: PrintSettings;
  senderEmail?: string;
  createdAt: string;
  lastAccessedAt?: string;
  printedAt?: string;
  revokedAt?: string;
  document?: Document;
}

export interface AccessLog {
  id: string;
  sharedLinkId: string;
  accessType: 'view' | 'print' | 'download_attempt';
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  defaultPrintMode: 'color' | 'bw';
  defaultCopies: number;
  defaultExpiryHours: number;
  defaultWatermark?: string;
  notificationEmail?: string;
  theme: 'light' | 'dark';
  createdAt: string;
  updatedAt: string;
}

export interface UploadFormData {
  file: File | null;
  printSettings: PrintSettings;
  pinRequired: boolean;
  pin?: string;
  senderEmail?: string;
  watermarkText?: string;
  autoDeleteAfterPrint: boolean;
  autoDeleteAfterView: boolean;
  expiryHours: number;
}
