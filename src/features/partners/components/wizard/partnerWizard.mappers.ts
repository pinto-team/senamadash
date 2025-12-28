import type {
    Partner,
    PartnerAcquisition,
    PartnerAnalysis,
    PartnerContactNumber,
    PartnerFinancialEstimation,
    PartnerIdentity,
    PartnerQuickEntryPayload,
    PartnerRelationship,
    PartnerSocialLink,
} from '@/features/partners/model/types'
import type { WizardFormValues } from './PartnerWizard.types'
import type { SocialPlatform } from '@/features/partners/model/types'

const PHONE_LABEL_MAP: Record<string, string> = {
    موبایل: 'mobile',
    'تلفن همراه': 'mobile',
    mobile: 'mobile',

    'تلفن ثابت': 'landline',
    landline: 'landline',

    دفتر: 'office',
    office: 'office',

    کارخانه: 'factory',
    انبار: 'warehouse',
    فروش: 'sales',
    پشتیبانی: 'support',
    مدیریت: 'manager',
    حسابداری: 'accounting',
    فکس: 'fax',
}

const SOCIAL_PLATFORM_MAP: Record<string, SocialPlatform> = {
    instagram: 'instagram',
    اینستاگرام: 'instagram',

    telegram: 'telegram',
    تلگرام: 'telegram',

    whatsapp: 'whatsapp',
    واتساپ: 'whatsapp',
}


const isNonEmpty = (value?: string | null): value is string =>
    typeof value === 'string' && value.trim().length > 0

