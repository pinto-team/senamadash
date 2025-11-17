import { useMemo, useState, useEffect } from 'react'
import { Search, FilterX } from 'lucide-react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Pagination from '@/features/partners/components/Pagination.tsx'
import ConfirmDialog from '@/features/partners/components/confirm-dialog.tsx'
import PartnersTable from '@/features/partners/components/PartnersTable'
import PartnerForm from '@/features/partners/components/PartnerForm'
import { PartnerDetailsDrawer } from '@/features/partners/components/PartnerDetailsDrawer'
import { PartnersFiltersSkeleton, PartnersTableSkeleton } from '@/features/partners/components/PartnersSkeletons'
import type { PartnerData, PartnerListParams, PartnerPayload } from '@/features/partners/model/types'
import { usePartnersList, useCreatePartner, useUpdatePartner, useDeletePartner } from '@/features/partners/hooks/usePartnersQueries'
import { useI18n } from '@/shared/hooks/useI18n'
import useDebounced from '@/shared/hooks/useDebounced'
import ErrorFallback from '@/components/layout/ErrorFallback'

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]
const EMPTY_SELECT_VALUE = '__empty__'

type FilterState = {
    business_type: PartnerListParams['business_type'] | ''
    funnel_stage: PartnerListParams['funnel_stage'] | ''
    customer_level: PartnerListParams['customer_level'] | ''
}

const initialFilters: FilterState = {
    business_type: '',
    funnel_stage: '',
    customer_level: '',
}

type PartnerFormFullScreenSheetProps = {
    open: boolean
    title: string
    description: string
    submitting: boolean
    onSubmit: (payload: PartnerPayload) => void
    onClose: () => void
    initialValues?: PartnerData | null
}

