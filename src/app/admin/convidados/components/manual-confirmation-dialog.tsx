'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Guest } from '@/types'
import React, { useState } from 'react'

// Custom Toggle Switch Component
function ToggleSwitch({ 
  checked, 
  onCheckedChange, 
  id 
}: { 
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id: string
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-green-600' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

interface ManualConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guest: Guest | null
  onSave: (
    guestId: string,
    confirmationData: {
      isConfirmed?: boolean
      spouseConfirmation?: boolean
      childrenConfirmations?: Record<string, boolean>
      companionsConfirmations?: Record<string, boolean>
    },
  ) => Promise<void>
  isLoading?: boolean
}

export function ManualConfirmationDialog({
  open,
  onOpenChange,
  guest,
  onSave,
  isLoading = false,
}: ManualConfirmationDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [spouseConfirmation, setSpouseConfirmation] = useState(false)
  const [childrenConfirmations, setChildrenConfirmations] = useState<Record<string, boolean>>({})
  const [companionsConfirmations, setCompanionsConfirmations] = useState<Record<string, boolean>>({})

  // Initialize state when guest changes
  React.useEffect(() => {
    if (guest) {
      setIsConfirmed(guest.isConfirmed || false)
      setSpouseConfirmation(guest.spouseConfirmation || false)
      setChildrenConfirmations(guest.childrenConfirmations || {})
      setCompanionsConfirmations(guest.companionsConfirmations || {})
    }
  }, [guest])

  const handleChildConfirmationChange = (childName: string, confirmed: boolean) => {
    setChildrenConfirmations(prev => ({
      ...prev,
      [childName]: confirmed,
    }))
  }

  const handleCompanionConfirmationChange = (companionName: string, confirmed: boolean) => {
    setCompanionsConfirmations(prev => ({
      ...prev,
      [companionName]: confirmed,
    }))
  }

  const handleSave = async () => {
    if (!guest) return

    const confirmationData: {
      isConfirmed: boolean
      spouseConfirmation?: boolean
      childrenConfirmations?: Record<string, boolean>
      companionsConfirmations?: Record<string, boolean>
    } = {
      isConfirmed,
    }

    if (guest.spouse) {
      confirmationData.spouseConfirmation = spouseConfirmation
    }

    if (guest.children && guest.children.length > 0) {
      confirmationData.childrenConfirmations = childrenConfirmations
    }

    if (guest.companions && guest.companions.length > 0) {
      confirmationData.companionsConfirmations = companionsConfirmations
    }

    await onSave(guest.id, confirmationData)
  }

  if (!guest) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Presença</DialogTitle>
          <DialogDescription>
            Gerencie a confirmação de presença para <strong>{guest.name}</strong> e seus acompanhantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Main guest confirmation */}
          <div className="flex items-center justify-between">
            <Label htmlFor="main-guest" className="font-medium">
              {guest.name}
            </Label>
            <ToggleSwitch
              id="main-guest"
              checked={isConfirmed}
              onCheckedChange={setIsConfirmed}
            />
          </div>

          {/* Spouse confirmation */}
          {guest.spouse && (
            <div className="flex items-center justify-between">
              <Label htmlFor="spouse" className="font-medium">
                {guest.spouse} (cônjuge)
              </Label>
              <ToggleSwitch
                id="spouse"
                checked={spouseConfirmation}
                onCheckedChange={setSpouseConfirmation}
              />
            </div>
          )}

          {/* Children confirmations */}
          {guest.children && guest.children.length > 0 && (
            <>
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Filhos</h4>
                {guest.children.map(child => (
                  <div key={child} className="flex items-center justify-between py-1">
                    <Label htmlFor={`child-${child}`} className="text-sm">
                      {child}
                    </Label>
                    <ToggleSwitch
                      id={`child-${child}`}
                      checked={childrenConfirmations[child] || false}
                      onCheckedChange={(confirmed: boolean) => handleChildConfirmationChange(child, confirmed)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Companions confirmations */}
          {guest.companions && guest.companions.length > 0 && (
            <>
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Acompanhantes</h4>
                {guest.companions.map(companion => (
                  <div key={companion} className="flex items-center justify-between py-1">
                    <Label htmlFor={`companion-${companion}`} className="text-sm">
                      {companion}
                    </Label>
                    <ToggleSwitch
                      id={`companion-${companion}`}
                      checked={companionsConfirmations[companion] || false}
                      onCheckedChange={(confirmed: boolean) => handleCompanionConfirmationChange(companion, confirmed)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-black">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
