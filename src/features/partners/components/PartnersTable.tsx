import { Eye, Pencil, Trash2 } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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

export function PartnersTable({
                                  items,
                                  onView,
                                  onEdit,
                                  onDelete,
                              }: PartnersTableProps) {
    const { t, locale } = useI18n()
    const na = t('common.na')
    const d = (v?: string | number | null) =>
        convertDigitsByLocale(v ?? na, locale)

    return (
        <div className="overflow-hidden rounded-lg border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>نام کسب و کار</TableHead>
                        <TableHead>نام مدیریت</TableHead>
                        <TableHead>نوع کسب‌وکار</TableHead>
                        <TableHead>وضعیت ارتباط</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map((p) => {
                        const id = p.identity
                        const an = p.analysis

                        return (
                            <TableRow key={p.id}>
                                {/* برند */}
                                <TableCell className="font-medium">
                                    {id?.brand_name ?? na}
                                </TableCell>

                                {/* نام مدیر */}
                                <TableCell>
                                    {id?.manager_full_name || '—'}
                                </TableCell>

                                {/* دسته‌بندی */}
                                <TableCell>
                                    {id?.business_type
                                        ? t(`partners.enums.business_type.${id.business_type}`)
                                        : '—'}
                                </TableCell>

                                {/* مرحله قیف */}
                                <TableCell>
                                    {an?.funnel_stage
                                        ? t(`partners.enums.funnel_stage.${an.funnel_stage}`)
                                        : '—'}
                                </TableCell>

                                {/* عملیات */}
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => onView(p)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => onEdit(p)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => onDelete(p)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>

            </Table>
        </div>
    )
}

export default PartnersTable
