'use client'

import { Guest } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, FileSpreadsheet, Users, UserCheck, UserX, Baby } from 'lucide-react'
import { useMemo } from 'react'
import { generateGuestsReport } from './report-generator'
import { toast } from 'sonner'

interface ReportsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guests: Guest[]
}

type ReportType = 'all' | 'confirmed' | 'unconfirmed' | 'summary'

export function ReportsDialog({ open, onOpenChange, guests }: ReportsDialogProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalPeople = guests.reduce((total, guest) => {
      return total + 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
    }, 0)

    const totalConfirmedPeople = guests.reduce((total, guest) => {
      let confirmedInGroup = 0

      if (guest.isConfirmed) confirmedInGroup += 1
      if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
      if (guest.children && guest.childrenConfirmations) {
        guest.children.forEach(child => {
          if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
        })
      }
      if (guest.companions && guest.companionsConfirmations) {
        guest.companions.forEach(companion => {
          if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
        })
      }

      return total + confirmedInGroup
    }, 0)

    const totalNotConfirmedPeople = totalPeople - totalConfirmedPeople

    const totalChildren = guests.reduce((total, guest) => {
      return total + (guest.children?.length || 0)
    }, 0)

    const confirmedGuests = guests.filter(guest => {
      const totalInGroup = 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
      let confirmedInGroup = 0

      if (guest.isConfirmed) confirmedInGroup += 1
      if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
      if (guest.children && guest.childrenConfirmations) {
        guest.children.forEach(child => {
          if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
        })
      }
      if (guest.companions && guest.companionsConfirmations) {
        guest.companions.forEach(companion => {
          if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
        })
      }

      return confirmedInGroup === totalInGroup
    })

    const unconfirmedGuests = guests.filter(guest => {
      let confirmedInGroup = 0

      if (guest.isConfirmed) confirmedInGroup += 1
      if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
      if (guest.children && guest.childrenConfirmations) {
        guest.children.forEach(child => {
          if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
        })
      }
      if (guest.companions && guest.companionsConfirmations) {
        guest.companions.forEach(companion => {
          if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
        })
      }

      return confirmedInGroup === 0
    })

    return {
      totalGuests: guests.length,
      totalPeople,
      totalConfirmedPeople,
      totalNotConfirmedPeople,
      totalChildren,
      confirmedGuests: confirmedGuests.length,
      unconfirmedGuests: unconfirmedGuests.length,
      partiallyConfirmedGuests: guests.length - confirmedGuests.length - unconfirmedGuests.length
    }
  }, [guests])

  const handleGenerateReport = async (type: ReportType, format: 'pdf' | 'xlsx') => {
    try {
      let filteredGuests: Guest[]
      let reportTitle: string

      switch (type) {
        case 'all':
          filteredGuests = guests
          reportTitle = 'Lista Completa de Convidados'
          break
        case 'confirmed':
          filteredGuests = guests.filter(guest => {
            const totalInGroup = 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
            let confirmedInGroup = 0

            if (guest.isConfirmed) confirmedInGroup += 1
            if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
            if (guest.children && guest.childrenConfirmations) {
              guest.children.forEach(child => {
                if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
              })
            }
            if (guest.companions && guest.companionsConfirmations) {
              guest.companions.forEach(companion => {
                if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
              })
            }

            return confirmedInGroup === totalInGroup
          })
          reportTitle = 'Convidados Confirmados'
          break
        case 'unconfirmed':
          filteredGuests = guests.filter(guest => {
            let confirmedInGroup = 0

            if (guest.isConfirmed) confirmedInGroup += 1
            if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
            if (guest.children && guest.childrenConfirmations) {
              guest.children.forEach(child => {
                if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
              })
            }
            if (guest.companions && guest.companionsConfirmations) {
              guest.companions.forEach(companion => {
                if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
              })
            }

            return confirmedInGroup === 0
          })
          reportTitle = 'Convidados Não Confirmados'
          break
        case 'summary':
          filteredGuests = guests
          reportTitle = 'Relatório Resumo - Casamento Luan & Ester'
          break
        default:
          filteredGuests = guests
          reportTitle = 'Relatório de Convidados'
      }

      await generateGuestsReport(filteredGuests, format, reportTitle, type === 'summary' ? stats : undefined)
      
      toast.success(`Relatório ${format.toUpperCase()} gerado com sucesso!`)
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error('Erro ao gerar relatório. Tente novamente.')
    }
  }

  const reportOptions = [
    {
      id: 'all' as ReportType,
      title: 'Lista Completa',
      description: 'Todos os convidados cadastrados com detalhes',
      icon: Users,
      count: stats.totalGuests,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'confirmed' as ReportType,
      title: 'Confirmados',
      description: 'Apenas convidados totalmente confirmados',
      icon: UserCheck,
      count: stats.confirmedGuests,
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      id: 'unconfirmed' as ReportType,
      title: 'Não Confirmados',
      description: 'Convidados que ainda não confirmaram presença',
      icon: UserX,
      count: stats.unconfirmedGuests,
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      id: 'summary' as ReportType,
      title: 'Relatório Resumo',
      description: 'Estatísticas completas e resumo executivo',
      icon: Baby,
      count: stats.totalPeople,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Gerar Relatórios</DialogTitle>
          <DialogDescription>
            Selecione o tipo de relatório e formato desejado para exportar os dados dos convidados.
          </DialogDescription>
        </DialogHeader>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalGuests}</div>
            <div className="text-sm text-blue-600">Convidados</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalConfirmedPeople}</div>
            <div className="text-sm text-green-600">Confirmados</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.totalNotConfirmedPeople}</div>
            <div className="text-sm text-red-600">Não Confirmados</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalPeople}</div>
            <div className="text-sm text-purple-600">Total de Pessoas</div>
          </div>
        </div>

        {/* Report Options */}
        <div className="grid gap-4">
          {reportOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card key={option.id} className={`border-2 ${option.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${option.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription className="text-sm">{option.description}</CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
                      {option.count} {option.id === 'summary' ? 'pessoas' : 'grupos'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGenerateReport(option.id, 'pdf')}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-black"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Gerar PDF
                    </Button>
                    <Button
                      onClick={() => handleGenerateReport(option.id, 'xlsx')}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-black"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Gerar Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">
            <strong>Dica:</strong> Os relatórios em PDF são ideais para impressão e visualização, enquanto os arquivos Excel 
            permitem análises mais detalhadas e manipulação dos dados.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
