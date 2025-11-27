import { db } from './firebase'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { format, subDays } from 'date-fns'

export interface Customer {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    address: string
    city: string
    zipCode: string
    createdAt: Date
}

export interface Product {
    id: string
    customerId: string
    model: string
    serialNumber: string
    wheelType: string
    purchaseDate: string
    notes: string
    createdAt: Date
}

export interface CustomerWithProduct extends Customer {
    product: Product
}

// Convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
    if (timestamp?.toDate) {
        return timestamp.toDate()
    }
    return timestamp instanceof Date ? timestamp : new Date()
}

// Get all customers with their products
export async function getAllCustomersWithProducts(): Promise<CustomerWithProduct[]> {
    try {
        const customersSnap = await getDocs(collection(db, 'customers'))
        const productsSnap = await getDocs(collection(db, 'products'))

        const customers: Customer[] = customersSnap.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || '',
                country: data.country || '',
                address: data.address || '',
                city: data.city || '',
                zipCode: data.zipCode || '',
                createdAt: timestampToDate(data.createdAt),
            }
        })

        const products: Product[] = productsSnap.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                customerId: data.customerId || '',
                model: data.model || '',
                serialNumber: data.serialNumber || '',
                wheelType: data.wheelType || '',
                purchaseDate: data.purchaseDate || '',
                notes: data.notes || '',
                createdAt: timestampToDate(data.createdAt),
            }
        })

        return customers.map(customer => {
            const product = products.find(p => p.customerId === customer.id)
            return {
                ...customer,
                product: product || ({} as Product),
            }
        })
    } catch (error) {
        console.error('Error fetching customers:', error)
        return []
    }
}

// Get statistics
export async function getStatistics() {
    try {
        const customers = await getAllCustomersWithProducts()
        const sevenDaysAgo = subDays(new Date(), 7)

        const recentRegistrations = customers.filter(c => c.createdAt >= sevenDaysAgo)
        const uniqueCountries = new Set(customers.map(c => c.country)).size

        // Count models
        const modelCounts: Record<string, number> = {}
        customers.forEach(c => {
            if (c.product?.model) {
                modelCounts[c.product.model] = (modelCounts[c.product.model] || 0) + 1
            }
        })

        // Get top 5 models
        const topModels = Object.entries(modelCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([model, count]) => ({ model, count }))

        return {
            total: customers.length,
            recentCount: recentRegistrations.length,
            countriesCount: uniqueCountries,
            topModels,
            customers: customers.slice(0, 10), // Recent 10
        }
    } catch (error) {
        console.error('Error getting statistics:', error)
        return {
            total: 0,
            recentCount: 0,
            countriesCount: 0,
            topModels: [],
            customers: [],
        }
    }
}

// Get registration trends (last 30 days)
export async function getRegistrationTrends() {
    try {
        const customers = await getAllCustomersWithProducts()
        const thirtyDaysAgo = subDays(new Date(), 30)

        const recentCustomers = customers.filter(c => c.createdAt >= thirtyDaysAgo)

        // Group by date
        const trendData: Record<string, number> = {}
        for (let i = 30; i >= 0; i--) {
            const date = format(subDays(new Date(), i), 'dd/MM')
            trendData[date] = 0
        }

        recentCustomers.forEach(c => {
            const dateKey = format(c.createdAt, 'dd/MM')
            if (trendData[dateKey] !== undefined) {
                trendData[dateKey]++
            }
        })

        return Object.entries(trendData).map(([date, count]) => ({ date, count }))
    } catch (error) {
        console.error('Error getting trends:', error)
        return []
    }
}
