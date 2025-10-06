import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Upload } from './pages/Upload';
import { Links } from './pages/Links';
import { Settings } from './pages/Settings';
import { Success } from './pages/Success';
import { Viewer } from './pages/Viewer';
import { Printed } from './pages/Printed';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pri-Share</h1>
                <p className="text-xs text-gray-500">Secure Print Sharing</p>
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<><Navigation /><Upload /></>} />
          <Route path="/links" element={<><Navigation /><Links /></>} />
          <Route path="/settings" element={<><Navigation /><Settings /></>} />
          <Route path="/success/:linkId" element={<Success />} />
          <Route path="/view/:linkId" element={<Viewer />} />
          <Route path="/printed" element={<Printed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
