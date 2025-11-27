'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './Footer.module.css'

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>{t('footer.copyright')}</p>
            </div>
        </footer>
    )
}
