import React from 'react';

/**
 * Auspicious Orange-Yellow Marigold (Genda Phool) with layered petals & gold center
 */
export const MarigoldFlower = ({ size = 28, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={`inline-block shrink-0 ${className}`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="marigoldGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="85%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </radialGradient>
      <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="40%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
    </defs>
    {/* Outer Petals */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <ellipse
        key={`out-${i}`}
        cx="50"
        cy="20"
        rx="12"
        ry="20"
        fill="url(#marigoldGrad)"
        transform={`rotate(${deg} 50 50)`}
        opacity="0.95"
      />
    ))}
    {/* Inner Petals */}
    {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
      <ellipse
        key={`in-${i}`}
        cx="50"
        cy="30"
        rx="9"
        ry="15"
        fill="url(#marigoldGrad)"
        transform={`rotate(${deg} 50 50)`}
      />
    ))}
    {/* Central Flower Core */}
    <circle cx="50" cy="50" r="14" fill="url(#centerGrad)" stroke="#C9A227" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="6" fill="#D97706" />
  </svg>
);

/**
 * Mango Plant Leaf (Aam Ka Patta) - Lush emerald green with delicate gold vein
 */
export const MangoLeaf = ({ width = 36, height = 18, rotate = 0, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 45"
    className={`inline-block shrink-0 ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mangoLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="50%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
    </defs>
    <path
      d="M2 22.5 C 25 5, 75 8, 98 22.5 C 75 37, 25 40, 2 22.5 Z"
      fill="url(#mangoLeafGrad)"
      stroke="#C9A227"
      strokeWidth="1"
    />
    <path
      d="M2 22.5 Q 50 21 96 22.5"
      stroke="#86EFAC"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path d="M 30 17 L 38 22 M 50 14 L 58 22 M 70 16 L 78 22.5" stroke="#BBF7D0" strokeWidth="0.8" opacity="0.6" />
    <path d="M 30 28 L 38 23 M 50 31 L 58 23 M 70 29 L 78 22.5" stroke="#BBF7D0" strokeWidth="0.8" opacity="0.6" />
  </svg>
);

/**
 * Traditional Royal Hanging Toran Garland (Mango Leaves + Marigold Flowers on Gold Thread)
 */
export const ToranGarland = ({ className = "" }) => {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center py-1 select-none pointer-events-none ${className}`}>
      <div className="flex items-center gap-1 sm:gap-3 opacity-90">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="transform rotate-90 -mr-2 sm:-mr-1">
              <MangoLeaf width={26} height={13} />
            </div>
            <MarigoldFlower size={20} className="shadow-sm z-10" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mx-0.5 sm:mx-1 shadow-sm"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Royal Flower & Mango Leaf Section Divider
 */
export const FlowerDivider = ({ text = "", className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 py-3 ${className}`}>
      <div className="flex items-center gap-1">
        <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#C9A227] to-[#D97706]"></div>
        <MangoLeaf width={28} height={13} rotate={-15} />
      </div>

      <div className="flex items-center gap-2">
        <MarigoldFlower size={24} />
        {text && (
          <span className="font-serif text-xs sm:text-sm font-black uppercase tracking-widest text-[#B45309]">
            {text}
          </span>
        )}
        <MarigoldFlower size={24} />
      </div>

      <div className="flex items-center gap-1">
        <MangoLeaf width={28} height={13} rotate={195} />
        <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#C9A227] to-[#D97706]"></div>
      </div>
    </div>
  );
};

/**
 * Celebratory Occasion Design Stickers (Birthday, Wedding, Retirement visual badges)
 */
export const CelebratorySticker = ({ type = "wedding", className = "" }) => {
  if (type === "birthday") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF3D6] to-[#FFF8E7] border border-[#D97706]/40 text-[#B45309] text-[11px] font-black shadow-sm ${className}`}>
        <span>??</span>
        <span>Birthday Special</span>
        <MarigoldFlower size={12} />
      </div>
    );
  }
  if (type === "retirement") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#F0FDF4] to-[#FFF8E7] border border-[#166534]/40 text-[#166534] text-[11px] font-black shadow-sm ${className}`}>
        <span>???</span>
        <span>Retirement & Honor</span>
        <MangoLeaf width={16} height={8} />
      </div>
    );
  }
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF3D6] to-[#FFF8E7] border border-[#C9A227]/50 text-[#D97706] text-[11px] font-black shadow-sm ${className}`}>
      <span>??</span>
      <span>Royal Wedding</span>
      <MarigoldFlower size={12} />
    </div>
  );
};
