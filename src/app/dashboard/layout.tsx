import { ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Sidebar from '@/components/Sidebar'
import './dashboard.css'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <div className="dashboard-container">
                <Sidebar />
                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </LanguageProvider>
    )
}
