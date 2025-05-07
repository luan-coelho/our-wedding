'use client'

import { useState } from 'react'

interface CopyToClipboardProps {
  text: string
}

export function CopyToClipboard({ text }: CopyToClipboardProps) {
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

  return (
    <button onClick={copyToClipboard} className="ml-2 p-1 text-blue-600 hover:text-blue-800">
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  )
}
