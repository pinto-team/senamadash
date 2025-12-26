import { Controller, UseFormReturn } from 'react-hook-form'

import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

import { LabeledField } from '@/features/partners/components/form/LabeledField'
import { LocationPicker } from '../components/LocationPicker'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

export function LocationTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'
    const { control, register } = form

    return (
        <TabsContent
            value="location"
            dir="rtl"
            className="mt-6 space-y-6 text-right"
        >
            {/* توضیح کوتاه */}
            <p className="text-sm text-muted-foreground">
                موقعیت مکانی شریک را می‌توانید روی نقشه انتخاب کنید یا آدرس و لینک لوکیشن را وارد کنید.
            </p>

            {/* آدرس + لینک لوکیشن (افقی) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <LabeledField label="آدرس کامل (متنی)">
                    <Textarea
                        disabled={isView}
                        rows={4}
                        placeholder="مثال: تهران، یافت‌آباد، خیابان …، پلاک …"
                        {...register('identity.full_address')}
                    />
                </LabeledField>

                <LabeledField label="لینک یا لوکیشن کپی‌شده (واتساپ / نقشه)">
                    <Textarea
                        disabled={isView}
                        rows={4}
                        dir="ltr"
                        placeholder="https://maps.google.com/maps?q=35.594900,51.303287"
                        {...register('identity.location_raw')}
                    />
                </LabeledField>
            </div>

            {/* نقشه بزرگ */}
            <LabeledField label={t('partners.form.location_map')}>
                <div className="h-[420px]">
                    <Controller
                        control={control}
                        name="identity.location"
                        render={({ field }) => (
                            <LocationPicker
                                disabled={isView}
                                location={field.value ?? null}
                                onChange={field.onChange}
                                t={t}
                            />
                        )}
                    />
                </div>
            </LabeledField>
        </TabsContent>
    )
}
