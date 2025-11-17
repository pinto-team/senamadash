import type { ApiResponse, Pagination } from '@/shared/api/types'

export type PartnerBusinessType = 'producer' | 'supplier' | 'seller' | 'other'
export type PartnerCreditStatus = 'good' | 'normal' | 'bad' | null
export type PartnerPartnershipStatus = 'past' | 'present' | 'future' | null
export type PartnerPotential = 'low' | 'medium' | 'high' | null
export type PartnerPaymentType = 'cash' | 'cheque' | 'credit' | null
export type PartnerSensitivity = 'price' | 'quality' | 'speed' | 'brand' | 'other' | null
export type PartnerPreferredChannel =
    | 'phone'
    | 'whatsapp'
    | 'instagram'
    | 'telegram'
    | 'email'
    | 'in_person'
    | 'other'
    | null
export type PartnerFunnelStage = 'prospect' | 'lead' | 'qualified' | 'customer' | 'churned' | null
export type PartnerCustomerLevel = 'A' | 'B' | 'C' | null

export interface PartnerContactNumber {
    label: string | null
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

export interface PartnerData {
    id: string
    brand_name: string
    manager_full_name: string
    contact_numbers: PartnerContactNumber[]
    social_links: PartnerSocialLink[]
    business_type: PartnerBusinessType
    category: string | null
    sub_category: string | null
    tags: string[]
    address: string | null
    location: PartnerLocation | null
    first_transaction_date: string | null
    first_transaction_amount: number | null
    last_transaction_date: string | null
    last_transaction_amount: number | null
    total_transaction_amount: number | null
    transaction_count: number | null
    avg_transaction_value: number | null
    credit_status: PartnerCreditStatus
    purchased_products: string[]
    partnership_status: PartnerPartnershipStatus
    last_interaction: string | null
    interest_level: number | null
    potential: PartnerPotential
    current_contract: string | null
    purchase_probability: number | null
    team_size: number | null
    satisfaction: number | null
    payment_type: PartnerPaymentType
    sensitivity: PartnerSensitivity
    preferred_channel: PartnerPreferredChannel
    funnel_stage: PartnerFunnelStage
    how_found: string | null
    customer_type: string | null
    customer_level: PartnerCustomerLevel
    notes: string | null
}

export type PartnerPayload = Omit<PartnerData, 'id'>

export interface PartnerListParams {
    page?: number
    limit?: number
    q?: string
    business_type?: PartnerBusinessType
    funnel_stage?: PartnerFunnelStage
    customer_level?: PartnerCustomerLevel
}

export type PartnerListResponse = ApiResponse<PartnerData[]> & {
    meta: ApiResponse['meta'] & { pagination?: Pagination }
}

export type PartnerDetailResponse = ApiResponse<PartnerData>
