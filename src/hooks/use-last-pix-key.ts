'use client'

import { useEffect, useState } from 'react'

const LAST_PIX_KEY_STORAGE_KEY = 'lastUsedPixKey'

export interface LastPixKeyData {
  pixKey?: string
  selectedPixKeyId?: string | null
}

export function useLastPixKey() {
  const [lastPixKey, setLastPixKey] = useState<LastPixKeyData>({})

  // Carregar dados do localStorage quando o componente monta
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LAST_PIX_KEY_STORAGE_KEY)
        if (stored) {
          const parsedData = JSON.parse(stored) as LastPixKeyData
          setLastPixKey(parsedData)
        }
      } catch (error) {
        console.warn('Erro ao carregar última chave PIX do localStorage:', error)
      }
    }
  }, [])

  // Função para salvar a última chave PIX utilizada
  const saveLastPixKey = (data: LastPixKeyData) => {
    try {
      localStorage.setItem(LAST_PIX_KEY_STORAGE_KEY, JSON.stringify(data))
      setLastPixKey(data)
    } catch (error) {
      console.warn('Erro ao salvar última chave PIX no localStorage:', error)
    }
  }

  // Função para limpar os dados salvos
  const clearLastPixKey = () => {
    try {
      localStorage.removeItem(LAST_PIX_KEY_STORAGE_KEY)
      setLastPixKey({})
    } catch (error) {
      console.warn('Erro ao limpar última chave PIX do localStorage:', error)
    }
  }

  return {
    lastPixKey,
    saveLastPixKey,
    clearLastPixKey,
  }
}
