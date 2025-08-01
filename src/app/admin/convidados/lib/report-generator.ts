import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { Guest } from '@/types'

// Extend jsPDF type to include autoTable properties
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

interface ReportStats {
  totalGuests: number
  totalPeople: number
  totalConfirmedPeople: number
  totalNotConfirmedPeople: number
  totalChildren: number
  confirmedGuests: number
  unconfirmedGuests: number
  partiallyConfirmedGuests: number
}

export async function generateGuestsReport(
  guests: Guest[],
  format: 'pdf' | 'xlsx',
  title: string,
  stats?: ReportStats
) {
  if (format === 'pdf') {
    return generatePDFReport(guests, title, stats)
  } else {
    return generateExcelReport(guests, title, stats)
  }
}

function generatePDFReport(guests: Guest[], title: string, stats?: ReportStats) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 20, 20)
  
  // Subtitle
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30)
  
  let currentY = 40

  // If it's a summary report, add statistics
  if (stats) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumo Executivo', 20, currentY)
    currentY += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const summaryData = [
      ['Total de Grupos de Convidados', stats.totalGuests.toString()],
      ['Total de Pessoas', stats.totalPeople.toString()],
      ['Pessoas Confirmadas', stats.totalConfirmedPeople.toString()],
      ['Pessoas Não Confirmadas', stats.totalNotConfirmedPeople.toString()],
      ['Total de Crianças', stats.totalChildren.toString()],
      ['Grupos Totalmente Confirmados', stats.confirmedGuests.toString()],
      ['Grupos Não Confirmados', stats.unconfirmedGuests.toString()],
      ['Grupos Parcialmente Confirmados', stats.partiallyConfirmedGuests.toString()],
    ]
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    })
    
    currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : currentY + 60
  }

  // Prepare data for the main table
  const tableData: string[][] = []
  
  guests.forEach((guest) => {
    const partySize = 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
    
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

    const confirmationStatus = 
      confirmedInGroup === partySize ? 'Totalmente Confirmado' :
      confirmedInGroup > 0 ? 'Parcialmente Confirmado' : 
      'Não Confirmado'

    // Build family members string for the main column
    const familyMembers: string[] = [guest.name + (guest.isConfirmed ? ' ✓' : ' ✗')]
    
    if (guest.spouse) {
      familyMembers.push(guest.spouse + (guest.spouseConfirmation ? ' ✓' : ' ✗'))
    }
    
    if (guest.children?.length) {
      guest.children.forEach(child => {
        const confirmed = guest.childrenConfirmations?.[child] || false
        familyMembers.push(`${child} (filho)${confirmed ? ' ✓' : ' ✗'}`)
      })
    }
    
    if (guest.companions?.length) {
      guest.companions.forEach(companion => {
        const confirmed = guest.companionsConfirmations?.[companion] || false
        familyMembers.push(`${companion} (acompanhante)${confirmed ? ' ✓' : ' ✗'}`)
      })
    }

    tableData.push([
      familyMembers.join('\n'),
      guest.confirmationCode,
      partySize.toString(),
      `${confirmedInGroup}/${partySize}`,
      confirmationStatus
    ])
  })

  // Add main table
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Lista de Convidados', 20, currentY)
  currentY += 10

  autoTable(doc, {
    startY: currentY,
    head: [['Grupo de Convidados', 'Código', 'Pessoas', 'Confirmações', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { 
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 20 },
      2: { cellWidth: 15 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
    },
    margin: { left: 20, right: 20 },
  })

  // Save the PDF
  const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

function generateExcelReport(guests: Guest[], title: string, stats?: ReportStats) {
  const workbook = XLSX.utils.book_new()

  // If it's a summary report, create a summary sheet
  if (stats) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Grupos de Convidados', stats.totalGuests],
      ['Total de Pessoas', stats.totalPeople],
      ['Pessoas Confirmadas', stats.totalConfirmedPeople],
      ['Pessoas Não Confirmadas', stats.totalNotConfirmedPeople],
      ['Total de Crianças', stats.totalChildren],
      ['Grupos Totalmente Confirmados', stats.confirmedGuests],
      ['Grupos Não Confirmados', stats.unconfirmedGuests],
      ['Grupos Parcialmente Confirmados', stats.partiallyConfirmedGuests],
      [''],
      ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')
  }

  // Create main data sheet
  const mainData: (string | number)[][] = [
    [
      'Grupo de Convidados',
      'Código de Confirmação', 
      'Total de Pessoas',
      'Pessoas Confirmadas',
      'Status',
      'Data de Cadastro',
      'Última Atualização'
    ]
  ]

  guests.forEach((guest) => {
    const partySize = 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
    
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

    const confirmationStatus = 
      confirmedInGroup === partySize ? 'Totalmente Confirmado' :
      confirmedInGroup > 0 ? 'Parcialmente Confirmado' : 
      'Não Confirmado'

    // Build family members list for Excel
    const familyMembers: string[] = [guest.name + (guest.isConfirmed ? ' ✓' : ' ✗')]
    
    if (guest.spouse) {
      familyMembers.push(guest.spouse + (guest.spouseConfirmation ? ' ✓' : ' ✗'))
    }
    
    if (guest.children?.length) {
      guest.children.forEach(child => {
        const confirmed = guest.childrenConfirmations?.[child] || false
        familyMembers.push(`${child} (filho)${confirmed ? ' ✓' : ' ✗'}`)
      })
    }
    
    if (guest.companions?.length) {
      guest.companions.forEach(companion => {
        const confirmed = guest.companionsConfirmations?.[companion] || false
        familyMembers.push(`${companion} (acompanhante)${confirmed ? ' ✓' : ' ✗'}`)
      })
    }

    mainData.push([
      familyMembers.join('\n'),
      guest.confirmationCode,
      partySize,
      confirmedInGroup,
      confirmationStatus,
      new Date(guest.createdAt).toLocaleDateString('pt-BR'),
      guest.updatedAt ? new Date(guest.updatedAt).toLocaleDateString('pt-BR') : ''
    ])
  })

  const mainSheet = XLSX.utils.aoa_to_sheet(mainData)
  
  // Set column widths
  const columnWidths = [
    { wch: 40 }, // Grupo de Convidados
    { wch: 15 }, // Código
    { wch: 12 }, // Total Pessoas
    { wch: 15 }, // Pessoas Confirmadas
    { wch: 20 }, // Status
    { wch: 15 }, // Data Cadastro
    { wch: 15 }, // Última Atualização
  ]
  
  mainSheet['!cols'] = columnWidths

  XLSX.utils.book_append_sheet(workbook, mainSheet, 'Convidados')

  // Create detailed people sheet
  const peopleData: (string | number)[][] = [
    ['Grupo', 'Nome', 'Tipo', 'Confirmado', 'Código do Grupo']
  ]

  guests.forEach((guest) => {
    // Add main guest
    peopleData.push([
      guest.name,
      guest.name,
      'Principal',
      guest.isConfirmed ? 'Sim' : 'Não',
      guest.confirmationCode
    ])

    // Add spouse
    if (guest.spouse) {
      peopleData.push([
        guest.name,
        guest.spouse,
        'Cônjuge',
        guest.spouseConfirmation ? 'Sim' : 'Não',
        guest.confirmationCode
      ])
    }

    // Add children
    guest.children?.forEach(child => {
      peopleData.push([
        guest.name,
        child,
        'Filho',
        guest.childrenConfirmations?.[child] ? 'Sim' : 'Não',
        guest.confirmationCode
      ])
    })

    // Add companions
    guest.companions?.forEach(companion => {
      peopleData.push([
        guest.name,
        companion,
        'Acompanhante',
        guest.companionsConfirmations?.[companion] ? 'Sim' : 'Não',
        guest.confirmationCode
      ])
    })
  })

  const peopleSheet = XLSX.utils.aoa_to_sheet(peopleData)
  peopleSheet['!cols'] = [
    { wch: 25 }, // Grupo
    { wch: 25 }, // Nome
    { wch: 15 }, // Tipo
    { wch: 12 }, // Confirmado
    { wch: 15 }, // Código
  ]

  XLSX.utils.book_append_sheet(workbook, peopleSheet, 'Pessoas Detalhado')

  // Save the Excel file
  const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
