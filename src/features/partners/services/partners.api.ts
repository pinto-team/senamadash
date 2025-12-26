import { crmClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import type {
    PartnerDetailResponse,
    PartnerListParams,
    PartnerListResponse,
    PartnerQuickEntryPayload,
    PartnerIdentity,
    PartnerRelationship,
    PartnerFinancialEstimation,
    PartnerAnalysis,
    PartnerAcquisition,
} from '@/features/partners/model/types'

export const partnersApi = {
    list: (params?: PartnerListParams) =>
        crmClient.get<PartnerListResponse>(API_ROUTES.PARTNERS.ROOT, { params }).then((r) => r.data),

    detail: (id: string) =>
        crmClient.get<PartnerDetailResponse>(API_ROUTES.PARTNERS.BY_ID(id)).then((r) => r.data),

    // Create (identity minimal)
    quickEntry: (payload: PartnerQuickEntryPayload) =>
        crmClient.post<PartnerDetailResponse>(API_ROUTES.PARTNERS.QUICK_ENTRY, payload).then((r) => r.data),

    // Edit identity (needed for full edit)
    updateIdentity: (id: string, payload: Partial<PartnerIdentity>) =>
        crmClient.patch<PartnerDetailResponse>(API_ROUTES.PARTNERS.IDENTITY(id), payload).then((r) => r.data),

    updateRelationship: (id: string, payload: Partial<PartnerRelationship>) =>
        crmClient.patch<PartnerDetailResponse>(API_ROUTES.PARTNERS.RELATIONSHIP(id), payload).then((r) => r.data),

    updateFinancialEstimation: (id: string, payload: Partial<PartnerFinancialEstimation>) =>
        crmClient.patch<PartnerDetailResponse>(API_ROUTES.PARTNERS.FINANCIAL_ESTIMATION(id), payload).then((r) => r.data),

    updateAnalysis: (id: string, payload: Partial<PartnerAnalysis>) =>
        crmClient.patch<PartnerDetailResponse>(API_ROUTES.PARTNERS.ANALYSIS(id), payload).then((r) => r.data),

    updateAcquisition: (id: string, payload: Partial<PartnerAcquisition>) =>
        crmClient.patch<PartnerDetailResponse>(API_ROUTES.PARTNERS.ACQUISITION(id), payload).then((r) => r.data),

    // Delete
    remove: (id: string) =>
        crmClient.delete(API_ROUTES.PARTNERS.BY_ID(id)).then((r) => r.data),
}

export type PartnersApi = typeof partnersApi
