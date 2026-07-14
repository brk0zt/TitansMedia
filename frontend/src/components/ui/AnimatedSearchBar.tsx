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
  const [focused, setFocused] = React.useState(false);

  return (
    <div className={"relative flex items-center justify-center w-full max-w-md " + className}
      style={{
        filter: `drop-shadow(0 0 ${focused ? '20px' : '12px'} rgba(124, 92, 255, ${focused ? '0.4' : '0.15'})) drop-shadow(0 0 ${focused ? '40px' : '20px'} rgba(255, 68, 224, ${focused ? '0.3' : '0.1'}))`,
        transition: 'filter 0.4s ease',
      }}
    >
      <div className="relative flex items-center w-full bg-[#09090B] rounded-xl border border-white/[0.08] transition-all duration-300"
        style={{
          boxShadow: focused
            ? '0 0 15px rgba(124, 92, 255, 0.2), 0 0 30px rgba(255, 68, 224, 0.15), inset 0 0 15px rgba(124, 92, 255, 0.05)'
            : '0 0 0px transparent',
          transition: 'box-shadow 0.4s ease, border-color 0.3s ease',
          borderColor: focused ? 'rgba(124, 92, 255, 0.3)' : 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="pl-5">
          <Search className="w-5 h-5 text-white/30" strokeWidth={1.5} />
        </div>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          type="text"
          className="flex-1 bg-transparent w-full h-[52px] px-4 text-white text-base focus:outline-none placeholder-white/25"
        />
        {onFilterClick && (
          <button
            onClick={onFilterClick}
            className="mr-2 flex items-center justify-center h-[38px] w-[38px] rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors relative overflow-hidden"
          >
            <SlidersHorizontal className="w-[17px] h-[17px] text-white/40" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimatedSearchBar;
