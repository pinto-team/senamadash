import { crmClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import type {
    PartnerDetailResponse,
    PartnerListParams,
    PartnerListResponse,
    PartnerPayload,
} from '@/features/partners/model/types'

const ROOT = API_ROUTES.PARTNERS.ROOT
const SEARCH = API_ROUTES.PARTNERS.SEARCH

export const partnersApi = {
    list: (params?: PartnerListParams) =>
        crmClient.get<PartnerListResponse>(ROOT, { params }).then((r) => r.data),

    search: (params?: PartnerListParams) =>
        crmClient.get<PartnerListResponse>(SEARCH, { params }).then((r) => r.data),

    detail: (id: string) =>
        crmClient.get<PartnerDetailResponse>(API_ROUTES.PARTNERS.BY_ID(id)).then((r) => r.data),

    create: (payload: PartnerPayload) =>
        crmClient.post<PartnerDetailResponse>(ROOT, payload).then((r) => r.data),

    update: (id: string, payload: PartnerPayload) =>
        crmClient.put<PartnerDetailResponse>(API_ROUTES.PARTNERS.BY_ID(id), payload).then((r) => r.data),

    remove: (id: string) =>
        crmClient.delete(API_ROUTES.PARTNERS.BY_ID(id)).then((r) => r.data),
}

export type PartnersApi = typeof partnersApi
