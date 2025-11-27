'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAllCustomersWithProducts, CustomerWithProduct } from '@/lib/dataService'
import { exportToExcel, exportToCSV } from '@/lib/exportUtils'
import { Search, Download, FileSpreadsheet } from 'lucide-react'
import { format } from 'date-fns'
import { countries, bikeModels } from '@/lib/constants'
import styles from './page.module.css'

export default function CustomersPage() {
    const { t } = useLanguage()
    const [allCustomers, setAllCustomers] = useState<CustomerWithProduct[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithProduct[]>([])
    const [loading, setLoading] = useState(true)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [countryFilter, setCountryFilter] = useState('')
    const [modelFilter, setModelFilter] = useState('')

    useEffect(() => {
        loadCustomers()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [searchTerm, countryFilter, modelFilter, allCustomers])

    async function loadCustomers() {
        setLoading(true)
        const data = await getAllCustomersWithProducts()
        setAllCustomers(data)
        setFilteredCustomers(data)
        setLoading(false)
    }

    function applyFilters() {
        let result = [...allCustomers]

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(c =>
                c.firstName.toLowerCase().includes(term) ||
                c.lastName.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term)
            )
        }

        // Country filter
        if (countryFilter) {
            result = result.filter(c => c.country === countryFilter)
        }

        // Model filter
        if (modelFilter) {
            result = result.filter(c => c.product?.model === modelFilter)
        }

        setFilteredCustomers(result)
    }

    function handleExportExcel() {
        exportToExcel(filteredCustomers, 'officine-mattio-customers')
    }

    function handleExportCSV() {
        exportToCSV(filteredCustomers, 'officine-mattio-customers')
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Carregando clientes...</p>
            </div>
        )
    }

    return (
        <div className={styles.customers}>
            <div className={styles.header}>
                <div>
                    <h1>{t('customers.title')}</h1>
                    <p className={styles.subtitle}>
                        {filteredCustomers.length} {t('customers.total')}
                    </p>
                </div>
                <div className={styles.exportButtons}>
                    <button onClick={handleExportExcel} className={styles.exportBtn}>
                        <FileSpreadsheet size={18} />
                        {t('customers.export.excel')}
                    </button>
                    <button onClick={handleExportCSV} className={styles.exportBtn}>
                        <Download size={18} />
                        {t('customers.export.csv')}
                    </button>
                </div>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={t('customers.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">{t('customers.filter.country')}</option>
                    {countries.map(country => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>

                <select
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">{t('customers.filter.model')}</option>
                    {bikeModels.map(model => (
                        <option key={model.value} value={model.value}>
                            {model.label}
                        </option>
                    ))}
                </select>

                {(searchTerm || countryFilter || modelFilter) && (
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            setCountryFilter('')
                            setModelFilter('')
                        }}
                        className={styles.clearFilters}
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('customers.table.name')}</th>
                                <th>{t('customers.table.email')}</th>
                                <th>{t('customers.table.country')}</th>
                                <th>{t('customers.table.model')}</th>
                                <th>{t('customers.table.serialNumber')}</th>
                                <th>{t('customers.table.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.country}</td>
                                    <td>{customer.product?.model || '-'}</td>
                                    <td>{customer.product?.serialNumber || '-'}</td>
                                    <td>{format(customer.createdAt, 'dd/MM/yyyy')}</td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className={styles.noData}>
                                        {t('customers.noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
