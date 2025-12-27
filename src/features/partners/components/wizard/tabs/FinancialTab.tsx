import { Controller, UseFormReturn } from 'react-hook-form'
import { useEffect } from 'react'

import { TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

import { MoneyInput } from '@/features/partners/components/form/MoneyInput'
import { LabeledField } from '@/features/partners/components/form/LabeledField'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'

/* ===============================
 * Shamsi helpers (stable)
 * =============================== */

const YEARS = Array.from({ length: 26 }, (_, i) => String(1405 - i))
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1))
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))

const DEFAULT_YEAR = '1403'
const DEFAULT_MONTH = '1'
const DEFAULT_DAY = '1'

const pad2 = (v: string) => v.padStart(2, '0')

const buildDate = (y: string, m: string, d: string) =>
    `${y}-${pad2(m)}-${pad2(d)}`

const triggerClass =
    'min-w-[88px] px-3 text-right flex items-center justify-between'

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

export function FinancialTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'

    const { control, register, watch, setValue } = form

    const first = watch('financial_estimation.first_transaction_date')
    const last = watch('financial_estimation.last_transaction_date')

    const [fy = DEFAULT_YEAR, fm = DEFAULT_MONTH, fd = DEFAULT_DAY] =
    first?.split('-') ?? []
    const [ly = DEFAULT_YEAR, lm = DEFAULT_MONTH, ld = DEFAULT_DAY] =
    last?.split('-') ?? []

    const renderValue = (v: string) => (
        <span className="block w-full text-right">{pad2(v)}</span>
    )
    useEffect(() => {
        if (!first) {
            setValue(
                'financial_estimation.first_transaction_date',
                buildDate(DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY),
                { shouldDirty: false },
            )
        }

        if (!last) {
            setValue(
                'financial_estimation.last_transaction_date',
                buildDate(DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY),
                { shouldDirty: false },
            )
        }
        // فقط یک‌بار موقع mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <TabsContent value="financial" dir="rtl" className="mt-6 space-y-6 text-right">
            <div className="grid gap-6 md:grid-cols-2">
                {/* ===== First date ===== */}
                <LabeledField label={t('partners.form.first_transaction_date')}>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Year */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                سال
                            </label>
                            <Select
                                value={fy}
                                disabled={isView}
                                onValueChange={(y) =>
                                    setValue(
                                        'financial_estimation.first_transaction_date',
                                        buildDate(y, fm, fd),
                                        { shouldDirty: true },
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(fy)}
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map((y) => (
                                        <SelectItem key={y} value={y}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Month */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                ماه
                            </label>
                            <Select
                                value={fm}
                                disabled={isView}
                                onValueChange={(m) =>
                                    setValue(
                                        'financial_estimation.first_transaction_date',
                                        buildDate(fy, m, fd),
                                        { shouldDirty: true },
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(fm)}
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {pad2(m)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Day */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                روز
                            </label>
                            <Select
                                value={fd}
                                disabled={isView}
                                onValueChange={(d) =>
                                    setValue(
                                        'financial_estimation.first_transaction_date',
                                        buildDate(fy, fm, d),
                                        { shouldDirty: true },
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(fd)}
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {pad2(d)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </LabeledField>

                {/* ===== Last date ===== */}
                <LabeledField label={t('partners.form.last_transaction_date')}>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Year */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                سال
                            </label>
                            <Select
                                value={ly}
                                disabled={isView}
                                onValueChange={(y) =>
                                    setValue(
                                        'financial_estimation.last_transaction_date',
                                        buildDate(y, lm, ld),
                                        { shouldDirty: true },
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(ly)}
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map((y) => (
                                        <SelectItem key={y} value={y}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Month */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                ماه
                            </label>
                            <Select
                                value={lm}
                                disabled={isView}
                                onValueChange={(m) =>
                                    setValue(
                                        'financial_estimation.last_transaction_date',
                                        buildDate(ly, m, ld),
                                        { shouldDirty: true },
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(lm)}
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {pad2(m)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Day */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                روز
                            </label>
                            <Select
                                value={ld}
                                disabled={isView}
                                onValueChange={(d) =>
                                    setValue(
                                        'financial_estimation.last_transaction_date',
                                        buildDate(ly, lm, d),
                                        { shouldDirty: true },
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(ld)}
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {pad2(d)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </LabeledField>

                {/* ===== Total amount ===== */}
                <LabeledField label={t('partners.form.total_transaction_amount')}>
                    <Controller
                        control={control}
                        name="financial_estimation.total_transaction_amount_estimated"
                        render={({ field }) => (
                            <MoneyInput
                                {...field}
                                disabled={isView}
                                suffix="ریال"
                                placeholder={t('partners.form.total_transaction_amount')}
                            />
                        )}
                    />
                </LabeledField>

                {/* ===== Count ===== */}
                <LabeledField label={t('partners.form.transaction_count')}>
                    <Input
                        disabled={isView}
                        placeholder={t('partners.form.transaction_count')}
                        {...register('financial_estimation.transaction_count_estimated')}
                    />
                </LabeledField>
            </div>
        </TabsContent>
    )
}
