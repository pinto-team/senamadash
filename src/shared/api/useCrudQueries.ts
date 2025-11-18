import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from './types'

export function createCrudHooks<TData, TCreate, TUpdate>(
    key: string,
    api: ReturnType<typeof import('./crudFactory').createCrudApi<TData, TCreate, TUpdate>>,
) {
    return {

        useList: (params?: unknown) =>
            useQuery({
                queryKey: [key, 'list', params ? JSON.stringify(params) : undefined],
                queryFn: () => api.list(params),
            }),

        useDetail: (id: string | number) =>
            useQuery({
                queryKey: [key, 'detail', id],
                queryFn: () => api.detail(id),
                enabled: !!id,
            }),

        useCreate: () => {
            const qc = useQueryClient()
            return useMutation({
                // mutationFn باید تنها یک پارامتر بگیرد
                mutationFn: (payload: TCreate) => api.create(payload),

                onSuccess: (data) => {
                    qc.invalidateQueries({ queryKey: [key, 'list'] })
                    const id = (data as any)?.data?.id
                    if (id !== undefined && id !== null) {
                        qc.invalidateQueries({ queryKey: [key, 'detail', id] })
                    }
                },
            })
        },

        useUpdate: () => {
            const qc = useQueryClient()
            return useMutation({
                mutationFn: ({ id, payload }: { id: string | number; payload: TUpdate }) =>
                    api.update(id, payload),
                onSuccess: (_, { id }) => {
                    qc.invalidateQueries({ queryKey: [key, 'list'] })
                    qc.invalidateQueries({ queryKey: [key, 'detail', id] })
                },
            })
        },

        useDelete: () => {
            const qc = useQueryClient()
            return useMutation<ApiResponse<void>, AxiosError<ApiResponse<unknown>>, string | number>({
                // mutationFn باید فقط (id) بگیرد
                mutationFn: (id: string | number) => api.remove(id),

                onSuccess: (_, id) => {
                    qc.invalidateQueries({ queryKey: [key, 'list'] })
                    qc.invalidateQueries({ queryKey: [key, 'detail', id] })
                },
            })
        },
    }
}
