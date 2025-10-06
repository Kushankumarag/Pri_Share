import { Lock, Mail, Clock, Droplet, Eye } from 'lucide-react';

interface SecurityOptionsProps {
  pinRequired: boolean;
  onPinRequiredChange: (value: boolean) => void;
  pin: string;
  onPinChange: (value: string) => void;
  senderEmail: string;
  onSenderEmailChange: (value: string) => void;
  watermark: string;
  onWatermarkChange: (value: string) => void;
  autoDeleteAfterPrint: boolean;
  onAutoDeleteAfterPrintChange: (value: boolean) => void;
  autoDeleteAfterView: boolean;
  onAutoDeleteAfterViewChange: (value: boolean) => void;
  expiryHours: number;
  onExpiryHoursChange: (value: number) => void;
}

export function SecurityOptions({
  pinRequired,
  onPinRequiredChange,
  pin,
  onPinChange,
  senderEmail,
  onSenderEmailChange,
  watermark,
  onWatermarkChange,
  autoDeleteAfterPrint,
  onAutoDeleteAfterPrintChange,
  autoDeleteAfterView,
  onAutoDeleteAfterViewChange,
  expiryHours,
  onExpiryHoursChange,
}: SecurityOptionsProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900">Security & Privacy</h3>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="pinRequired"
            checked={pinRequired}
            onChange={(e) => onPinRequiredChange(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <label htmlFor="pinRequired" className="flex items-center font-medium text-gray-900 cursor-pointer">
              <Lock className="h-4 w-4 mr-2" />
              PIN Protection
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Require a PIN code to access the document
            </p>
          </div>
        </div>

        {pinRequired && (
          <div className="ml-7">
            <input
              type="text"
              value={pin}
              onChange={(e) => onPinChange(e.target.value)}
              placeholder="Enter 4-6 digit PIN"
              maxLength={6}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="flex items-center font-medium text-gray-900 mb-2">
            <Mail className="h-4 w-4 mr-2" />
            Email for Notifications
          </label>
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => onSenderEmailChange(e.target.value)}
            placeholder="your@email.com (optional)"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Receive notifications when document is viewed or printed
          </p>
        </div>

        <div>
          <label className="flex items-center font-medium text-gray-900 mb-2">
            <Droplet className="h-4 w-4 mr-2" />
            Watermark Text
          </label>
          <input
            type="text"
            value={watermark}
            onChange={(e) => onWatermarkChange(e.target.value)}
            placeholder="e.g., CONFIDENTIAL"
            maxLength={50}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add a visible watermark to the document
          </p>
        </div>

        <div>
          <label className="flex items-center font-medium text-gray-900 mb-2">
            <Clock className="h-4 w-4 mr-2" />
            Link Expiry
          </label>
          <select
            value={expiryHours}
            onChange={(e) => onExpiryHoursChange(parseInt(e.target.value))}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={24}>24 hours</option>
            <option value={72}>3 days</option>
            <option value={168}>1 week</option>
          </select>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="autoDeletePrint"
              checked={autoDeleteAfterPrint}
              onChange={(e) => onAutoDeleteAfterPrintChange(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoDeletePrint" className="flex-1 text-sm text-gray-700 cursor-pointer">
              Auto-delete after first print
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="autoDeleteView"
              checked={autoDeleteAfterView}
              onChange={(e) => onAutoDeleteAfterViewChange(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoDeleteView" className="flex-1 text-sm text-gray-700 cursor-pointer">
              Auto-delete after first view
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
