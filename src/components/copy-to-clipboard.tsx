'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyToClipboardProps {
  text: string
  label?: string
  variant?: 'default' | 'minimal' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function CopyToClipboard({ text, label = 'Copiar', variant = 'default', size = 'md' }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Falha ao copiar texto:', err)
    }
  }

  const baseClasses =
    'inline-flex items-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const variantClasses = {
    default: copied
      ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
      : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200',
    minimal: copied
      ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    outline: copied
      ? 'border-2 border-green-500 text-green-700 hover:bg-green-50'
      : 'border-2 border-blue-500 text-blue-700 hover:bg-blue-50',
  }

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 18,
  }

  return (
    <button
      onClick={copyToClipboard}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} rounded-md`}
      title={copied ? 'Texto copiado!' : `Copiar: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`}>
      {copied ? (
        <>
          <Check size={iconSize[size]} />
          Copiado!
        </>
      ) : (
        <>
          <Copy size={iconSize[size]} />
          {label}
        </>
      )}
    </button>
  )
}
