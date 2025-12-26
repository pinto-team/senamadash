import type { ApiResponse, Pagination } from '@/shared/api/types'

/** enums مطابق backend */
export type BusinessType =
    | 'furniture_showroom'
    | 'furniture_manufacturer'
    | 'furniture_distributor'

export type FunnelStage = 'prospect' | 'lead' | 'qualified' | 'customer' | 'churned'
export type PotentialLevel = 'low' | 'medium' | 'high'
export type PurchaseReadiness = 'low' | 'medium' | 'high'
export type CustomerFinancialLevel = 'strong' | 'medium' | 'weak'

export type PartnershipStatus = 'past' | 'present' | 'future'
export type CustomerRelationshipLevel = 'engaged' | 'normal' | 'indifferent'
export type CustomerSatisfaction = 'satisfied' | 'neutral' | 'dissatisfied'
export type CreditStatus = 'good' | 'normal' | 'bad'
export type PaymentType = 'cash' | 'cheque' | 'credit'
export type SensitivityType = 'price' | 'quality' | 'speed' | 'brand' | 'other'

export type SocialPlatform =
    | 'instagram'
    | 'telegram'
    | 'whatsapp'
    | 'website'
    | 'rubika'
    | 'bale'
    | 'eitaa'
    | 'other'

export type AcquisitionSource =
    | 'marketing'
    | 'self_search'
    | 'referral'
    | 'instagram'
    | 'google'
    | 'advertising'
    | 'other'

export interface PartnerContactNumber {
    label?: string | null
    number: string
}

export interface PartnerSocialLink {
    platform: string
    url: string
}

export interface PartnerLocation {
    latitude: number
    longitude: number
}

/** sections */
export interface PartnerIdentity {
    brand_name: string | null
    manager_full_name?: string | null
    business_type?: BusinessType | null
    contact_numbers: PartnerContactNumber[]
    social_links?: PartnerSocialLink[]
    province?: string | null
    city?: string | null
    full_address?: string | null
    location?: PartnerLocation | null
}

export interface PartnerRelationship {
    partnership_status?: PartnershipStatus | null
    customer_relationship_level?: CustomerRelationshipLevel | null
    customer_satisfaction?: CustomerSatisfaction | null
    credit_status?: CreditStatus | null
    payment_types?: PaymentType[] | null
    sensitivity?: SensitivityType | null
    preferred_channel?: SocialPlatform | null
    notes?: string | null
}

export interface PartnerFinancialEstimation {
    first_transaction_date?: string | null
    first_transaction_amount_estimated?: number | null
    last_transaction_date?: string | null
    last_transaction_amount_estimated?: number | null
    total_transaction_amount_estimated?: number | null
    transaction_count_estimated?: number | null
    avg_transaction_value_estimated?: number | null
    estimation_note?: string | null
}

export interface PartnerAnalysis {
    funnel_stage?: FunnelStage | null
    potential_level?: PotentialLevel | null
    financial_level?: CustomerFinancialLevel | null
    purchase_readiness?: PurchaseReadiness | null
    tags?: string[] | null
}

export interface PartnerAcquisition {
    source?: AcquisitionSource | null
    source_note?: string | null
}

export interface PartnerMeta {
    created_at?: string
    updated_at?: string
    created_by?: string
}

/** entity */
export interface Partner {
    id: string
    identity: PartnerIdentity
    relationship?: PartnerRelationship
    financial_estimation?: PartnerFinancialEstimation
    analysis?: PartnerAnalysis
    acquisition?: PartnerAcquisition
    meta?: PartnerMeta
}

/** list query params مطابق backend */
export interface PartnerListParams {
    funnel_stage?: FunnelStage | null
    business_type?: BusinessType | null
    financial_level?: CustomerFinancialLevel | null
    purchase_readiness?: PurchaseReadiness | null
    potential_level?: PotentialLevel | null
    acquisition_source?: AcquisitionSource | null
    province?: string | null
    city?: string | null
    tag?: string | null
    page?: number
    limit?: number
}

export type PartnerListResponse = ApiResponse<Partner[]> & {
    meta: ApiResponse['meta'] & { pagination?: Pagination }
}

export type PartnerDetailResponse = ApiResponse<Partner>

/** quick-entry payload (برای ساخت) */
export type PartnerQuickEntryPayload = Pick<
    PartnerIdentity,
    'brand_name' | 'manager_full_name' | 'business_type' | 'contact_numbers' | 'province' | 'city' | 'location'
> & { notes?: string | null }
