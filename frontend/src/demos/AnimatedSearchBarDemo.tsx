import React from 'react';
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar';

const AnimatedSearchBarDemo: React.FC = () => {
  const [search, setSearch] = React.useState('');

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto">
        <AnimatedSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search anything..."
          onFilterClick={() => alert('Filter clicked!')}
        />
        {search && (
          <p className="text-white/40 text-sm text-center mt-4">
            Searching for: <span className="text-white/80">{search}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AnimatedSearchBarDemo;
