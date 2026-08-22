import React from 'react';

export type LogoVariant = 'full' | 'compact' | 'icon';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface SARakshaLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showSubtitle?: boolean;
  priority?: boolean;
}

export const SARakshaLogo: React.FC<SARakshaLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle = true,
  priority = false,
}) => {
  if (variant === 'icon') {
    const iconDim =
      size === 'xs'
        ? 'h-5 w-5'
        : size === 'sm'
        ? 'h-8 w-8'
        : size === 'md'
        ? 'h-10 w-10'
        : size === 'lg'
        ? 'h-14 w-14'
        : 'h-20 w-20';

    return (
      <div className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}>
        <img
          src="/assets/branding/saraksha-logo-icon.png"
          alt="SARaksha Emblem"
          className={`${iconDim} object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.35)]`}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  if (variant === 'compact') {
    const iconSizeClass =
      size === 'xs'
        ? 'h-7 w-7'
        : size === 'sm'
        ? 'h-8 w-8 sm:h-9 sm:w-9'
        : size === 'lg'
        ? 'h-11 w-11'
        : size === 'xl'
        ? 'h-14 w-14'
        : 'h-9 w-9 sm:h-10 sm:w-10';

    const titleSizeClass =
      size === 'xs'
        ? 'text-xs'
        : size === 'sm'
        ? 'text-sm sm:text-base'
        : size === 'lg'
        ? 'text-lg sm:text-xl'
        : 'text-base sm:text-lg';

    return (
      <div className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}>
        <img
          src="/assets/branding/saraksha-logo-icon.png"
          alt="SARaksha Emblem"
          className={`${iconSizeClass} object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.35)] shrink-0`}
          loading={priority ? 'eager' : 'lazy'}
        />
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${titleSizeClass} font-black tracking-tight text-white font-mono`}>
              SARaksha
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans tracking-tight mt-0.5 hidden sm:block truncate">
              Smart Watershed Monitoring System
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Logo Variant (For Login screen & Splash)
  const fullMaxDim =
    size === 'xs'
      ? 'max-w-[220px]'
      : size === 'sm'
      ? 'max-w-[300px]'
      : size === 'lg'
      ? 'max-w-[500px]'
      : size === 'xl'
      ? 'max-w-[620px]'
      : 'max-w-[400px]';

  return (
    <div className={`inline-flex flex-col items-center select-none w-full ${className}`}>
      <img
        src="/assets/branding/saraksha-logo-full.png"
        alt="SARaksha — Smart Watershed Monitoring System"
        className={`w-full ${fullMaxDim} object-contain filter drop-shadow-[0_4px_24px_rgba(6,182,212,0.35)] mx-auto`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};
