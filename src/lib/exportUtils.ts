import * as XLSX from 'xlsx'
import { CustomerWithProduct } from './dataService'
import { format } from 'date-fns'

export function exportToExcel(customers: CustomerWithProduct[], filename: string = 'customers') {
    // Prepare data for Excel
    const data = customers.map(customer => ({
        'Nome': `${customer.firstName} ${customer.lastName}`,
        'Email': customer.email,
        'Telefone': customer.phone,
        'País': customer.country,
        'Endereço': customer.address,
        'Cidade': customer.city,
        'CEP': customer.zipCode,
        'Modelo': customer.product?.model || '',
        'Número de Série': customer.product?.serialNumber || '',
        'Tipo de Roda': customer.product?.wheelType || '',
        'Data de Compra': customer.product?.purchaseDate || '',
        'Observações': customer.product?.notes || '',
        'Data de Registro': format(customer.createdAt, 'dd/MM/yyyy HH:mm'),
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    // Set column widths
    const columnWidths = [
        { wch: 25 }, // Nome
        { wch: 30 }, // Email
        { wch: 18 }, // Telefone
        { wch: 15 }, // País
        { wch: 30 }, // Endereço
        { wch: 20 }, // Cidade
        { wch: 12 }, // CEP
        { wch: 20 }, // Modelo
        { wch: 20 }, // Número de Série
        { wch: 20 }, // Tipo de Roda
        { wch: 15 }, // Data de Compra
        { wch: 30 }, // Observações
        { wch: 18 }, // Data de Registro
    ]
    ws['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes')

    // Generate Excel file and download
    XLSX.writeFile(wb, `${filename}_${format(new Date(), 'yyyyMMdd')}.xlsx`)
}

export function exportToCSV(customers: CustomerWithProduct[], filename: string = 'customers') {
    // Prepare CSV content
    const headers = [
        'Nome',
        'Email',
        'Telefone',
        'País',
        'Endereço',
        'Cidade',
        'CEP',
        'Modelo',
        'Número de Série',
        'Tipo de Roda',
        'Data de Compra',
        'Observações',
        'Data de Registro',
    ]

    const rows = customers.map(customer => [
        `${customer.firstName} ${customer.lastName}`,
        customer.email,
        customer.phone,
        customer.country,
        customer.address,
        customer.city,
        customer.zipCode,
        customer.product?.model || '',
        customer.product?.serialNumber || '',
        customer.product?.wheelType || '',
        customer.product?.purchaseDate || '',
        customer.product?.notes || '',
        format(customer.createdAt, 'dd/MM/yyyy HH:mm'),
    ])

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyyMMdd')}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
