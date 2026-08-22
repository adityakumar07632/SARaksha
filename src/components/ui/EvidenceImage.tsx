import React, { useState } from 'react';
import { Camera, ImageOff, ShieldCheck } from 'lucide-react';

interface EvidenceImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  showProvenanceBadge?: boolean;
  provenanceLabel?: string;
  coordinates?: [number, number];
  structureCode?: string;
}

export const EvidenceImage: React.FC<EvidenceImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative aspect-video bg-slate-950 overflow-hidden',
  showProvenanceBadge = true,
  provenanceLabel = 'DEMO FIELD EVIDENCE',
  coordinates,
  structureCode,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={containerClassName}>
      {!hasError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            {...props}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 animate-pulse">
              <Camera className="h-8 w-8 text-slate-700" />
            </div>
          )}
        </>
      ) : (
        /* Professional GIS Evidence Fallback Placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-center border border-slate-800">
          <div className="p-3 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 mb-2 shadow-inner">
            <ImageOff className="h-6 w-6" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200">
            {structureCode ? `${structureCode} Field Record` : 'Field Evidence Photograph'}
          </span>
          <span className="text-[10px] font-mono text-amber-400/90 mt-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            🟡 {provenanceLabel}
          </span>
          {coordinates && (
            <span className="text-[10px] font-mono text-slate-500 mt-1">
              📍 {coordinates[0].toFixed(4)}° N, {coordinates[1].toFixed(4)}° E
            </span>
          )}
        </div>
      )}

      {/* Persistent Provenance Badge */}
      {showProvenanceBadge && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/85 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold shadow-lg backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            {provenanceLabel}
          </span>
        </div>
      )}
    </div>
  );
};
