import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  className?: string;
}

const AnimatedSearchBar: React.FC<Props> = ({ value, onChange, placeholder = 'Search...', onFilterClick, className = '' }) => {
  return (
    <div className={"relative flex items-center justify-center w-full max-w-md " + className}>
      <div className="relative w-full group">
        <div className="absolute -inset-[2px] rounded-[14px] overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, #000000, #7c5cff, #ff44e0, #7c5cff, #000000)' }}></div>
        </div>
        <div className="absolute -inset-[1px] rounded-[13px] bg-[#09090B]"></div>
        <div className="relative flex items-center w-full bg-[#09090B] rounded-xl border border-white/[0.06] transition-colors duration-300 group-hover:border-white/[0.12]">
          <div className="pl-5">
            <Search className="w-5 h-5 text-white/30" strokeWidth={1.5} />
          </div>
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            type="text"
            className="flex-1 bg-transparent w-full h-[52px] px-4 text-white text-base focus:outline-none placeholder-white/25"
          />
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="mr-2 flex items-center justify-center h-[38px] w-[38px] rounded-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, #000000, #7c5cff, #ff44e0, #7c5cff, #000000)' }}></div>
              <div className="absolute inset-[1px] rounded-lg bg-[#09090B]"></div>
              <SlidersHorizontal className="w-[17px] h-[17px] text-white/50 relative z-[1]" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedSearchBar;
