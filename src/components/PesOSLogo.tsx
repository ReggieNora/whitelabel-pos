import React from 'react';
import { brandConfig } from '../config/brandConfig';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  taglineClassName?: string;
  imageHeightClass?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = false,
  taglineClassName = '',
  imageHeightClass = 'h-8 md:h-9',
}) => {
  const name = brandConfig.appName || 'AuraPOS';
  // Highlight first part in bright accent, trailing part (e.g. POS) in primary
  const splitIndex = name.toLowerCase().endsWith('pos') && name.length > 3
    ? name.length - 3
    : Math.ceil(name.length / 2);
  const prefix = name.slice(0, splitIndex);
  const suffix = name.slice(splitIndex);

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek Modern Gradient Icon */}
      <div className="relative flex items-center shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#006AFF] to-[#00F2FE] flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-slate-900 dark:text-white">
          <span className="text-[#006AFF] dark:text-[#38BDF8]">{prefix}</span>
          <span>{suffix}</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-bold tracking-wider text-muted uppercase mt-0.5 ${taglineClassName}`}
          >
            {brandConfig.tagline}
          </span>
        )}
      </div>
    </div>
  );
};

export const PesOSLogo = BrandLogo;
export default BrandLogo;
