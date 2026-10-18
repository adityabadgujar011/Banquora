import React from 'react';

/**
 * Banquora Official Brand Logo Component
 * Featuring the crowned royal 'B' emblem with banquet hall curtains & chandelier
 */
export const BanquoraLogo = ({
  variant = 'horizontal', // 'horizontal' | 'icon' | 'badge' | 'stacked' | 'full'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle = true,
  className = '',
  onClick
}) => {
  // Size presets for icon
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  // Size presets for stacked full logo
  const fullSizes = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32'
  };

  // Text sizing for horizontal layout
  const textSizes = {
    sm: { title: 'text-lg', sub: 'text-[9px]' },
    md: { title: 'text-2xl', sub: 'text-[10px]' },
    lg: { title: 'text-3xl', sub: 'text-xs' },
    xl: { title: 'text-4xl', sub: 'text-sm' }
  };

  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick}
        className={`relative inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img 
          src="/images/banquora-crest-gold-transparent.png" 
          alt="Banquora Royal Crest" 
          className={`${iconSizes[size] || iconSizes.md} object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-sm`}
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div 
        onClick={onClick}
        className={`relative inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img 
          src="/images/banquora-badge-circle.png" 
          alt="Banquora Official Seal" 
          className={`${iconSizes[size] || iconSizes.md} object-contain rounded-full shadow-md transition-transform duration-300 hover:scale-105`}
        />
      </div>
    );
  }

  if (variant === 'stacked' || variant === 'full') {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img 
          src="/images/banquora-logo-full.png" 
          alt="Banquora — Luxury Hospitality & Estates" 
          className={`${fullSizes[size] || fullSizes.md} w-auto object-contain transition-transform duration-300 hover:scale-102 filter drop-shadow`}
        />
      </div>
    );
  }

  // Default: 'horizontal'
  const currentText = textSizes[size] || textSizes.md;
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3.5 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Opulent midnight navy badge frame with gold border for the crowned emblem */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 shadow-md shadow-slate-950/20 flex items-center justify-center p-1.5 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:shadow-[#D4AF37]/20 group-hover:scale-105">
          <img 
            src="/images/banquora-crest-gold-transparent.png" 
            alt="Banquora Royal Emblem" 
            className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>
      
      <div className="flex flex-col justify-center">
        <span className={`font-serif ${currentText.title} font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors leading-none flex items-center gap-1.5`}>
          <span>BANQUORA</span>
        </span>
        {showSubtitle && (
          <span className={`${currentText.sub} font-semibold uppercase tracking-[0.24em] text-[#C59A27] mt-1.5 flex items-center gap-1`}>
            <span>LUXURY HOSPITALITY</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default BanquoraLogo;