const toNumberOrNull = (value?: string): number | null => {
    if (!isNonEmpty(value)) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

const toIntOrNull = (value?: string): number | null => {
    if (!isNonEmpty(value)) return null
    const n = parseInt(value, 10)
    return Number.isFinite(n) ? n : null
}

const splitTags = (input?: string): string[] | null => {
    if (!isNonEmpty(input)) return null
    const tags = input
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    return tags.length ? tags : null
}

export function toWizardFormValues(partner?: Partner | null): WizardFormValues {
    const id = partner?.identity
    const rel = partner?.relationship
    const fin = partner?.financial_estimation
    const ana = partner?.analysis
    const acq = partner?.acquisition

    return {
        identity: {
            brand_name: id?.brand_name ?? '',
            manager_full_name: id?.manager_full_name ?? '',
            business_type: id?.business_type ?? '',

            contact_numbers:
                id?.contact_numbers?.length
                    ? id.contact_numbers.map((c) => {
                          const normalizedLabel = PHONE_LABEL_MAP[c.label ?? ''] ?? 'other'

                          return {
                              label: normalizedLabel,
                              custom_label: normalizedLabel === 'other' ? c.label ?? '' : '',
                              number: c.number ?? '',
                          }
                      })
                    : [
                          {
                              label: 'mobile',
                              custom_label: '',
                              number: '',
                          },
                      ],

            social_links:
                id?.social_links?.length
                    ? id.social_links.map((s) => {
                        const normalizedPlatform = SOCIAL_PLATFORM_MAP[s.platform]

                        return {
                            platform: normalizedPlatform ?? '',
                            custom_label: normalizedPlatform ? '' : s.platform,
                            url: s.url ?? '',
                        }
                    })
                    : [
                          {
                              platform: 'instagram',
                              custom_label: '',
                              url: '',
                          },
                      ],

            province: id?.province ?? '',
            city: id?.city ?? '',
            full_address: id?.full_address ?? '',
            location_raw: id?.map_link ?? '',
            location: id?.location ?? null,
        },

        relationship: {
            partnership_status: rel?.partnership_status ?? '',
            customer_relationship_level: rel?.customer_relationship_level ?? '',
            customer_satisfaction: rel?.customer_satisfaction ?? '',
            credit_status: rel?.credit_status ?? '',
            payment_types: rel?.payment_types ?? [],
            sensitivity: rel?.sensitivity ?? '',
            preferred_channel: rel?.preferred_channel ?? '',
            notes: rel?.notes ?? '',
        },

        financial_estimation: {
            first_transaction_date: fin?.first_transaction_date ?? '',
            first_transaction_amount_estimated:
                fin?.first_transaction_amount_estimated != null
                    ? String(fin.first_transaction_amount_estimated)
                    : '',
            last_transaction_date: fin?.last_transaction_date ?? '',
            last_transaction_amount_estimated:
                fin?.last_transaction_amount_estimated != null
                    ? String(fin.last_transaction_amount_estimated)
                    : '',
            total_transaction_amount_estimated:
                fin?.total_transaction_amount_estimated != null
                    ? String(fin.total_transaction_amount_estimated)
                    : '',
            transaction_count_estimated:
                fin?.transaction_count_estimated != null
                    ? String(fin.transaction_count_estimated)
                    : '',
            avg_transaction_value_estimated:
                fin?.avg_transaction_value_estimated != null
                    ? String(fin.avg_transaction_value_estimated)
                    : '',
            estimation_note: fin?.estimation_note ?? '',
        },

        analysis: {
            funnel_stage: ana?.funnel_stage ?? '',
            potential_level: ana?.potential_level ?? '',
            financial_level: ana?.financial_level ?? '',
            purchase_readiness: ana?.purchase_readiness ?? '',
            tags_input: Array.isArray(ana?.tags) ? ana.tags.join(', ') : '',
        },

        acquisition: {
            source: acq?.source ?? '',
            source_note: acq?.source_note ?? '',
        },
    }
}

export function buildIdentityPayload(
    values: WizardFormValues['identity'],
    commit: boolean,
): Partial<PartnerIdentity> {
    const contact_numbers: PartnerContactNumber[] | undefined = commit
        ? values.contact_numbers
              ?.filter((c) => isNonEmpty(c.number))
              .map((c) => ({
                  label: c.label,
                  number: c.number!.trim(),
              }))
        : undefined

    const social_links: PartnerSocialLink[] | undefined = commit
        ? values.social_links
              ?.filter((s) => isNonEmpty(s.url))
              .map((s) => ({
                  platform: s.platform ?? '',
                  url: s.url!.trim(),
              }))
        : undefined

    return {
        brand_name: isNonEmpty(values.brand_name) ? values.brand_name.trim() : undefined,
        manager_full_name: isNonEmpty(values.manager_full_name) ? values.manager_full_name.trim() : undefined,
        business_type: values.business_type || undefined,

        contact_numbers,
        social_links,

        province: values.province || undefined,
        city: values.city || undefined,
        full_address: values.full_address || undefined,
        map_link: values.location_raw || (commit ? null : undefined),
        location: values.location ?? undefined,
    }
}

export function buildRelationshipPayload(
    values: WizardFormValues['relationship'],
    commit: boolean,
): Partial<PartnerRelationship> {
    return {
        partnership_status: values.partnership_status || (commit ? null : undefined),
        customer_relationship_level: values.customer_relationship_level || (commit ? null : undefined),
        customer_satisfaction: values.customer_satisfaction || (commit ? null : undefined),
        credit_status: values.credit_status || (commit ? null : undefined),
        payment_types: commit ? values.payment_types : undefined,
        sensitivity: values.sensitivity || (commit ? null : undefined),
        preferred_channel: values.preferred_channel || (commit ? null : undefined),
        notes: values.notes || (commit ? null : undefined),
    }
}

export function buildFinancialPayload(
    values: WizardFormValues['financial_estimation'],
    commit: boolean,
): Partial<PartnerFinancialEstimation> {
    return {
        first_transaction_date: values.first_transaction_date || (commit ? null : undefined),
        first_transaction_amount_estimated: commit
            ? toNumberOrNull(values.first_transaction_amount_estimated)
            : undefined,
        last_transaction_date: values.last_transaction_date || (commit ? null : undefined),
        last_transaction_amount_estimated: commit
            ? toNumberOrNull(values.last_transaction_amount_estimated)
            : undefined,
        total_transaction_amount_estimated: commit
            ? toNumberOrNull(values.total_transaction_amount_estimated)
            : undefined,
        transaction_count_estimated: commit
            ? toIntOrNull(values.transaction_count_estimated)
            : undefined,
        avg_transaction_value_estimated: commit
            ? toNumberOrNull(values.avg_transaction_value_estimated)
            : undefined,
        estimation_note: values.estimation_note || (commit ? null : undefined),
    }
}

export function buildAnalysisPayload(
    values: WizardFormValues['analysis'],
    commit: boolean,
): Partial<PartnerAnalysis> {
    return {
        funnel_stage: values.funnel_stage || (commit ? null : undefined),
        potential_level: values.potential_level || (commit ? null : undefined),
        financial_level: values.financial_level || (commit ? null : undefined),
        purchase_readiness: values.purchase_readiness || (commit ? null : undefined),
        tags: commit ? splitTags(values.tags_input) : undefined,
    }
}

export function buildAcquisitionPayload(
    values: WizardFormValues['acquisition'],
    commit: boolean,
): Partial<PartnerAcquisition> {
    return {
        source: values.source || (commit ? null : undefined),
        source_note: values.source_note || (commit ? null : undefined),
    }
}

export function isWizardIdentityComplete(values: WizardFormValues['identity']): boolean {
    return isNonEmpty(values.brand_name)
}

export function buildQuickEntryPayload(values: WizardFormValues): PartnerQuickEntryPayload {
    const contact_numbers: PartnerContactNumber[] =
        values.identity.contact_numbers
            ?.filter((c) => isNonEmpty(c.number))
            .map((c) => ({
                label: c.label,
                number: c.number!.trim(),
            })) ?? []

    const payload: PartnerQuickEntryPayload = {
        brand_name: values.identity.brand_name.trim(),
        manager_full_name: isNonEmpty(values.identity.manager_full_name)
            ? values.identity.manager_full_name.trim()
            : null,
        business_type: values.identity.business_type || null,
        contact_numbers,
        province: values.identity.province || null,
        city: values.identity.city || null,
        full_address: values.identity.full_address || null,
        location: values.identity.location ?? null,
        notes: isNonEmpty(values.relationship?.notes) ? values.relationship?.notes.trim() : null,
    }

    return payload
}

export { isNonEmpty }
