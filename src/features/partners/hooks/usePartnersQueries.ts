import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { partnersApi } from '@/features/partners/services/partners.api'
import type { PartnerListParams, PartnerPayload } from '@/features/partners/model/types'

const queryKeys = {
    all: ['partners'] as const,
    list: (params?: PartnerListParams) => ['partners', 'list', params ? JSON.stringify(params) : ''] as const,
    detail: (id?: string) => ['partners', 'detail', id] as const,
}

export function usePartnersList(params?: PartnerListParams) {
    const key = useMemo(() => queryKeys.list(params), [params])

    return useQuery({
        queryKey: key,
        queryFn: () => {
            const hasQuery = !!params?.q?.trim()
            return hasQuery ? partnersApi.search(params) : partnersApi.list(params)
        },
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

export function useCreatePartner() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: PartnerPayload) => partnersApi.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
        },
    })
}

export function useUpdatePartner() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: PartnerPayload }) => partnersApi.update(id, payload),
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
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: queryKeys.all })
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
        },
    })
}
