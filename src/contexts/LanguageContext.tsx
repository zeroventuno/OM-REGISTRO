'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'pt' | 'it'

interface Translations {
    [key: string]: {
        pt: string
        it: string
    }
}

const translations: Translations = {
    // Header
    'header.title': { pt: 'Registro Officine Mattio', it: 'Registrazione Officine Mattio' },

    // Form Labels
    'form.customer.title': { pt: 'Informações do Cliente', it: 'Informazioni Cliente' },
    'form.customer.firstName': { pt: 'Nome', it: 'Nome' },
    'form.customer.lastName': { pt: 'Sobrenome', it: 'Cognome' },
    'form.customer.email': { pt: 'E-mail', it: 'Email' },
    'form.customer.phone': { pt: 'Telefone', it: 'Telefono' },
    'form.customer.country': { pt: 'País', it: 'Paese' },
    'form.customer.address': { pt: 'Endereço', it: 'Indirizzo' },
    'form.customer.city': { pt: 'Cidade', it: 'Città' },
    'form.customer.zipCode': { pt: 'CEP', it: 'CAP' },

    'form.product.title': { pt: 'Informações do Produto', it: 'Informazioni Prodotto' },
    'form.product.model': { pt: 'Modelo', it: 'Modello' },
    'form.product.serialNumber': { pt: 'Número de Série', it: 'Numero di Serie' },
    'form.product.wheelType': { pt: 'Tipo de Roda', it: 'Tipo di Ruota' },
    'form.product.purchaseDate': { pt: 'Data de Compra', it: 'Data di Acquisto' },
    'form.product.notes': { pt: 'Observações', it: 'Note' },

    // Buttons
    'button.submit': { pt: 'Registrar', it: 'Registra' },
    'button.reset': { pt: 'Limpar', it: 'Cancella' },

    // Footer
    'footer.copyright': { pt: 'Copyright © 2025 Officine Mattio. Todos os direitos reservados.', it: 'Copyright © 2025 Officine Mattio. Tutti i diritti riservati.' },

    // Messages
    'message.success': { pt: 'Registro realizado com sucesso!', it: 'Registrazione completata con successo!' },
    'message.error': { pt: 'Erro ao registrar. Tente novamente.', it: 'Errore durante la registrazione. Riprova.' },

    // Product Models
    'model.completeBike': { pt: 'Bicicleta Completa', it: 'Bicicletta Completa' },
    'model.frame': { pt: 'Quadro', it: 'Telaio' },
    'model.wheels': { pt: 'Rodas', it: 'Ruote' },
    'model.other': { pt: 'Outro', it: 'Altro' },

    // Placeholders
    'placeholder.selectCountry': { pt: 'Selecione o país', it: 'Seleziona il paese' },
    'placeholder.selectModel': { pt: 'Selecione o modelo', it: 'Seleziona il modello' },
    'placeholder.selectWheelType': { pt: 'Selecione o tipo de roda', it: 'Seleziona il tipo di ruota' },
}

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt')

    const t = (key: string): string => {
        return translations[key]?.[language] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
