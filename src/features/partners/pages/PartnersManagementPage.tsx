import { FilterX, Search } from 'lucide-react';
import { toast } from 'sonner';



import { useEffect, useMemo, useState } from 'react';



import DashboardLayout from '@/components/layout/DashboardLayout';
import ErrorFallback from '@/components/layout/ErrorFallback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/features/partners/components/Pagination';
import {
    PartnersFiltersSkeleton,
    PartnersTableSkeleton,
} from '@/features/partners/components/PartnersSkeletons'
import PartnersTable from '@/features/partners/components/PartnersTable'
import ConfirmDialog from '@/features/partners/components/confirm-dialog';
import { useDeletePartner, usePartnerDetail, usePartnersList } from '@/features/partners/hooks/usePartnersQueries';
import type { AcquisitionSource, BusinessType, FunnelStage, Partner, PartnerListParams } from '@/features/partners/model/types';
import useDebounced from '@/shared/hooks/useDebounced';
import { useI18n } from '@/shared/hooks/useI18n';
import { PartnerWizardSheet } from '@/features/partners/components/wizard/PartnerWizardSheet.tsx'





const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]
const EMPTY_SELECT_VALUE = '__empty__'

type FilterState = {
    business_type: BusinessType | ''
    funnel_stage: FunnelStage | ''
    acquisition_source: AcquisitionSource | ''
    province: string
    city: string
}

const initialFilters: FilterState = {
    business_type: '',
    funnel_stage: '',
    acquisition_source: '',
    province: '',
    city: '',
}

type SheetMode = 'create' | 'edit' | 'view' | null

