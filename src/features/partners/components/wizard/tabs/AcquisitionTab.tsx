import { UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { LabeledField } from '@/features/partners/components/form/LabeledField'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'
import type { AcquisitionSource } from '@/features/partners/model/types'

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

const SOURCES: AcquisitionSource[] = [
    'marketing',
    'self_search',
    'referral',
    'instagram',
    'google',
    'advertising',
    'other',
]

export function AcquisitionTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'

    const { watch, setValue, register } = form
    const current = watch('acquisition.source')

    return (
        <TabsContent
            value="acquisition"
            dir="rtl"
            className="mt-6 space-y-6 text-right"
        >
            {/* ===== Acquisition source ===== */}
            <LabeledField label={t('partners.form.acquisition_source')}>
                <div className="flex flex-wrap gap-2">
                    {SOURCES.map((src) => {
                        const isActive = current === src

                        return (
                            <Button
                                key={src}
                                type="button"
                                disabled={isView}
                                size="sm"
                                variant={isActive ? 'default' : 'outline'}
                                className={isActive ? '' : 'text-muted-foreground'}
                                onClick={() =>
                                    setValue('acquisition.source', src, {
                                        shouldDirty: true,
                                    })
                                }
                            >
                                {t(`partners.enums.acquisition_source.${src}`)}
                            </Button>
                        )
                    })}
                </div>
            </LabeledField>

            {/* ===== Note ===== */}
            <LabeledField label={t('partners.form.acquisition_note')}>
                <Textarea
                    disabled={isView}
                    placeholder={t('partners.form.acquisition_note')}
                    {...register('acquisition.source_note')}
                />
            </LabeledField>
        </TabsContent>
    )
}
