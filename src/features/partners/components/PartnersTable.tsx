import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Partner } from '@/features/partners/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { convertDigitsByLocale } from '@/shared/i18n/numbers'

interface PartnersTableProps {
    items: Partner[]
    onView: (partner: Partner) => void
    onEdit: (partner: Partner) => void
    onDelete: (partner: Partner) => void
}

export function PartnersTable({ items, onView, onEdit, onDelete }: PartnersTableProps) {
    const { t, locale } = useI18n()
    const na = t('common.na')
    const d = (value: string | number | null | undefined) => convertDigitsByLocale(value ?? na, locale)

    return (
        <div className="overflow-hidden rounded-lg border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('partners.table.brand_name')}</TableHead>
                        <TableHead>{t('partners.table.manager')}</TableHead>
                        <TableHead>{t('partners.table.business_type')}</TableHead>
                        <TableHead>{t('partners.table.funnel_stage')}</TableHead>
                        <TableHead>{t('partners.table.acquisition_source')}</TableHead>
                        <TableHead className="text-right">{t('partners.table.total_transaction_amount')}</TableHead>
                        <TableHead>{t('partners.table.last_transaction_date')}</TableHead>
                        <TableHead className="text-right">{t('partners.table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.identity?.brand_name ?? na}</TableCell>
                            <TableCell>{p.identity?.manager_full_name || na}</TableCell>

                            <TableCell>
                                {p.identity?.business_type ? t(`partners.enums.business_type.${p.identity.business_type}`) : na}
                            </TableCell>

                            <TableCell>
                                {p.analysis?.funnel_stage ? t(`partners.enums.funnel_stage.${p.analysis.funnel_stage}`) : na}
                            </TableCell>

                            <TableCell>
                                {p.acquisition?.source ? t(`partners.enums.acquisition_source.${p.acquisition.source}`) : na}
                            </TableCell>

                            <TableCell className="text-right">
                                {d(p.financial_estimation?.total_transaction_amount_estimated ?? null)}
                            </TableCell>

                            <TableCell>{d(p.financial_estimation?.last_transaction_date ?? null)}</TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onView(p)}
                                        aria-label={t('partners.actions.view') as string}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onEdit(p)}
                                        aria-label={t('partners.actions.edit') as string}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onDelete(p)}
                                        aria-label={t('partners.actions.delete') as string}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default PartnersTable
