import { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import type { WizardFormValues, WizardMode, WizardTab } from './PartnerWizard.types'

import {
    useQuickEntryPartner,
    useUpdatePartnerAcquisition,
    useUpdatePartnerAnalysis,
    useUpdatePartnerFinancialEstimation,
    useUpdatePartnerIdentity,
    useUpdatePartnerRelationship,
} from '@/features/partners/hooks/usePartnersQueries'

import type { Partner } from '@/features/partners/model/types'
import {
    buildAcquisitionPayload,
    buildAnalysisPayload,
    buildFinancialPayload,
    buildIdentityPayload,
    buildQuickEntryPayload,
    buildRelationshipPayload,
    isWizardIdentityComplete,
} from './partnerWizard.mappers'

function normalizeErrorMessage(err: unknown, fallback: string) {
    // اگر hookهای شما خطا را با شکل خاصی می‌دهند، اینجا بهترش کن
    if (err && typeof err === 'object') {
        const anyErr = err as any
        const msg =
            anyErr?.response?.data?.message ||
            anyErr?.data?.message ||
            anyErr?.message
        if (typeof msg === 'string' && msg.trim()) return msg
    }
    return fallback
}

/* ----------------------------------
 * Hook
 * ---------------------------------- */

type Params = {
    mode: WizardMode
    partner?: Partner | null
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

    const isView = mode === 'view'

    // ✅ MUST persist across re-renders
    const partnerIdRef = useRef<string | null>(partner?.id ?? null)

    // ✅ prevent concurrent create
    const creatingRef = useRef<Promise<string | null> | null>(null)

    // ✅ prevent double finish / autosave overlap
    const [submitting, setSubmitting] = useState(false)

    // ✅ sync when parent changes partner (edit/view)
    useEffect(() => {
        partnerIdRef.current = partner?.id ?? null
        // also clear any in-flight create (defensive)
        creatingRef.current = null
    }, [partner?.id])

    /* -----------------------------
     * Partner creation (ONLY brand_name)
     * ----------------------------- */

    function hasMinimumQuickEntry() {
        return isWizardIdentityComplete(form.getValues().identity)
    }

    async function ensurePartnerId(): Promise<string | null> {
        if (partnerIdRef.current) return partnerIdRef.current
        if (isView) return null
        if (!hasMinimumQuickEntry()) return null

        // ✅ if a create is already running, await it instead of creating again
        if (creatingRef.current) return creatingRef.current

        creatingRef.current = (async () => {
            try {
                const payload = buildQuickEntryPayload(form.getValues())

                const res = await quickEntry.mutateAsync(payload)

                partnerIdRef.current = res.data.id
                toast.success('ذخیره شد')
                return partnerIdRef.current
            } catch (e) {
                toast.error(normalizeErrorMessage(e, 'خطا در ایجاد شریک'))
                return null
            } finally {
                creatingRef.current = null
            }
        })()

        return creatingRef.current
    }

    /* -----------------------------
     * Autosave / Finish
     * ----------------------------- */

    async function autoSave(tab: WizardTab) {
        if (isView) return
        if (submitting) return // ✅ prevent racing with finish
        const id = await ensurePartnerId()
        if (!id) return

        try {
            if (tab === 'identity')
                await updateIdentity.mutateAsync({
                    id,
                    payload: buildIdentityPayload(form.getValues().identity, true),
                })
            if (tab === 'relationship')
                await updateRelationship.mutateAsync({
                    id,
                    payload: buildRelationshipPayload(form.getValues().relationship, true),
                })
            if (tab === 'financial')
                await updateFinancial.mutateAsync({
                    id,
                    payload: buildFinancialPayload(form.getValues().financial_estimation, true),
                })
            if (tab === 'analysis')
                await updateAnalysis.mutateAsync({
                    id,
                    payload: buildAnalysisPayload(form.getValues().analysis, true),
                })
            if (tab === 'acquisition')
                await updateAcquisition.mutateAsync({
                    id,
                    payload: buildAcquisitionPayload(form.getValues().acquisition, true),
                })
        } catch (e) {
            toast.error(normalizeErrorMessage(e, 'خطا در ذخیره اطلاعات'))
        }
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
        if (isView) {
            // در view بهتره finish فقط close کنه
            onClose()
            return
        }

        if (submitting) return
        setSubmitting(true)

        try {
            const id = await ensurePartnerId()
            if (!id) {
                toast.error('نام کسب‌وکار الزامی است')
                return
            }

            const values = form.getValues()

            await updateIdentity.mutateAsync({
                id,
                payload: buildIdentityPayload(values.identity, true),
            })
            await updateRelationship.mutateAsync({
                id,
                payload: buildRelationshipPayload(values.relationship, true),
            })
            await updateFinancial.mutateAsync({
                id,
                payload: buildFinancialPayload(values.financial_estimation, true),
            })
            await updateAnalysis.mutateAsync({
                id,
                payload: buildAnalysisPayload(values.analysis, true),
            })
            await updateAcquisition.mutateAsync({
                id,
                payload: buildAcquisitionPayload(values.acquisition, true),
            })

            toast.success('ذخیره شد')

            // ✅ اول refresh لیست، بعد close
            onFinished?.()
            onClose()
        } catch (e) {
            toast.error(normalizeErrorMessage(e, 'خطا در ذخیره نهایی'))
        } finally {
            setSubmitting(false)
        }
    }

    return {
        finish,
        handleTabChange,
        submitting,
        partnerId: partnerIdRef.current,
    }
}