function PartnerFormFullScreenSheet({
    open,
    title,
    description,
    submitting,
    onSubmit,
    onClose,
    initialValues,
}: PartnerFormFullScreenSheetProps) {
    return (
        <Sheet open={open} onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
        }}>
            <SheetContent size="full" className="overflow-hidden p-0">
                <div className="flex h-full flex-col bg-background">
                    <div className="border-b px-6 py-4">
                        <SheetHeader className="gap-1 p-0">
                            <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>
                            <SheetDescription className="text-base text-muted-foreground">
                                {description}
                            </SheetDescription>
                        </SheetHeader>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="mx-auto w-full max-w-5xl">
                            <PartnerForm
                                initialValues={initialValues ?? undefined}
                                submitting={submitting}
                                onSubmit={onSubmit}
                                onCancel={onClose}
                            />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default function PartnersManagementPage() {
    const { t } = useI18n()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [filters, setFilters] = useState(initialFilters)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingPartner, setEditingPartner] = useState<PartnerData | null>(null)
    const [viewingPartner, setViewingPartner] = useState<PartnerData | null>(null)
    const [partnerToDelete, setPartnerToDelete] = useState<PartnerData | null>(null)

    const debouncedSearch = useDebounced(search, 400)

    const queryParams = useMemo<PartnerListParams>(() => {
        return {
            page: page + 1,
            limit: pageSize,
            q: debouncedSearch.trim() || undefined,
            business_type: filters.business_type || undefined,
            funnel_stage: filters.funnel_stage || undefined,
            customer_level: filters.customer_level || undefined,
        }
    }, [page, pageSize, debouncedSearch, filters])

    useEffect(() => {
        setPage(0)
    }, [debouncedSearch, filters.business_type, filters.funnel_stage, filters.customer_level, pageSize])

    const listQuery = usePartnersList(queryParams)
    const createMutation = useCreatePartner()
    const updateMutation = useUpdatePartner()
    const deleteMutation = useDeletePartner()

    const items = listQuery.data?.data ?? []
    const pagination = listQuery.data?.meta?.pagination
    const total = pagination?.total ?? items.length
    const totalPagesFromApi = pagination?.total_pages
    const totalPages = useMemo(
        () => Math.max(1, totalPagesFromApi ?? Math.ceil(Math.max(total, 1) / pageSize)),
        [totalPagesFromApi, total, pageSize],
    )

    const hasPrev = pagination?.has_previous ?? page > 0
    const hasNext = pagination?.has_next ?? page + 1 < totalPages

    const businessOptions = useMemo(
        () => ['producer', 'supplier', 'seller', 'other'].map((value) => ({
            value,
            label: t(`partners.enums.business_type.${value}`),
        })),
        [t],
    )

    const funnelOptions = useMemo(
        () => ['prospect', 'lead', 'qualified', 'customer', 'churned'].map((value) => ({
            value,
            label: t(`partners.enums.funnel_stage.${value}`),
        })),
        [t],
    )

    const customerLevelOptions = useMemo(
        () => ['A', 'B', 'C'].map((value) => ({ value, label: t(`partners.enums.customer_level.${value}`) })),
        [t],
    )

    const handleCreateSubmit = (payload: PartnerPayload) => {
        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success(t('partners.saved'))
                setIsCreateOpen(false)
            },
            onError: () => toast.error(t('common.error')),
        })
    }

    const handleEditSubmit = (payload: PartnerPayload) => {
        if (!editingPartner) return
        updateMutation.mutate(
            { id: editingPartner.id, payload },
            {
                onSuccess: () => {
                    toast.success(t('partners.saved'))
                    setEditingPartner(null)
                },
                onError: () => toast.error(t('common.error')),
            },
        )
    }

    const handleDeleteConfirm = () => {
        if (!partnerToDelete) return
        deleteMutation.mutate(partnerToDelete.id, {
            onSuccess: () => {
                toast.success(t('partners.deleted'))
                setPartnerToDelete(null)
            },
            onError: () => toast.error(t('common.error')),
        })
    }

    const clearFilters = () => setFilters(initialFilters)

    const filtersNode = listQuery.isLoading ? (
        <PartnersFiltersSkeleton />
    ) : (
        <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-end">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    value={filters.business_type ?? ''}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            business_type:
                                value === EMPTY_SELECT_VALUE ? '' : (value as PartnerListParams['business_type']),
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t('partners.filters.business_type') as string} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>{t('partners.filters.business_type')}</SelectItem>
                        {businessOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filters.funnel_stage ?? ''}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            funnel_stage:
                                value === EMPTY_SELECT_VALUE ? '' : (value as PartnerListParams['funnel_stage']),
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t('partners.filters.funnel_stage') as string} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>{t('partners.filters.funnel_stage')}</SelectItem>
                        {funnelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filters.customer_level ?? ''}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            customer_level:
                                value === EMPTY_SELECT_VALUE ? '' : (value as PartnerListParams['customer_level']),
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t('partners.filters.customer_level') as string} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>{t('partners.filters.customer_level')}</SelectItem>
                        {customerLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                onView={(partner) => setViewingPartner(partner)}
                onEdit={(partner) => setEditingPartner(partner)}
                onDelete={(partner) => setPartnerToDelete(partner)}
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

    const subtitle = t('partners.subtitle') as string

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-6 py-6">
                <div className="flex flex-col gap-2 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                    <div>
                        <h1 className="text-2xl font-bold">{t('partners.title')}</h1>
                        <p className="text-muted-foreground">{t('partners.subtitle')}</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>{t('partners.create')}</Button>
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

            <PartnerFormFullScreenSheet
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={t('partners.create') as string}
                description={subtitle}
                submitting={createMutation.isPending}
                onSubmit={handleCreateSubmit}
            />

            <PartnerFormFullScreenSheet
                open={!!editingPartner}
                onClose={() => setEditingPartner(null)}
                title={t('partners.edit') as string}
                description={subtitle}
                submitting={updateMutation.isPending}
                onSubmit={handleEditSubmit}
                initialValues={editingPartner}
            />

            <PartnerDetailsDrawer
                partner={viewingPartner}
                open={!!viewingPartner}
                onOpenChange={(open) => {
                    if (!open) setViewingPartner(null)
                }}
            />

            <ConfirmDialog
                open={!!partnerToDelete}
                onOpenChange={(open) => {
                    if (!open) setPartnerToDelete(null)
                }}
                title={t('partners.confirm.delete_title')}
                description={
                    partnerToDelete
                        ? (t('partners.confirm.delete_description', { name: partnerToDelete.brand_name }) as string)
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
