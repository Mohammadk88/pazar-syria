'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'gradient'
  showText?: boolean
}

export function Logo({ className, size = 'md', variant = 'default', showText = true }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg', sub: 'text-xs' },
    md: { container: 'w-10 h-10', text: 'text-xl', sub: 'text-xs' },
    lg: { container: 'w-12 h-12', text: 'text-2xl', sub: 'text-sm' },
    xl: { container: 'w-16 h-16', text: 'text-3xl', sub: 'text-base' }
  }

  const variants = {
    default: 'text-gray-900',
    white: 'text-white',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Modern geometric logo */}
      <div className="relative group">
        {/* Main logo background */}
        <div className={cn(
          'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-lg rotate-3 transform group-hover:rotate-6 transition-all duration-300',
          sizes[size].container
        )}></div>
        
        {/* Secondary overlay */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-tr from-orange-400 to-red-500 rounded-2xl shadow-lg -rotate-3 transform group-hover:-rotate-6 transition-all duration-300 opacity-80',
          sizes[size].container
        )}></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ب
            </span>
          </div>
        </div>
      </div>
      
      {/* Logo text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            'font-bold leading-tight tracking-tight',
            sizes[size].text,
            variants[variant]
          )}>
            بازار سوريا
          </span>
          <span className={cn(
            'text-gray-500 font-medium -mt-1',
            sizes[size].sub
          )}>
            PazarSY
          </span>
        </div>
      )}
    </div>
  )
}
