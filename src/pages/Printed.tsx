import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Printed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Printed</h2>
          <p className="text-gray-600 mb-6">
            The document has been printed successfully and has been removed for security purposes.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