export function PartnersManagementPage() {
    const { t } = useI18n()

    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounced(search, 400)

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [filters, setFilters] = useState<FilterState>(initialFilters)

    const [sheetMode, setSheetMode] = useState<SheetMode>(null)
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

    const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null)

    // NOTE:
    // اگر بکند شما پارامتر q را پشتیبانی نمی‌کند، این فیلد را در PartnerListParams اضافه کنید
    // یا این قسمت را به فیلترهای رسمی مثل tag/province/city تغییر بدهید.
    const queryParams = useMemo(() => {
        const params: any = {
            page: page + 1,
            limit: pageSize,

            business_type: filters.business_type || undefined,
            funnel_stage: filters.funnel_stage || undefined,
            acquisition_source: filters.acquisition_source || undefined,
            province: filters.province.trim() || undefined,
            city: filters.city.trim() || undefined,
        }

        const q = debouncedSearch.trim()
        if (q) params.q = q

        return params as PartnerListParams
    }, [page, pageSize, filters, debouncedSearch])

    useEffect(() => {
        setPage(0)
    }, [
        debouncedSearch,
        pageSize,
        filters.business_type,
        filters.funnel_stage,
        filters.acquisition_source,
        filters.province,
        filters.city,
    ])

    const listQuery = usePartnersList(queryParams)
    const deleteMutation = useDeletePartner()

    const items = listQuery.data?.data ?? []
    const pagination = listQuery.data?.meta?.pagination
    const total = pagination?.total ?? items.length
    const totalPagesFromApi = pagination?.total_pages
    const totalPages = Math.max(
        1,
        totalPagesFromApi ?? Math.ceil(Math.max(total, 1) / pageSize),
    )

    const hasPrev = pagination?.has_previous ?? page > 0
    const hasNext = pagination?.has_next ?? page + 1 < totalPages

    const businessOptions = useMemo(
        () =>
            (['furniture_showroom', 'furniture_manufacturer', 'furniture_distributor'] as BusinessType[]).map((value) => ({
                value,
                label: t(`partners.enums.business_type.${value}`),
            })),
        [t],
    )

    const funnelOptions = useMemo(
        () =>
            (['prospect', 'lead', 'qualified', 'customer', 'churned'] as FunnelStage[]).map((value) => ({
                value,
                label: t(`partners.enums.funnel_stage.${value}`),
            })),
        [t],
    )

    const acquisitionOptions = useMemo(
        () =>
            (['marketing', 'self_search', 'referral', 'instagram', 'google', 'advertising', 'other'] as AcquisitionSource[]).map(
                (value) => ({
                    value,
                    label: t(`partners.enums.acquisition_source.${value}`),
                }),
            ),
        [t],
    )

    const selectedId = selectedPartner?.id
    const detailQuery = usePartnerDetail(selectedId)
    const sheetPartner = detailQuery.data?.data ?? selectedPartner

    const clearFilters = () => setFilters(initialFilters)

    const openCreate = () => {
        setSelectedPartner(null)
        setSheetMode('create')
    }

    const openView = (partner: Partner) => {
        setSelectedPartner(partner)
        setSheetMode('view')
    }

    const openEdit = (partner: Partner) => {
        setSelectedPartner(partner)
        setSheetMode('edit')
    }

    const closeSheet = () => {
        setSheetMode(null)
        setSelectedPartner(null)
    }

    const onFinished = () => {
        // بعد از Finish یا Delete داخل Sheet
        listQuery.refetch()
    }

    const handleDeleteConfirm = () => {
        if (!partnerToDelete) return
        deleteMutation.mutate(partnerToDelete.id, {
            onSuccess: () => {
                toast.success(t('partners.deleted'))
                setPartnerToDelete(null)
                listQuery.refetch()
            },
            onError: () => toast.error(t('common.error')),
        })
    }

    const filtersNode = listQuery.isLoading ? (
        <PartnersFiltersSkeleton />
    ) : (
        <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-end">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        value={search}
                        placeholder={t('partners.search_placeholder') as string}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </div>

            <div className="grid flex-1 gap-3 md:grid-cols-3">
                <Select
                    value={filters.business_type || ''}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            business_type: value === EMPTY_SELECT_VALUE ? '' : (value as BusinessType),
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t('partners.filters.business_type') as string} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>{t('partners.filters.business_type')}</SelectItem>
                        {businessOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.funnel_stage || ''}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            funnel_stage: value === EMPTY_SELECT_VALUE ? '' : (value as FunnelStage),
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t('partners.filters.funnel_stage') as string} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>{t('partners.filters.funnel_stage')}</SelectItem>
                        {funnelOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.acquisition_source || ''}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            acquisition_source: value === EMPTY_SELECT_VALUE ? '' : (value as AcquisitionSource),
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t('partners.filters.acquisition_source') as string} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>{t('partners.filters.acquisition_source')}</SelectItem>
                        {acquisitionOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button type="button" variant="outline" onClick={clearFilters} className="md:w-auto">
                <FilterX className="mr-2 h-4 w-4" /> {t('partners.filters.clear')}
            </Button>
        </div>
    )

    const renderTable = () => {
        if (listQuery.isError) {
            return <ErrorFallback error={listQuery.error} onRetry={() => listQuery.refetch()} />
        }
        if (listQuery.isLoading) return <PartnersTableSkeleton />
        if (items.length === 0) {
            return (
                <div className="rounded-lg border bg-muted/10 p-10 text-center text-sm text-muted-foreground">
                    {t('common.no_results')}
                </div>
            )
        }

        return (
            <PartnersTable
                items={items}
                onView={openView}
                onEdit={openEdit}
                onDelete={(p) => setPartnerToDelete(p)}
            />
        )
    }

    const paginationNode =
        listQuery.isLoading || items.length === 0 ? null : (
            <Pagination
                page={page}
                pages={totalPages}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onFirst={() => setPage(0)}
                onPrev={() => setPage((prev) => Math.max(0, prev - 1))}
                onNext={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                onLast={() => setPage(Math.max(0, totalPages - 1))}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageSizeChange={setPageSize}
                disabled={listQuery.isFetching}
                labels={{
                    first: t('pagination.first') as string,
                    prev: t('pagination.prev') as string,
                    next: t('pagination.next') as string,
                    last: t('pagination.last') as string,
                    rowsPerPage: t('pagination.rowsPerPage') as string,
                    page: t('pagination.page') as string,
                    of: t('pagination.of') as string,
                }}
            />
        )

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-6 py-6">
                <div className="flex flex-col gap-2 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                    <div>
                        <h1 className="text-2xl font-bold">{t('partners.title')}</h1>
                        <p className="text-muted-foreground">{t('partners.subtitle')}</p>
                    </div>
                    <Button onClick={openCreate}>{t('partners.create')}</Button>
                </div>

                <div className="px-4 lg:px-6">{filtersNode}</div>

                <div className="px-4 lg:px-6">
                    <div className={listQuery.isFetching ? 'relative' : ''}>
                        {listQuery.isFetching && !listQuery.isLoading ? (
                            <div className="absolute inset-0 rounded-lg bg-background/40" />
                        ) : null}
                        {renderTable()}
                    </div>
                </div>

                {paginationNode && <div className="px-4 lg:px-6">{paginationNode}</div>}
            </div>

            {/* Create / Edit / View */}
            <PartnerWizardSheet
                open={sheetMode !== null}
                mode={(sheetMode ?? 'create') as any}
                partner={sheetMode === 'create' ? null : sheetPartner}
                onClose={closeSheet}
                onFinished={onFinished}
            />

            {/* Delete from table */}
            <ConfirmDialog
                open={!!partnerToDelete}
                onOpenChange={(o) => {
                    if (!o) setPartnerToDelete(null)
                }}
                title={t('partners.confirm.delete_title')}
                description={
                    partnerToDelete
                        ? (t('partners.confirm.delete_description', {
                            name: partnerToDelete.identity?.brand_name ?? '',
                        }) as string)
                        : ''
                }
                cancelLabel={t('partners.form.cancel') as string}
                confirmLabel={t('partners.actions.delete') as string}
                onConfirm={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
            />
        </DashboardLayout>
    )
}
