import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



import { useMemo } from 'react';



import type {
    PartnerAcquisition,
    PartnerAnalysis,
    PartnerFinancialEstimation,
    PartnerIdentity,
    PartnerListParams,
    PartnerQuickEntryPayload,
    PartnerRelationship,
} from '@/features/partners/model/types'
import { partnersApi } from '@/features/partners/services/partners.api'

function stableParamsKey(params?: PartnerListParams) {
    if (!params) return ''
    const sorted = Object.keys(params)
        .sort()
        .reduce(
            (acc, key) => {
                // @ts-expect-error dynamic key
                acc[key] = params[key]
                return acc
            },
            {} as Record<string, unknown>,
        )
    return JSON.stringify(sorted)
}

const queryKeys = {
    all: ['partners'] as const,
    list: (params?: PartnerListParams) => ['partners', 'list', stableParamsKey(params)] as const,
    detail: (id?: string) => ['partners', 'detail', id] as const,
}

export function usePartnersList(params?: PartnerListParams) {
    const key = useMemo(() => queryKeys.list(params), [params])
    return useQuery({
        queryKey: key,
        queryFn: () => partnersApi.list(params),
        placeholderData: (prev) => prev,
    })
}

export function usePartnerDetail(id?: string) {
    return useQuery({
        queryKey: queryKeys.detail(id),
        queryFn: () => (id ? partnersApi.detail(id) : Promise.reject('missing-id')),
        enabled: !!id,
    })
}

export function useQuickEntryPartner() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: PartnerQuickEntryPayload) => partnersApi.quickEntry(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
        },
    })
}

export function useUpdatePartnerRelationship() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<PartnerRelationship> }) =>
            partnersApi.updateRelationship(id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
        },
    })
}

export function useUpdatePartnerFinancialEstimation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<PartnerFinancialEstimation> }) =>
            partnersApi.updateFinancialEstimation(id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
        },
    })
}

export function useUpdatePartnerAnalysis() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<PartnerAnalysis> }) =>
            partnersApi.updateAnalysis(id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
        },
    })
}

export function useUpdatePartnerAcquisition() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<PartnerAcquisition> }) =>
            partnersApi.updateAcquisition(id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
        },
    })
}

export function useUpdatePartnerIdentity() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<PartnerIdentity> }) =>
            partnersApi.updateIdentity(id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
        },
    })
}

export function useDeletePartner() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => partnersApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
        },
    })
}
