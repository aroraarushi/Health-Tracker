import React from "react";
import { Download, Sun, Moon } from 'lucide-react';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({ 
  onExport, 
  switchMode, 
  darkMode, 
  selectedPeriod, 
  setSelectedPeriod 
}) => {
  return (
    <header className={`sticky top-0 z-50 w-full border-b ${darkMode ? 'bg-black' : 'bg-white'} py-2`}>
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 gap-2 sm:gap-0">
        <span className={`${darkMode ? 'text-darkprimary' : 'text-primary'} text-2xl sm:text-3xl font-bold tracking-tight ml-1 sm:ml-5`}>
          HealthTrack
        </span>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none font-bold py-2 pl-3 pr-8 border-primary text-primary rounded bg-bg border border-primary cursor-pointer"
              style={{
                backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235B5FC7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundPosition: "right 8px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px 16px"
              }}
            >
              <option value="all">All</option>
              <option value="morning">Morning (5 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 9 PM)</option>
              <option value="night">Night (9 PM - 5 AM)</option>
            </select>
          </div>

          <button 
            onClick={onExport}
            className="p-2 px-2 border-primary text-primary rounded flex items-center bg-bg flex-row border border-primary"
          >
            <Download className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-primary text-sm sm:text-md font-bold ml-1">Export CSV</span>
          </button>

          <button
            onClick={switchMode}
            className={`h-10 w-10 mr-6 ${darkMode ? 'bg-bg' : 'bg-primary/10'}  rounded flex items-center justify-center cursor-pointer`}
          >
            <div
              className={`transition-transform duration-500 ${
                darkMode ? "rotate-180" : "rotate-0"
              }`}
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-primary rotate-9 transition-all" />
              ) : (
                <Moon className="h-6 w-6 text-primary rotate-9 transition-all" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
