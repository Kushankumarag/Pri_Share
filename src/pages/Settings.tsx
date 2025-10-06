import { useState, useEffect } from 'react';
import { Save, Moon, Sun, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { UserSettings } from '../types';

export function Settings() {
  const [settings, setSettings] = useState<UserSettings>(storage.getUserSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleSave = () => {
    storage.saveUserSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all your shared links and documents? This cannot be undone.')) {
      const links = storage.getSharedLinks();
      links.forEach(link => {
        if (link.documentId) {
          storage.deleteDocument(link.documentId);
        }
        storage.deleteSharedLink(link.id);
      });
      alert('History cleared successfully');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your Pri-Share experience</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Default Print Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Print Mode
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSettings({ ...settings, defaultPrintMode: 'bw' })}
                  className={`
                    flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all
                    ${settings.defaultPrintMode === 'bw'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }
                  `}
                >
                  Black & White
                </button>
                <button
                  onClick={() => setSettings({ ...settings, defaultPrintMode: 'color' })}
                  className={`
                    flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all
                    ${settings.defaultPrintMode === 'color'
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
                Default Number of Copies
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.defaultCopies}
                onChange={(e) => setSettings({ ...settings, defaultCopies: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Expiry Time
              </label>
              <select
                value={settings.defaultExpiryHours}
                onChange={(e) => setSettings({ ...settings, defaultExpiryHours: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={24}>24 hours</option>
                <option value={72}>3 days</option>
                <option value={168}>1 week</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Watermark Text
              </label>
              <input
                type="text"
                value={settings.defaultWatermark || ''}
                onChange={(e) => setSettings({ ...settings, defaultWatermark: e.target.value })}
                placeholder="e.g., CONFIDENTIAL"
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Email
            </label>
            <input
              type="email"
              value={settings.notificationEmail || ''}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Receive notifications when your shared documents are accessed or printed
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setSettings({ ...settings, theme: 'light' })}
                className={`
                  flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center space-x-2
                  ${settings.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                <Sun className="h-5 w-5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                className={`
                  flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center space-x-2
                  ${settings.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                <Moon className="h-5 w-5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>

          <button
            onClick={handleClearHistory}
            className="w-full px-6 py-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center space-x-2 font-medium"
          >
            <Trash2 className="h-5 w-5" />
            <span>Clear All History</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This will permanently delete all your shared links and documents
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`
            w-full py-4 rounded-xl font-semibold text-white
            transition-all duration-200 flex items-center justify-center space-x-2
            ${saved
              ? 'bg-green-600'
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          <Save className="h-5 w-5" />
          <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
}
