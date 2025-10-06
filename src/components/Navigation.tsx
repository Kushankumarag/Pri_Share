import { Link, useLocation } from 'react-router-dom';
import { Upload, FileText, Settings } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Upload', icon: Upload },
    { path: '/links', label: 'My Links', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 md:static md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:space-x-8">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2
                py-3 px-4 transition-colors duration-200 relative
                ${isActive(path)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
                }
              `}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs md:text-base font-medium">{label}</span>
              {isActive(path) && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 md:top-0 md:bottom-auto md:h-auto md:left-0 md:right-auto md:w-1 md:h-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
