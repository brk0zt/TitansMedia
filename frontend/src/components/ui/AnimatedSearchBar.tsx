import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  className?: string;
}

const AnimatedSearchBar: React.FC<Props> = ({ value, onChange, placeholder = 'Search...', onFilterClick, className = '' }) => {
  return (
    <div className={"relative flex items-center justify-center " + className}>
      <div id="poda" className="relative flex items-center justify-center group">
        <div className="absolute z-[1] overflow-hidden -inset-[4px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                        before:bg-[conic-gradient(#000,#e11d48_5%,#000_38%,#000_50%,#6b7280_60%,#000_87%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[1] overflow-hidden -inset-[3px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#be123c,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#4b5563,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[1] overflow-hidden -inset-[3px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#be123c,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#4b5563,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[1] overflow-hidden -inset-[3px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#be123c,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#4b5563,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[1] overflow-hidden -inset-[2px] rounded-lg blur-[2px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#f87171,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#d1d5db,rgba(0,0,0,0)_58%)] before:brightness-140
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[1] overflow-hidden -inset-[1px] rounded-xl blur-[0.5px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70
                        before:bg-[conic-gradient(#1c191c,#e11d48_5%,#1c191c_14%,#1c191c_50%,#6b7280_60%,#1c191c_64%)] before:brightness-130
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div id="main" className="relative group">
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            type="text"
            name="text"
            className="bg-[#09090B] border border-white/[0.06] w-[400px] h-[48px] rounded-lg text-white pl-[42px] pr-[50px] text-base focus:outline-none placeholder-gray-500 focus:border-white/[0.12] transition-colors"
          />
          <div id="search-icon" className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="20" fill="none" className="feather feather-search">
              <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
              <line stroke="url(#searchl)" y2="16.65" y1="22" x2="16.65" x1="22"></line>
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search">
                  <stop stopColor="#f8e7f8" offset="0%"></stop>
                  <stop stopColor="#b6a9b7" offset="50%"></stop>
                </linearGradient>
                <linearGradient id="searchl">
                  <stop stopColor="#b6a9b7" offset="0%"></stop>
                  <stop stopColor="#837484" offset="50%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <button
            onClick={onFilterClick}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-[36px] w-[36px] overflow-hidden rounded-lg
                        before:absolute before:content-[''] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-90
                        before:bg-[conic-gradient(rgba(0,0,0,0),#e11d48,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_50%,#6b7280,rgba(0,0,0,0)_100%)]
                        before:brightness-135 before:animate-spin-slow"
          >
            <div id="filter-icon" className="flex items-center justify-center z-[2] h-full w-full [isolation:isolate] overflow-hidden rounded-lg bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] border border-transparent">
              <svg preserveAspectRatio="none" height="22" width="22" viewBox="4.8 4.56 14.832 15.408" fill="none">
                <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" strokeWidth="1" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSearchBar;
