import { Controller, UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { TagsChipsField } from '@/features/partners/components/form/TagsChipsField'
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

    return (
        <TabsContent value="analysis" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                {/* Funnel stage */}
                <Controller
                    control={control}
                    name="analysis.funnel_stage"
                    render={({ field }) => (
                        <Select
                            value={field.value || ''}
                            disabled={isView}
                            onValueChange={(v) =>
                                field.onChange(v === EMPTY ? '' : (v as FunnelStage))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t('partners.form.funnel_stage')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY}>—</SelectItem>
                                <SelectItem value="prospect">
                                    {t('partners.enums.funnel_stage.prospect')}
                                </SelectItem>
                                <SelectItem value="lead">
                                    {t('partners.enums.funnel_stage.lead')}
                                </SelectItem>
                                <SelectItem value="qualified">
                                    {t('partners.enums.funnel_stage.qualified')}
                                </SelectItem>
                                <SelectItem value="customer">
                                    {t('partners.enums.funnel_stage.customer')}
                                </SelectItem>
                                <SelectItem value="churned">
                                    {t('partners.enums.funnel_stage.churned')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Potential */}
                <Controller
                    control={control}
                    name="analysis.potential_level"
                    render={({ field }) => (
                        <Select
                            value={field.value || ''}
                            disabled={isView}
                            onValueChange={(v) =>
                                field.onChange(v === EMPTY ? '' : (v as PotentialLevel))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t('partners.form.potential')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY}>—</SelectItem>
                                <SelectItem value="low">
                                    {t('partners.enums.potential.low')}
                                </SelectItem>
                                <SelectItem value="medium">
                                    {t('partners.enums.potential.medium')}
                                </SelectItem>
                                <SelectItem value="high">
                                    {t('partners.enums.potential.high')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Financial level */}
                <Controller
                    control={control}
                    name="analysis.financial_level"
                    render={({ field }) => (
                        <Select
                            value={field.value || ''}
                            disabled={isView}
                            onValueChange={(v) =>
                                field.onChange(
                                    v === EMPTY ? '' : (v as CustomerFinancialLevel),
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t('partners.form.financial_level')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY}>—</SelectItem>
                                <SelectItem value="strong">
                                    {t('partners.enums.financial_level.strong')}
                                </SelectItem>
                                <SelectItem value="medium">
                                    {t('partners.enums.financial_level.medium')}
                                </SelectItem>
                                <SelectItem value="weak">
                                    {t('partners.enums.financial_level.weak')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Purchase readiness */}
                <Controller
                    control={control}
                    name="analysis.purchase_readiness"
                    render={({ field }) => (
                        <Select
                            value={field.value || ''}
                            disabled={isView}
                            onValueChange={(v) =>
                                field.onChange(
                                    v === EMPTY ? '' : (v as PurchaseReadiness),
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t('partners.form.purchase_readiness')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY}>—</SelectItem>
                                <SelectItem value="low">
                                    {t('partners.enums.purchase_readiness.low')}
                                </SelectItem>
                                <SelectItem value="medium">
                                    {t('partners.enums.purchase_readiness.medium')}
                                </SelectItem>
                                <SelectItem value="high">
                                    {t('partners.enums.purchase_readiness.high')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Tags */}
            <div>
                <label className="text-sm font-medium">
                    {t('partners.form.tags')}
                </label>

                <TagsChipsField
                    value={watch('analysis.tags_input')}
                    disabled={isView}
                    onChange={(v) =>
                        setValue('analysis.tags_input', v, { shouldDirty: true })
                    }
                    sampleTags={['VIP', 'خوش‌حساب', 'نیاز به پیگیری']}
                />
            </div>
        </TabsContent>
    )
}
