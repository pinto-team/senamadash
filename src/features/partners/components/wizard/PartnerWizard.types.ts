import type {
    AcquisitionSource,
    BusinessType,
    CreditStatus,
    CustomerFinancialLevel,
    CustomerRelationshipLevel,
    CustomerSatisfaction,
    FunnelStage,
    PartnerLocation,
    PartnershipStatus,
    PaymentType,
    PotentialLevel,
    PurchaseReadiness,
    SensitivityType,
    SocialPlatform,
} from '@/features/partners/model/types'

/* -----------------------------
 * Wizard base types
 * ----------------------------- */

export type WizardMode = 'create' | 'edit' | 'view'

export type WizardTab =
    | 'identity'
    | 'relationship'
    | 'financial'
    | 'analysis'
    | 'acquisition'
    | 'location'

/* -----------------------------
 * Form values (UX-friendly, backend-safe)
 * ----------------------------- */

export type WizardFormValues = {
    identity: {
        /** required by backend */
        brand_name: string

        manager_full_name?: string
        business_type?: BusinessType | ''

        contact_numbers: Array<{
            label: string
            number: string
            custom_label?: string
        }>

        social_links: Array<{
            platform?: SocialPlatform | ''
            url?: string
            custom_label?: string
        }>

        province?: string
        city?: string

        /** ✅ backend field */
        full_address?: string

        /** ✅ UX-only (واتساپ / گوگل مپ) */
        location_raw?: string

        /** ✅ backend field */
        location?: PartnerLocation | null
    }

    relationship: {
        partnership_status?: PartnershipStatus | ''
        customer_relationship_level?: CustomerRelationshipLevel | ''
        customer_satisfaction?: CustomerSatisfaction | ''
        credit_status?: CreditStatus | ''
        payment_types: PaymentType[]
        sensitivity?: SensitivityType | ''
        preferred_channel?: SocialPlatform | ''
        notes?: string
    }

    financial_estimation: {
        first_transaction_date?: string
        first_transaction_amount_estimated?: string
        last_transaction_date?: string
        last_transaction_amount_estimated?: string
        total_transaction_amount_estimated?: string
        transaction_count_estimated?: string
        avg_transaction_value_estimated?: string
        estimation_note?: string
    }

    analysis: {
        funnel_stage?: FunnelStage | ''
        potential_level?: PotentialLevel | ''
        financial_level?: CustomerFinancialLevel | ''
        purchase_readiness?: PurchaseReadiness | ''
        tags_input?: string
    }

    acquisition: {
        source?: AcquisitionSource | ''
        source_note?: string
    }
}
