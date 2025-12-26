import { Controller, UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

import { TagsChipsField } from '@/features/partners/components/form/TagsChipsField'
import { LabeledField } from '@/features/partners/components/form/LabeledField'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'
import type {
    FunnelStage,
    PotentialLevel,
    CustomerFinancialLevel,
    PurchaseReadiness,
} from '@/features/partners/model/types'

const EMPTY = '__empty__'

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

export function AnalysisTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'

    const { control, watch, setValue } = form

    // 🔒 TS-safe
    const tagsValue = watch('analysis.tags_input') ?? ''

    // stable trigger (same as other tabs)
    const triggerClass =
        'px-3 text-right flex items-center justify-between'

    const renderValue = (v?: string) => (
        <span className="block w-full text-right">
      {v && v !== EMPTY ? v : '—'}
    </span>
    )

    return (
        <TabsContent
            value="analysis"
            dir="rtl"
            className="mt-6 space-y-6 text-right"
        >
            <div className="grid gap-6 md:grid-cols-2">
                {/* Funnel stage */}
                <LabeledField label={t('partners.form.funnel_stage')}>
                    <Controller
                        control={control}
                        name="analysis.funnel_stage"
                        render={({ field }) => (
                            <Select
                                value={field.value || EMPTY}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(v === EMPTY ? '' : (v as FunnelStage))
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(
                                        field.value
                                            ? t(`partners.enums.funnel_stage.${field.value}`)
                                            : '',
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    {(['prospect', 'lead', 'qualified', 'customer', 'churned'] as FunnelStage[]).map(
                                        (v) => (
                                            <SelectItem key={v} value={v}>
                                                {t(`partners.enums.funnel_stage.${v}`)}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                {/* Potential */}
                <LabeledField label={t('partners.form.potential')}>
                    <Controller
                        control={control}
                        name="analysis.potential_level"
                        render={({ field }) => (
                            <Select
                                value={field.value || EMPTY}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(v === EMPTY ? '' : (v as PotentialLevel))
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(
                                        field.value
                                            ? t(`partners.enums.potential.${field.value}`)
                                            : '',
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    {(['low', 'medium', 'high'] as PotentialLevel[]).map((v) => (
                                        <SelectItem key={v} value={v}>
                                            {t(`partners.enums.potential.${v}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                {/* Financial level */}
                <LabeledField label={t('partners.form.financial_level')}>
                    <Controller
                        control={control}
                        name="analysis.financial_level"
                        render={({ field }) => (
                            <Select
                                value={field.value || EMPTY}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(
                                        v === EMPTY ? '' : (v as CustomerFinancialLevel),
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(
                                        field.value
                                            ? t(`partners.enums.financial_level.${field.value}`)
                                            : '',
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    {(['strong', 'medium', 'weak'] as CustomerFinancialLevel[]).map(
                                        (v) => (
                                            <SelectItem key={v} value={v}>
                                                {t(`partners.enums.financial_level.${v}`)}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                {/* Purchase readiness */}
                <LabeledField label={t('partners.form.purchase_readiness')}>
                    <Controller
                        control={control}
                        name="analysis.purchase_readiness"
                        render={({ field }) => (
                            <Select
                                value={field.value || EMPTY}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(
                                        v === EMPTY ? '' : (v as PurchaseReadiness),
                                    )
                                }
                            >
                                <SelectTrigger className={triggerClass}>
                                    {renderValue(
                                        field.value
                                            ? t(`partners.enums.purchase_readiness.${field.value}`)
                                            : '',
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    {(['low', 'medium', 'high'] as PurchaseReadiness[]).map(
                                        (v) => (
                                            <SelectItem key={v} value={v}>
                                                {t(`partners.enums.purchase_readiness.${v}`)}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>
            </div>

            {/* Tags */}
            <LabeledField label={t('partners.form.tags')}>
                <TagsChipsField
                    value={tagsValue}
                    disabled={isView}
                    onChange={(v) =>
                        setValue('analysis.tags_input', v, { shouldDirty: true })
                    }
                    sampleTags={['VIP', 'خوش‌حساب', 'نیاز به پیگیری']}
                />
            </LabeledField>
        </TabsContent>
    )
}
