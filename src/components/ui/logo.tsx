'use client'

import { useLanguage } from "@/hooks/useLanguage"

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'dark'
  showText?: boolean
  className?: string
}

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  showText = true,
  className = '' 
}: LogoProps) {
  const { getDirection } = useLanguage()
  const isRTL = getDirection() === 'rtl'

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  const colorClasses = {
    default: {
      icon: 'text-sky-600',
      text: 'text-gray-900'
    },
    white: {
      icon: 'text-white',
      text: 'text-white'
    },
    dark: {
      icon: 'text-sky-600',
      text: 'text-gray-900'
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} ${colorClasses[variant].icon} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="currentColor"
          className="w-full h-full"
        >
          {/* Outer circle with gradient effect */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.3"
          />
          
          {/* Main building/market icon */}
          <path
            d="M20 75 L20 40 L35 25 L50 15 L65 25 L80 40 L80 75 Z"
            fill="currentColor"
            opacity="0.8"
          />
          
          {/* Building details */}
          <rect x="25" y="45" width="8" height="8" fill="white" opacity="0.9" />
          <rect x="38" y="45" width="8" height="8" fill="white" opacity="0.9" />
          <rect x="54" y="45" width="8" height="8" fill="white" opacity="0.9" />
          <rect x="67" y="45" width="8" height="8" fill="white" opacity="0.9" />
          
          <rect x="25" y="58" width="8" height="8" fill="white" opacity="0.9" />
          <rect x="38" y="58" width="8" height="8" fill="white" opacity="0.9" />
          <rect x="54" y="58" width="8" height="8" fill="white" opacity="0.9" />
          <rect x="67" y="58" width="8" height="8" fill="white" opacity="0.9" />
          
          {/* Door */}
          <rect x="44" y="63" width="12" height="12" fill="white" opacity="0.9" />
          
          {/* Decorative elements */}
          <circle cx="30" cy="35" r="2" fill="currentColor" opacity="0.6" />
          <circle cx="50" cy="30" r="2" fill="currentColor" opacity="0.6" />
          <circle cx="70" cy="35" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
          <span className={`${textSizeClasses[size]} font-bold ${colorClasses[variant].text} leading-tight`}>
            بازار سوريا
          </span>
          <span className={`text-xs ${colorClasses[variant].text} opacity-70 leading-tight`}>
            PazarSY
          </span>
        </div>
      )}
    </div>
  )
}
