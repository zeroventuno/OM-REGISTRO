'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './Header.module.css'

export default function Header() {
    const { language, setLanguage } = useLanguage()

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logoSection}>
                    <img
                        src="/logo.png"
                        alt="Officine Mattio"
                        className={styles.logo}
                    />
                </div>
                <div className={styles.languageSelector}>
                    <button
                        className={language === 'pt' ? styles.active : ''}
                        onClick={() => setLanguage('pt')}
                    >
                        PT
                    </button>
                    <button
                        className={language === 'it' ? styles.active : ''}
                        onClick={() => setLanguage('it')}
                    >
                        IT
                    </button>
                </div>
            </div>
        </header>
    )
}
