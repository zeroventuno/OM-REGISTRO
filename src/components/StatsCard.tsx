import { LucideIcon } from 'lucide-react'
import styles from './StatsCard.module.css'

interface StatsCardProps {
    icon: LucideIcon
    value: string | number
    label: string
    trend?: string
}

export default function StatsCard({ icon: Icon, value, label, trend }: StatsCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.icon}>
                <Icon size={24} />
            </div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                <div className={styles.label}>{label}</div>
                {trend && <div className={styles.trend}>{trend}</div>}
            </div>
        </div>
    )
}
