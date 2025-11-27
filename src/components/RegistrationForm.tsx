'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabaseClient'
import { countries, bikeModels, wheelTypes } from '@/lib/constants'
import styles from './RegistrationForm.module.css'

interface FormData {
    // Customer data
    firstName: string
    lastName: string
    email: string
    phone: string
    phonePrefix: string
    country: string
    address: string
    city: string
    zipCode: string

    // Product data
    model: string
    modelOther: string
    serialNumber: string
    wheelType: string
    wheelTypeOther: string
    purchaseDate: string
    notes: string
}

export default function RegistrationForm() {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        phonePrefix: '+55',
        country: '',
        address: '',
        city: '',
        zipCode: '',
        model: '',
        modelOther: '',
        serialNumber: '',
        wheelType: '',
        wheelTypeOther: '',
        purchaseDate: '',
        notes: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Auto-update phone prefix when country changes
        if (name === 'country') {
            const selectedCountry = countries.find(c => c.code === value)
            if (selectedCountry) {
                setFormData(prev => ({ ...prev, phonePrefix: selectedCountry.phone }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            // Insert customer
            const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .insert({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: `${formData.phonePrefix} ${formData.phone}`,
                    country: formData.country,
                    address: formData.address,
                    city: formData.city,
                    zip_code: formData.zipCode,
                })
                .select()
                .single()

            if (customerError) throw customerError

            // Insert product
            const finalModel = formData.model === 'other' ? formData.modelOther : formData.model
            const finalWheelType = formData.wheelType === 'other' ? formData.wheelTypeOther : formData.wheelType

            const { error: productError } = await supabase
                .from('products')
                .insert({
                    customer_id: customerData.id,
                    model: finalModel,
                    serial_number: formData.serialNumber,
                    wheel_type: finalWheelType,
                    purchase_date: formData.purchaseDate || null,
                    notes: formData.notes,
                })

            if (productError) throw productError

            setMessage({ type: 'success', text: t('message.success') })

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                phonePrefix: '+55',
                country: '',
                address: '',
                city: '',
                zipCode: '',
                model: '',
                modelOther: '',
                serialNumber: '',
                wheelType: '',
                wheelTypeOther: '',
                purchaseDate: '',
                notes: '',
            })
        } catch (error: any) {
            console.error('Submission error:', error)
            setMessage({ type: 'error', text: t('message.error') })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <section className={styles.section}>
                <h2>{t('form.customer.title')}</h2>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>{t('form.customer.firstName')} *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>{t('form.customer.lastName')} *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>{t('form.customer.email')} *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>{t('form.customer.country')} *</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('placeholder.selectCountry')}</option>
                            {countries.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field} style={{ flex: '0 0 120px' }}>
                        <label>{t('form.customer.phone')}</label>
                        <input
                            type="text"
                            name="phonePrefix"
                            value={formData.phonePrefix}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className={styles.field} style={{ flex: 1 }}>
                        <label>&nbsp;</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label>{t('form.customer.address')}</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>{t('form.customer.city')}</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>{t('form.customer.zipCode')}</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2>{t('form.product.title')}</h2>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>{t('form.product.model')} *</label>
                        <select
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('placeholder.selectModel')}</option>
                            {bikeModels.map(model => (
                                <option key={model.value} value={model.value}>
                                    {model.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.model === 'other' && (
                        <div className={styles.field}>
                            <label>Specify Model *</label>
                            <input
                                type="text"
                                name="modelOther"
                                value={formData.modelOther}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                </div>

                <div className={styles.field}>
                    <label>{t('form.product.serialNumber')} *</label>
                    <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>{t('form.product.wheelType')}</label>
                        <select
                            name="wheelType"
                            value={formData.wheelType}
                            onChange={handleChange}
                        >
                            <option value="">{t('placeholder.selectWheelType')}</option>
                            {wheelTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.wheelType === 'other' && (
                        <div className={styles.field}>
                            <label>Specify Wheel Type</label>
                            <input
                                type="text"
                                name="wheelTypeOther"
                                value={formData.wheelTypeOther}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.field}>
                    <label>{t('form.product.purchaseDate')}</label>
                    <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label>{t('form.product.notes')}</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </section>

            <div className={styles.actions}>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? '...' : t('button.submit')}
                </button>
                <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        phonePrefix: '+55',
                        country: '',
                        address: '',
                        city: '',
                        zipCode: '',
                        model: '',
                        modelOther: '',
                        serialNumber: '',
                        wheelType: '',
                        wheelTypeOther: '',
                        purchaseDate: '',
                        notes: '',
                    })}
                >
                    {t('button.reset')}
                </button>
            </div>
        </form>
    )
}
