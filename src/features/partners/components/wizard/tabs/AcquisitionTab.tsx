import { UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

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
        <TabsContent value="acquisition" className="mt-6 space-y-6">
            <div>
                <div className="mb-2 text-sm font-medium">
                    {t('partners.form.acquisition_source')}
                </div>

                <div className="flex flex-wrap gap-2">
                    {SOURCES.map((src) => (
                        <Button
                            key={src}
                            type="button"
                            disabled={isView}
                            variant={current === src ? 'default' : 'outline'}
                            onClick={() =>
                                setValue('acquisition.source', src, { shouldDirty: true })
                            }
                        >
                            {t(`partners.enums.acquisition_source.${src}`)}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <div className="mb-2 text-sm font-medium">
                    {t('partners.form.acquisition_note')}
                </div>

                <Textarea
                    disabled={isView}
                    {...register('acquisition.source_note')}
                />
            </div>
        </TabsContent>
    )
}
