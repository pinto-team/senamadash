import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import type { WizardFormValues, WizardMode, WizardTab } from './PartnerWizard.types'

import {
    useDeletePartner,
    useQuickEntryPartner,
    useUpdatePartnerAcquisition,
    useUpdatePartnerAnalysis,
    useUpdatePartnerFinancialEstimation,
    useUpdatePartnerIdentity,
    useUpdatePartnerRelationship,
} from '@/features/partners/hooks/usePartnersQueries'

import type {
    PartnerAcquisition,
    PartnerAnalysis,
    PartnerFinancialEstimation,
    PartnerIdentity,
    PartnerQuickEntryPayload,
    PartnerRelationship,
    PartnerContactNumber,
    PartnerSocialLink,
} from '@/features/partners/model/types'

/* ----------------------------------
 * Helpers
 * ---------------------------------- */

const isNonEmpty = (v?: string | null): v is string =>
    typeof v === 'string' && v.trim().length > 0

const toNumberOrNull = (v?: string): number | null => {
    if (!isNonEmpty(v)) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
}

const toIntOrNull = (v?: string): number | null => {
    if (!isNonEmpty(v)) return null
    const n = parseInt(v, 10)
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

/* ----------------------------------
 * Hook
 * ---------------------------------- */

type Params = {
    mode: WizardMode
    partner?: any
    form: UseFormReturn<WizardFormValues>
    onClose: () => void
    onFinished?: () => void
}

export function usePartnerWizardLogic({
                                          mode,
                                          partner,
                                          form,
                                          onClose,
                                          onFinished,
                                      }: Params) {
    const quickEntry = useQuickEntryPartner()
    const updateIdentity = useUpdatePartnerIdentity()
    const updateRelationship = useUpdatePartnerRelationship()
    const updateFinancial = useUpdatePartnerFinancialEstimation()
    const updateAnalysis = useUpdatePartnerAnalysis()
    const updateAcquisition = useUpdatePartnerAcquisition()
    const deletePartner = useDeletePartner()

    const isView = mode === 'view'
    let partnerId: string | null = partner?.id ?? null

    /* -----------------------------
     * Partner creation (ONLY brand_name)
     * ----------------------------- */

    function hasMinimumQuickEntry() {
        const v = form.getValues().identity
        return isNonEmpty(v.brand_name)
    }

    async function ensurePartnerId(): Promise<string | null> {
        if (partnerId) return partnerId
        if (isView) return null
        if (!hasMinimumQuickEntry()) return null

        const v = form.getValues().identity

        const contact_numbers: PartnerContactNumber[] =
            v.contact_numbers
                ?.filter((c) => isNonEmpty(c.number))
                .map((c) => ({
                    label: c.label,
                    number: c.number!.trim(), // ✅ safe after filter
                })) ?? []

        const payload: PartnerQuickEntryPayload = {
            brand_name: v.brand_name.trim(),
            manager_full_name: isNonEmpty(v.manager_full_name)
                ? v.manager_full_name.trim()
                : null,
            business_type: v.business_type || null,
            contact_numbers,
            province: v.province || null,
            city: v.city || null,
            location: v.location ?? null,
            notes: v.notes || null,
        }

        const res = await quickEntry.mutateAsync(payload)
        partnerId = res.data.id
        toast.success('ذخیره شد')
        return partnerId
    }

    /* -----------------------------
     * Payload builders
     * ----------------------------- */

    function buildIdentityPayload(commit: boolean): Partial<PartnerIdentity> {
        const v = form.getValues().identity

        const contact_numbers: PartnerContactNumber[] | undefined = commit
            ? v.contact_numbers
                ?.filter((c) => isNonEmpty(c.number))
                .map((c) => ({
                    label: c.label,
                    number: c.number!.trim(),
                }))
            : undefined

        const social_links: PartnerSocialLink[] | undefined = commit
            ? v.social_links
                ?.filter((s) => isNonEmpty(s.url))
                .map((s) => ({
                    platform: s.platform as any,
                    url: s.url!.trim(),
                }))
            : undefined

        return {
            brand_name: isNonEmpty(v.brand_name) ? v.brand_name.trim() : undefined,
            manager_full_name: isNonEmpty(v.manager_full_name)
                ? v.manager_full_name.trim()
                : undefined,
            business_type: v.business_type || undefined,

            contact_numbers,
            social_links,

            province: v.province || undefined,
            city: v.city || undefined,
            full_address: v.address_details || undefined,
            location: v.location ?? undefined,
        }
    }

    function buildRelationshipPayload(commit: boolean): Partial<PartnerRelationship> {
        const v = form.getValues().relationship
        return {
            partnership_status: v.partnership_status || (commit ? null : undefined),
            customer_relationship_level:
                v.customer_relationship_level || (commit ? null : undefined),
            customer_satisfaction: v.customer_satisfaction || (commit ? null : undefined),
            credit_status: v.credit_status || (commit ? null : undefined),
            payment_types: commit ? v.payment_types : undefined,
            sensitivity: v.sensitivity || (commit ? null : undefined),
            preferred_channel: v.preferred_channel || (commit ? null : undefined),
            notes: v.notes || (commit ? null : undefined),
        }
    }

    function buildFinancialPayload(commit: boolean): Partial<PartnerFinancialEstimation> {
        const v = form.getValues().financial_estimation
        return {
            first_transaction_date: v.first_transaction_date || (commit ? null : undefined),
            first_transaction_amount_estimated: commit
                ? toNumberOrNull(v.first_transaction_amount_estimated)
                : undefined,
            last_transaction_date: v.last_transaction_date || (commit ? null : undefined),
            last_transaction_amount_estimated: commit
                ? toNumberOrNull(v.last_transaction_amount_estimated)
                : undefined,
            total_transaction_amount_estimated: commit
                ? toNumberOrNull(v.total_transaction_amount_estimated)
                : undefined,
            transaction_count_estimated: commit
                ? toIntOrNull(v.transaction_count_estimated)
                : undefined,
            avg_transaction_value_estimated: commit
                ? toNumberOrNull(v.avg_transaction_value_estimated)
                : undefined,
            estimation_note: v.estimation_note || (commit ? null : undefined),
        }
    }

    function buildAnalysisPayload(commit: boolean): Partial<PartnerAnalysis> {
        const v = form.getValues().analysis
        return {
            funnel_stage: v.funnel_stage || (commit ? null : undefined),
            potential_level: v.potential_level || (commit ? null : undefined),
            financial_level: v.financial_level || (commit ? null : undefined),
            purchase_readiness: v.purchase_readiness || (commit ? null : undefined),
            tags: commit ? splitTags(v.tags_input) : undefined,
        }
    }

    function buildAcquisitionPayload(commit: boolean): Partial<PartnerAcquisition> {
        const v = form.getValues().acquisition
        return {
            source: v.source || (commit ? null : undefined),
            source_note: v.source_note || (commit ? null : undefined),
        }
    }

    /* -----------------------------
     * Autosave / Finish
     * ----------------------------- */

    async function autoSave(tab: WizardTab) {
        if (isView) return
        const id = await ensurePartnerId()
        if (!id) return

        if (tab === 'identity')
            await updateIdentity.mutateAsync({ id, payload: buildIdentityPayload(true) })
        if (tab === 'relationship')
            await updateRelationship.mutateAsync({
                id,
                payload: buildRelationshipPayload(true),
            })
        if (tab === 'financial')
            await updateFinancial.mutateAsync({
                id,
                payload: buildFinancialPayload(true),
            })
        if (tab === 'analysis')
            await updateAnalysis.mutateAsync({
                id,
                payload: buildAnalysisPayload(true),
            })
        if (tab === 'acquisition')
            await updateAcquisition.mutateAsync({
                id,
                payload: buildAcquisitionPayload(true),
            })
    }

    async function handleTabChange(
        next: WizardTab,
        current: WizardTab,
        setTab: (t: WizardTab) => void,
    ) {
        await autoSave(current)
        setTab(next)
    }

    async function finish() {
        const id = await ensurePartnerId()
        if (!id) return toast.error('نام کسب‌وکار الزامی است')

        await updateIdentity.mutateAsync({ id, payload: buildIdentityPayload(true) })
        await updateRelationship.mutateAsync({
            id,
            payload: buildRelationshipPayload(true),
        })
        await updateFinancial.mutateAsync({
            id,
            payload: buildFinancialPayload(true),
        })
        await updateAnalysis.mutateAsync({
            id,
            payload: buildAnalysisPayload(true),
        })
        await updateAcquisition.mutateAsync({
            id,
            payload: buildAcquisitionPayload(true),
        })

        toast.success('ذخیره شد')
        onClose()
        onFinished?.()
    }

    return {
        finish,
        handleTabChange,
    }
}
