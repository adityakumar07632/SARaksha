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
  // Dimension mappings based on variant and size
  const getDimensions = () => {
    switch (variant) {
      case 'icon':
        switch (size) {
          case 'xs':
            return 'h-6 w-6';
          case 'sm':
            return 'h-8 w-8';
          case 'md':
            return 'h-10 w-10';
          case 'lg':
            return 'h-14 w-14';
          case 'xl':
            return 'h-20 w-20';
          default:
            return 'h-10 w-10';
        }
      case 'compact':
        switch (size) {
          case 'xs':
            return 'h-7 max-w-[140px]';
          case 'sm':
            return 'h-9 max-w-[170px]';
          case 'md':
            return 'h-11 max-w-[210px]';
          case 'lg':
            return 'h-14 max-w-[280px]';
          case 'xl':
            return 'h-20 max-w-[380px]';
          default:
            return 'h-11 max-w-[210px]';
        }
      case 'full':
      default:
        switch (size) {
          case 'xs':
            return 'max-w-[220px]';
          case 'sm':
            return 'max-w-[300px]';
          case 'md':
            return 'max-w-[400px]';
          case 'lg':
            return 'max-w-[500px]';
          case 'xl':
            return 'max-w-[620px]';
          default:
            return 'max-w-[400px]';
        }
    }
  };

  const dimClasses = getDimensions();

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}>
        <img
          src="/assets/branding/saraksha-logo-icon.png"
          alt="SARaksha Shield Emblem"
          className={`${dimClasses} object-contain filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.35)]`}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center select-none shrink-0 ${className}`}>
        <img
          src="/assets/branding/saraksha-logo-compact.png"
          alt="SARaksha Logo"
          className={`${dimClasses} object-contain filter drop-shadow-[0_2px_12px_rgba(6,182,212,0.25)]`}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  // Full Logo Variant
  return (
    <div className={`inline-flex flex-col items-center select-none w-full ${className}`}>
      <img
        src="/assets/branding/saraksha-logo-full.png"
        alt="SARaksha — Smart Watershed Monitoring System"
        className={`w-full ${dimClasses} object-contain filter drop-shadow-[0_4px_24px_rgba(6,182,212,0.35)] mx-auto`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};
