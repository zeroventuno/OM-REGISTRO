'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getStatistics, getRegistrationTrends } from '@/lib/dataService'
import StatsCard from '@/components/StatsCard'
import { BarChart3, Clock, Globe } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import styles from './page.module.css'

export default function DashboardPage() {
    const { t, language } = useLanguage()
    const [stats, setStats] = useState<any>(null)
    const [trends, setTrends] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [statsData, trendsData] = await Promise.all([
                getStatistics(),
                getRegistrationTrends(),
            ])
            setStats(statsData)
            setTrends(trendsData)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Carregando...</p>
            </div>
        )
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div>
                    <h1>{t('dashboard.title')}</h1>
                    <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
                </div>
                <div className={styles.languageToggle}>
                    <button
                        className={language === 'pt' ? styles.active : ''}
                        onClick={() => useLanguage().setLanguage('pt')}
                    >
                        🇧🇷 PT
                    </button>
                    <button
                        className={language === 'it' ? styles.active : ''}
                        onClick={() => useLanguage().setLanguage('it')}
                    >
                        🇮🇹 IT
                    </button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <StatsCard
                    icon={BarChart3}
                    value={stats.total}
                    label={t('dashboard.stats.total')}
                />
                <StatsCard
                    icon={Clock}
                    value={stats.recentCount}
                    label={t('dashboard.stats.recent')}
                />
                <StatsCard
                    icon={Globe}
                    value={stats.countriesCount}
                    label={t('dashboard.stats.countries')}
                />
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3>{t('dashboard.trends')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#1a1a1a" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                    <h3>{t('dashboard.topModels')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.topModels}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="model" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#1a1a1a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.tableCard}>
                <h3>{t('dashboard.recentRegistrations')}</h3>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('customers.table.name')}</th>
                                <th>{t('customers.table.email')}</th>
                                <th>{t('customers.table.country')}</th>
                                <th>{t('customers.table.model')}</th>
                                <th>{t('customers.table.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.customers.map((customer: any) => (
                                <tr key={customer.id}>
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.country}</td>
                                    <td>{customer.product?.model || '-'}</td>
                                    <td>{format(customer.createdAt, 'dd/MM/yyyy')}</td>
                                </tr>
                            ))}
                            {stats.customers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={styles.noData}>
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
