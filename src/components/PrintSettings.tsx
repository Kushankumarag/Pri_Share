import { PrintSettings as PrintSettingsType } from '../types';

interface PrintSettingsProps {
  settings: PrintSettingsType;
  onChange: (settings: PrintSettingsType) => void;
}

export function PrintSettings({ settings, onChange }: PrintSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Print Settings</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Print Mode
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => onChange({ ...settings, color: 'bw' })}
              className={`
                flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all
                ${settings.color === 'bw'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Black & White
            </button>
            <button
              onClick={() => onChange({ ...settings, color: 'color' })}
              className={`
                flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all
                ${settings.color === 'color'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Color
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Copies
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.copies}
            onChange={(e) => onChange({ ...settings, copies: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Range
        </label>
        <input
          type="text"
          value={settings.pages}
          onChange={(e) => onChange({ ...settings, pages: e.target.value })}
          placeholder="e.g., all, 1-3, 1,3,5"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter 'all' for all pages, or specify ranges like '1-3' or '1,3,5'
        </p>
      </div>
    </div>
  );
}
