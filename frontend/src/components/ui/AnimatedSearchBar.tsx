import React, { useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  className?: string;
}

const AnimatedSearchBar: React.FC<Props> = ({ value, onChange, placeholder = 'Search...', onFilterClick, className = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={"relative flex items-center justify-start " + className}>
      <div className="relative group cursor-text" onClick={() => inputRef.current?.focus()}>
        <div className="relative p-[4px] rounded-xl overflow-hidden">
          <div className="absolute inset-0 rounded-xl opacity-[0.56] blur-[3px] pointer-events-none
                          bg-[conic-gradient(from_0deg,#e11d48,#6b7280,#e11d48,#6b7280,#e11d48)]
                          animate-[spin_8s_linear_infinite]
                          group-hover:animate-[spin_4s_linear_infinite]
                          group-focus-within:animate-[spin_2s_linear_infinite]" />
          <div className="absolute inset-0 rounded-xl opacity-[0.48] blur-[2px] pointer-events-none
                          bg-[conic-gradient(from_90deg,#be123c,#4b5563,#be123c,#4b5563,#be123c)]
                          animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-0 rounded-xl opacity-[0.40] blur-[1px] pointer-events-none
                          bg-[conic-gradient(from_180deg,#f87171,#d1d5db,#f87171,#d1d5db,#f87171)]
                          animate-[spin_6s_linear_infinite]" />
          <div className="relative bg-[#09090B] rounded-lg">
            <input
              ref={inputRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              type="text"
              name="text"
              className="w-[400px] h-[48px] bg-transparent text-white pl-[42px] pr-[50px] text-base focus:outline-none placeholder-gray-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="20" fill="none">
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
                          before:brightness-135 before:animate-[spin_8s_linear_infinite]"
            >
              <div className="flex items-center justify-center z-[2] h-full w-full [isolation:isolate] overflow-hidden rounded-lg bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] border border-transparent">
                <svg preserveAspectRatio="none" height="22" width="22" viewBox="4.8 4.56 14.832 15.408" fill="none">
                  <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" strokeWidth="1" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSearchBar;
