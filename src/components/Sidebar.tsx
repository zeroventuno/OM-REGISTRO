'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { LayoutDashboard, Users, FileText, BarChart3 } from 'lucide-react'
import styles from './Sidebar.module.css'

export default function Sidebar() {
    const { t } = useLanguage()
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
        { href: '/dashboard/customers', icon: Users, label: t('sidebar.customers') },
        { href: '/', icon: FileText, label: t('sidebar.newRegistration') },
        { href: '/dashboard/analytics', icon: BarChart3, label: t('sidebar.analytics') },
    ]

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src="/logo.png" alt="Officine Mattio" />
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
