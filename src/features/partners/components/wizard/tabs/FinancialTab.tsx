import { Controller, UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { MoneyInput } from '@/features/partners/components/form/MoneyInput'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

export function FinancialTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'

    const { control, register } = form

    return (
        <TabsContent value="financial" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.first_transaction_date')}
                    </label>
                    <Input
                        type="date"
                        disabled={isView}
                        {...register('financial_estimation.first_transaction_date')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.first_transaction_amount')}
                    </label>
                    <Controller
                        control={control}
                        name="financial_estimation.first_transaction_amount_estimated"
                        render={({ field }) => (
                            <MoneyInput {...field} disabled={isView} suffix="ریال" />
                        )}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.last_transaction_date')}
                    </label>
                    <Input
                        type="date"
                        disabled={isView}
                        {...register('financial_estimation.last_transaction_date')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.last_transaction_amount')}
                    </label>
                    <Controller
                        control={control}
                        name="financial_estimation.last_transaction_amount_estimated"
                        render={({ field }) => (
                            <MoneyInput {...field} disabled={isView} suffix="ریال" />
                        )}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.total_transaction_amount')}
                    </label>
                    <Controller
                        control={control}
                        name="financial_estimation.total_transaction_amount_estimated"
                        render={({ field }) => (
                            <MoneyInput {...field} disabled={isView} suffix="ریال" />
                        )}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.transaction_count')}
                    </label>
                    <Input
                        disabled={isView}
                        {...register('financial_estimation.transaction_count_estimated')}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">
                    {t('partners.form.estimation_note')}
                </label>
                <Textarea
                    disabled={isView}
                    {...register('financial_estimation.estimation_note')}
                />
            </div>
        </TabsContent>
    )
}
