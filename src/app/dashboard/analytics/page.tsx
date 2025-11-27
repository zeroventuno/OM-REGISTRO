'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from '../page.module.css'

export default function AnalyticsPage() {
    const { t } = useLanguage()

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div>
                    <h1>{t('sidebar.analytics')}</h1>
                    <p className={styles.subtitle}>Em desenvolvimento</p>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    <p>Página de análises em construção.</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                        Aqui serão exibidas análises detalhadas de registros, tendências e estatísticas avançadas.
                    </p>
                </div>
            </div>
        </div>
    )
}
