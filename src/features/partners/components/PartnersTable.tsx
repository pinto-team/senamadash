import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { PartnerData } from '@/features/partners/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { convertDigitsByLocale } from '@/shared/i18n/numbers'

interface PartnersTableProps {
    items: PartnerData[]
    onView: (partner: PartnerData) => void
    onEdit: (partner: PartnerData) => void
    onDelete: (partner: PartnerData) => void
}

export function PartnersTable({ items, onView, onEdit, onDelete }: PartnersTableProps) {
    const { t, locale } = useI18n()
    const d = (value: string | number | null | undefined) =>
        convertDigitsByLocale(value ?? '-', locale)

    return (
        <div className="overflow-hidden rounded-lg border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('partners.table.brand_name')}</TableHead>
                        <TableHead>{t('partners.table.manager')}</TableHead>
                        <TableHead>{t('partners.table.business_type')}</TableHead>
                        <TableHead>{t('partners.table.funnel_stage')}</TableHead>
                        <TableHead>{t('partners.table.customer_level')}</TableHead>
                        <TableHead className="text-right">
                            {t('partners.table.total_transaction_amount')}
                        </TableHead>
                        <TableHead>{t('partners.table.last_interaction')}</TableHead>
                        <TableHead className="text-right">{t('partners.table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((partner) => (
                        <TableRow key={partner.id}>
                            <TableCell className="font-medium">{partner.brand_name}</TableCell>
                            <TableCell>{partner.manager_full_name || '-'}</TableCell>
                            <TableCell>
                                {partner.business_type
                                    ? t(`partners.enums.business_type.${partner.business_type}`)
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                {partner.funnel_stage
                                    ? t(`partners.enums.funnel_stage.${partner.funnel_stage}`)
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                {partner.customer_level
                                    ? t(`partners.enums.customer_level.${partner.customer_level}`)
                                    : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                {partner.total_transaction_amount !== null && partner.total_transaction_amount !== undefined
                                    ? d(partner.total_transaction_amount)
                                    : d('-')}
                            </TableCell>
                            <TableCell>{partner.last_interaction ?? '-'}</TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onView(partner)}
                                        aria-label={t('partners.actions.view') as string}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onEdit(partner)}
                                        aria-label={t('partners.actions.edit') as string}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onDelete(partner)}
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
