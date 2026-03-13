'use client';

import { ProductCategory } from '@/types';

// Category gradient backgrounds
const categoryGradients: Record<ProductCategory, string> = {
  cleanser: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  moisturizer: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
  serum: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  sunscreen: 'linear-gradient(135deg, #fef9c3, #fef08a)',
  toner: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
  exfoliant: 'linear-gradient(135deg, #ffedd5, #fed7aa)',
  mask: 'linear-gradient(135deg, #ccfbf1, #99f6e4)',
  eye_cream: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
  oil: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  treatment: 'linear-gradient(135deg, #fee2e2, #fecaca)',
};

// Category accent colors (for brand name text)
export const categoryAccentColors: Record<ProductCategory, string> = {
  cleanser: '#2563eb',
  moisturizer: '#16a34a',
  serum: '#7c3aed',
  sunscreen: '#ca8a04',
  toner: '#db2777',
  exfoliant: '#ea580c',
  mask: '#0d9488',
  eye_cream: '#9333ea',
  oil: '#b45309',
  treatment: '#dc2626',
};

// CSS-only bottle shapes for each category
function CleanserShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Pump neck */}
      <div
        style={{
          width: '6px',
          height: '16px',
          backgroundColor: '#94a3b8',
          borderRadius: '2px 2px 0 0',
        }}
      />
      {/* Cap disc */}
      <div
        style={{
          width: '20px',
          height: '6px',
          backgroundColor: '#64748b',
          borderRadius: '3px',
          marginTop: '-2px',
        }}
      />
      {/* Body */}
      <div
        style={{
          width: '32px',
          height: '56px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '6px 6px 8px 8px',
          boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function SerumShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Bulb/dropper */}
      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: '#a78bfa',
          borderRadius: '50%',
        }}
      />
      {/* Dropper tip */}
      <div
        style={{
          width: '4px',
          height: '8px',
          backgroundColor: '#64748b',
          marginTop: '-2px',
        }}
      />
      {/* Body */}
      <div
        style={{
          width: '24px',
          height: '64px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '4px 4px 6px 6px',
          boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function MoisturizerShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Lid */}
      <div
        style={{
          width: '52px',
          height: '8px',
          backgroundColor: '#64748b',
          borderRadius: '4px 4px 0 0',
        }}
      />
      {/* Body (jar) */}
      <div
        style={{
          width: '48px',
          height: '32px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '0 0 8px 8px',
          boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function SunscreenShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Crimped tip */}
      <div
        style={{
          width: '12px',
          height: '8px',
          backgroundColor: '#64748b',
          borderRadius: '3px 3px 0 0',
        }}
      />
      {/* Body (tube) */}
      <div
        style={{
          width: '28px',
          height: '48px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '4px 4px 14px 14px',
          boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function TonerShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Spray nozzle */}
      <div className="relative">
        <div
          style={{
            width: '8px',
            height: '12px',
            backgroundColor: '#64748b',
            borderRadius: '2px',
          }}
        />
        {/* Trigger arm */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            right: '-10px',
            width: '12px',
            height: '8px',
            backgroundColor: '#94a3b8',
            borderRadius: '0 4px 4px 0',
          }}
        />
      </div>
      {/* Body */}
      <div
        style={{
          width: '28px',
          height: '52px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '4px',
          boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function MaskShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Lid (flat) */}
      <div
        style={{
          width: '48px',
          height: '6px',
          backgroundColor: '#64748b',
          borderRadius: '3px 3px 0 0',
        }}
      />
      {/* Round pot body */}
      <div
        style={{
          width: '48px',
          height: '32px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '0 0 24px 24px',
          boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function EyeCreamShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Pointed cap */}
      <div
        style={{
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '12px solid #64748b',
        }}
      />
      {/* Slim vial body */}
      <div
        style={{
          width: '16px',
          height: '56px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '2px 2px 8px 8px',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function OilShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Small neck */}
      <div
        style={{
          width: '10px',
          height: '8px',
          backgroundColor: '#64748b',
          borderRadius: '2px 2px 0 0',
        }}
      />
      {/* Teardrop body */}
      <div
        style={{
          width: '32px',
          height: '48px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
}

function ExfoliantShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Crimped tip */}
      <div
        style={{
          width: '12px',
          height: '8px',
          backgroundColor: '#64748b',
          borderRadius: '3px 3px 0 0',
        }}
      />
      {/* Body (tube with stripe) */}
      <div
        style={{
          width: '28px',
          height: '48px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '4px 4px 14px 14px',
          boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Colored stripe */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '100%',
            backgroundColor: '#ea580c',
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}

function TreatmentShape() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Clinical box with sharp corners */}
      <div
        style={{
          width: '40px',
          height: '48px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '2px',
          boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Cross symbol */}
        <div
          style={{
            position: 'relative',
            width: '16px',
            height: '16px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              width: '100%',
              height: '4px',
              backgroundColor: '#dc2626',
              transform: 'translateY(-50%)',
              borderRadius: '1px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              width: '4px',
              height: '100%',
              backgroundColor: '#dc2626',
              transform: 'translateX(-50%)',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

const categoryShapes: Record<ProductCategory, React.FC> = {
  cleanser: CleanserShape,
  serum: SerumShape,
  moisturizer: MoisturizerShape,
  sunscreen: SunscreenShape,
  toner: TonerShape,
  mask: MaskShape,
  eye_cream: EyeCreamShape,
  oil: OilShape,
  exfoliant: ExfoliantShape,
  treatment: TreatmentShape,
};

interface ProductIllustrationProps {
  category: ProductCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProductIllustration({
  category,
  size = 'md',
  className = '',
}: ProductIllustrationProps) {
  const ShapeComponent = categoryShapes[category] || categoryShapes.cleanser;
  const gradient = categoryGradients[category] || categoryGradients.cleanser;

  const sizeClasses = {
    sm: 'h-16 w-full',
    md: 'h-24 w-full',
    lg: 'h-36 w-full',
  };

  const scaleClasses = {
    sm: 'scale-50',
    md: 'scale-75',
    lg: 'scale-100',
  };

  return (
    <div
      className={`relative rounded-xl flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}
      style={{ background: gradient }}
    >
      {/* Shape */}
      <div className={`${scaleClasses[size]}`}>
        <ShapeComponent />
      </div>

      {/* Glass sheen overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// Frosted glass category pill badge
export function CategoryPill({ category }: { category: ProductCategory }) {
  return (
    <span
      style={{
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '20px',
        padding: '2px 8px',
        position: 'absolute',
        top: '8px',
        left: '8px',
        textTransform: 'uppercase',
        color: '#475569',
      }}
    >
      {category.replace('_', ' ')}
    </span>
  );
}
