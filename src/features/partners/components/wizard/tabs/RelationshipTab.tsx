import { Controller, UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { LabeledField } from '@/features/partners/components/form/LabeledField'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'
import type {
    PartnershipStatus,
    CreditStatus,
    CustomerRelationshipLevel,
    CustomerSatisfaction,
    SensitivityType,
    SocialPlatform,
    PaymentType,
} from '@/features/partners/model/types'

const EMPTY = '__empty__'

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

export function RelationshipTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'

    const { control, register, watch, setValue } = form
    const paymentTypes = watch('relationship.payment_types') ?? []

    const togglePayment = (pt: PaymentType, checked: boolean) => {
        const next = new Set(paymentTypes)
        checked ? next.add(pt) : next.delete(pt)
        setValue('relationship.payment_types', Array.from(next), {
            shouldDirty: true,
        })
    }

    return (
        <TabsContent
            value="relationship"
            dir="rtl"
            className="mt-6 space-y-6 text-right"
        >
            {/* ===== Main Selects ===== */}
            <div className="grid gap-6 md:grid-cols-2">
                <LabeledField label={t('partners.form.partnership_status')}>
                    <Controller
                        control={control}
                        name="relationship.partnership_status"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(v === EMPTY ? '' : (v as PartnershipStatus))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('partners.form.partnership_status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    <SelectItem value="past">
                                        {t('partners.enums.partnership_status.past')}
                                    </SelectItem>
                                    <SelectItem value="present">
                                        {t('partners.enums.partnership_status.present')}
                                    </SelectItem>
                                    <SelectItem value="future">
                                        {t('partners.enums.partnership_status.future')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                <LabeledField label={t('partners.form.credit_status')}>
                    <Controller
                        control={control}
                        name="relationship.credit_status"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(v === EMPTY ? '' : (v as CreditStatus))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('partners.form.credit_status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    <SelectItem value="good">
                                        {t('partners.enums.credit_status.good')}
                                    </SelectItem>
                                    <SelectItem value="normal">
                                        {t('partners.enums.credit_status.normal')}
                                    </SelectItem>
                                    <SelectItem value="bad">
                                        {t('partners.enums.credit_status.bad')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                <LabeledField label={t('partners.form.customer_relationship_level')}>
                    <Controller
                        control={control}
                        name="relationship.customer_relationship_level"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(
                                        v === EMPTY ? '' : (v as CustomerRelationshipLevel),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t('partners.form.customer_relationship_level')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    <SelectItem value="engaged">
                                        {t('partners.enums.customer_relationship_level.engaged')}
                                    </SelectItem>
                                    <SelectItem value="normal">
                                        {t('partners.enums.customer_relationship_level.normal')}
                                    </SelectItem>
                                    <SelectItem value="indifferent">
                                        {t('partners.enums.customer_relationship_level.indifferent')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                <LabeledField label={t('partners.form.customer_satisfaction')}>
                    <Controller
                        control={control}
                        name="relationship.customer_satisfaction"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(
                                        v === EMPTY ? '' : (v as CustomerSatisfaction),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t('partners.form.customer_satisfaction')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    <SelectItem value="satisfied">
                                        {t('partners.enums.customer_satisfaction.satisfied')}
                                    </SelectItem>
                                    <SelectItem value="neutral">
                                        {t('partners.enums.customer_satisfaction.neutral')}
                                    </SelectItem>
                                    <SelectItem value="dissatisfied">
                                        {t('partners.enums.customer_satisfaction.dissatisfied')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                <LabeledField label={t('partners.form.preferred_channel')}>
                    <Controller
                        control={control}
                        name="relationship.preferred_channel"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(v === EMPTY ? '' : (v as SocialPlatform))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('partners.form.preferred_channel')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    <SelectItem value="instagram">اینستاگرام</SelectItem>
                                    <SelectItem value="whatsapp">واتساپ</SelectItem>
                                    <SelectItem value="telegram">تلگرام</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>

                <LabeledField label={t('partners.form.sensitivity')}>
                    <Controller
                        control={control}
                        name="relationship.sensitivity"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                disabled={isView}
                                onValueChange={(v) =>
                                    field.onChange(v === EMPTY ? '' : (v as SensitivityType))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('partners.form.sensitivity')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={EMPTY}>—</SelectItem>
                                    <SelectItem value="price">
                                        {t('partners.enums.sensitivity.price')}
                                    </SelectItem>
                                    <SelectItem value="quality">
                                        {t('partners.enums.sensitivity.quality')}
                                    </SelectItem>
                                    <SelectItem value="speed">
                                        {t('partners.enums.sensitivity.speed')}
                                    </SelectItem>
                                    <SelectItem value="brand">
                                        {t('partners.enums.sensitivity.brand')}
                                    </SelectItem>
                                    <SelectItem value="other">
                                        {t('partners.enums.sensitivity.other')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </LabeledField>
            </div>

            {/* ===== Payment Types ===== */}
            <LabeledField label={t('partners.form.payment_types')}>
                <div className="flex flex-wrap gap-4">
                    {(['cash', 'cheque', 'credit'] as PaymentType[]).map((pt) => (
                        <label
                            key={pt}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                            <Checkbox
                                disabled={isView}
                                checked={paymentTypes.includes(pt)}
                                onCheckedChange={(v) => togglePayment(pt, Boolean(v))}
                            />
                            {t(`partners.enums.payment_type.${pt}`)}
                        </label>
                    ))}
                </div>
            </LabeledField>
        </TabsContent>
    )
}
