'use client'

import { guestsService } from '@/services/guests.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle, Upload, Users, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface ImportGuestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ParsedGuest {
  name: string
  isDuplicate: boolean
  hasError: boolean
  error?: string
}

export function ImportGuestsDialog({ open, onOpenChange }: ImportGuestsDialogProps) {
  const queryClient = useQueryClient()
  const [guestList, setGuestList] = useState('')
  const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([])
  const [showPreview, setShowPreview] = useState(false)

  // Mutation for bulk import
  const importMutation = useMutation({
    mutationFn: guestsService.bulkImport,
    onSuccess: data => {
      const { imported, duplicates, errors } = data

      let message = ''
      if (imported.length > 0) {
        message += `${imported.length} convidado(s) importado(s) com sucesso`
      }
      if (duplicates.length > 0) {
        if (message) message += '. '
        message += `${duplicates.length} nome(s) já existiam`
      }
      if (errors.length > 0) {
        if (message) message += '. '
        message += `${errors.length} erro(s) de validação`
      }

      toast.success(message || 'Importação concluída')
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      handleClose()
    },
    onError: error => {
      toast.error(error?.message ?? 'Erro ao importar convidados')
    },
  })

  // Parse guest list and check for basic validation
  const parseGuestList = (text: string): ParsedGuest[] => {
    if (!text.trim()) return []

    const lines = text.split('\n')
    const guests: ParsedGuest[] = []

    for (const line of lines) {
      const name = line.trim()
      if (!name) continue

      let hasError = false
      let error = ''

      if (name.length < 2) {
        hasError = true
        error = 'Nome deve ter pelo menos 2 caracteres'
      } else if (name.length > 100) {
        hasError = true
        error = 'Nome deve ter no máximo 100 caracteres'
      }

      guests.push({
        name,
        isDuplicate: false, // Will be determined by API
        hasError,
        error,
      })
    }

    return guests
  }

  // Auto-update preview when guestList changes
  useEffect(() => {
    if (guestList.trim()) {
      const parsed = parseGuestList(guestList)
      setParsedGuests(parsed)
      setShowPreview(true)
    } else {
      setParsedGuests([])
      setShowPreview(false)
    }
  }, [guestList])

  const handleImport = () => {
    const validNames = parsedGuests.filter(guest => !guest.hasError).map(guest => guest.name)

    if (validNames.length === 0) {
      toast.error('Nenhum nome válido para importar')
      return
    }

    importMutation.mutate(validNames)
  }

  const handleClose = () => {
    setGuestList('')
    setParsedGuests([])
    setShowPreview(false)
    onOpenChange(false)
  }

  const validGuests = parsedGuests.filter(guest => !guest.hasError)
  const invalidGuests = parsedGuests.filter(guest => guest.hasError)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] lg:w-[70vw] lg:max-w-none border-black shadow-sm overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Upload className="h-5 w-5" />
            Importar Convidados
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Cole uma lista de nomes, um por linha. O sistema verificará automaticamente por duplicatas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left side - Textarea */}
          <div className="w-1/2 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lista de Convidados</label>
            <Textarea
              placeholder={`Elizara\nFábio\nVô Riba\nVó Rita\nIêda e Esposo da Iêda\nMaria Clara e Luís Fabiano\nKamila e Anderson, Abraão, Lia e Ane\nTia Márcia e família`}
              value={guestList}
              onChange={e => setGuestList(e.target.value)}
              className="flex-1 min-h-[400px] max-h-[400px] overflow-y-auto resize-none border-black focus:border-gray-900 focus:ring-gray-900/20 shadow-sm"
              disabled={importMutation.isPending}
            />
          </div>

          {/* Right side - Preview Section */}
          <div className="w-1/2 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">Prévia da Importação</label>
            {showPreview ? (
              <div className="flex-1 min-h-[400px] max-h-[400px] flex flex-col border border-black rounded-lg bg-gray-50/50 overflow-hidden">
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Resumo</h4>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">{validGuests.length} nome(s) válido(s)</span>
                    </div>
                    {invalidGuests.length > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-red-700">{invalidGuests.length} erro(s) de validação</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guest List Preview - Scrollable with fixed height */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-1">
                    {parsedGuests.map((guest, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded text-sm ${
                          guest.hasError ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'
                        }`}>
                        <span className={guest.hasError ? 'text-red-700' : 'text-gray-900'}>{guest.name}</span>
                        {guest.hasError && (
                          <div className="flex items-center gap-1 text-red-600">
                            <X className="h-3 w-3" />
                            <span className="text-xs">{guest.error}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning about duplicates */}
                {validGuests.length > 0 && (
                  <div className="flex-shrink-0 p-4 border-t border-gray-200">
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Nota:</span>
                      </div>
                      <span>Nomes duplicados serão identificados e não importados durante o processo.</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 min-h-[400px] max-h-[400px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50/30">
                <div className="text-center text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Digite nomes na lista para ver a prévia</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 flex-shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={importMutation.isPending} className="border-black">
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!showPreview || validGuests.length === 0 || importMutation.isPending}
            className="border-black shadow-sm hover:shadow-md transition-shadow">
            {importMutation.isPending ? 'Importando...' : `Importar ${validGuests.length} Convidado(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
