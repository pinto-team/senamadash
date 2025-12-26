import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, X } from 'lucide-react'

import { TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { LocationPicker } from '../components/LocationPicker'
import type { WizardFormValues, WizardMode } from '../PartnerWizard.types'
import { useI18n } from '@/shared/hooks/useI18n'
import type { BusinessType, SocialPlatform } from '@/features/partners/model/types'
import { useEffect } from 'react'

const EMPTY = '__empty__'

const PHONE_LABEL_OPTIONS = [
    { value: 'mobile', label: 'موبایل' },
    { value: 'landline', label: 'تلفن ثابت' },
    { value: 'office', label: 'دفتر' },
    { value: 'factory', label: 'کارخانه' },
    { value: 'warehouse', label: 'انبار' },
    { value: 'sales', label: 'فروش' },
    { value: 'support', label: 'پشتیبانی' },
    { value: 'manager', label: 'مدیریت' },
    { value: 'accounting', label: 'حسابداری' },
    { value: 'fax', label: 'فکس' },
    { value: 'other', label: 'سایر (دلخواه)' },
]

const SOCIAL_PLATFORM_OPTIONS: Array<{ value: SocialPlatform; label: string }> = [
    { value: 'instagram', label: 'اینستاگرام' },
    { value: 'telegram', label: 'تلگرام' },
    { value: 'whatsapp', label: 'واتساپ' },
    { value: 'website', label: 'وب‌سایت' },
    { value: 'rubika', label: 'روبیکا' },
    { value: 'bale', label: 'بله' },
    { value: 'eitaa', label: 'ایتا' },
    { value: 'other', label: 'سایر (دلخواه)' },
]

type Props = {
    form: UseFormReturn<WizardFormValues>
    mode: WizardMode
}

export function IdentityTab({ form, mode }: Props) {
    const { t } = useI18n()
    const isView = mode === 'view'

    const { control, register, watch } = form

    const contactsFA = useFieldArray({
        control,
        name: 'identity.contact_numbers',
    })

    const socialsFA = useFieldArray({
        control,
        name: 'identity.social_links',
    })

    useEffect(() => {
        if (isView) return
        if (contactsFA.fields.length === 0) {
            contactsFA.append({ label: 'mobile', number: '', custom_label: '' })
        }
        if (socialsFA.fields.length === 0) {
            socialsFA.append({ platform: '', url: '', custom_label: '' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isView])

    return (
        <TabsContent
            value="identity"
            dir="rtl"
            className="mt-6 space-y-8 text-right"
        >

        {/* -------- Basic Info (one horizontal row) -------- */}
            <div className="grid gap-3 md:grid-cols-3">
                <Input
                    disabled={isView}
                    placeholder={t('partners.form.brand_name')}
                    {...register('identity.brand_name')}
                />

                <Input
                    disabled={isView}
                    placeholder={t('partners.form.manager_full_name')}
                    {...register('identity.manager_full_name')}
                />

                <Controller
                    control={control}
                    name="identity.business_type"
                    render={({ field }) => (
                        <Select
                            value={field.value || ''}
                            disabled={isView}
                            onValueChange={(v) =>
                                field.onChange(v === EMPTY ? '' : (v as BusinessType))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('partners.form.business_type')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EMPTY}>—</SelectItem>
                                <SelectItem value="furniture_showroom">نمایشگاه</SelectItem>
                                <SelectItem value="furniture_manufacturer">تولیدکننده</SelectItem>
                                <SelectItem value="furniture_distributor">پخش‌کننده</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* -------- Contact & Social (two columns) -------- */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* ================== Contact Numbers ================== */}
                <div className="space-y-3">
        <span className="text-sm text-muted-foreground">
            {t('partners.form.contact_numbers')}
        </span>

                    {contactsFA.fields.map((f, idx) => {
                        const isSingle = contactsFA.fields.length === 1
                        const labelValue = watch(`identity.contact_numbers.${idx}.label`)

                        return (
                            <div key={f.id} className="flex items-center gap-2">
                                {/* label */}
                                <Controller
                                    control={control}
                                    name={`identity.contact_numbers.${idx}.label`}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || ''}
                                            disabled={isView}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-28">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PHONE_LABEL_OPTIONS.map((o) => (
                                                    <SelectItem key={o.value} value={o.value}>
                                                        {o.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {/* custom label */}
                                {labelValue === 'other' && (
                                    <Input
                                        className="w-32"
                                        disabled={isView}
                                        placeholder="عنوان دلخواه"
                                        {...register(
                                            `identity.contact_numbers.${idx}.custom_label`,
                                        )}
                                    />
                                )}

                                {/* number */}
                                <Input
                                    className="flex-1"
                                    disabled={isView}
                                    dir="ltr"
                                    inputMode="tel"
                                    placeholder="09xxxxxxxx / 021xxxxxxx"
                                    {...register(
                                        `identity.contact_numbers.${idx}.number`,
                                    )}
                                />

                                {/* action */}
                                <div className="flex items-center">
                                    {idx === 0 ? (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            disabled={isView}
                                            onClick={() =>
                                                contactsFA.append({
                                                    label: 'mobile',
                                                    number: '',
                                                    custom_label: '',
                                                })
                                            }
                                            aria-label="افزودن"
                                        >
                                            <Plus className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            disabled={isView}
                                            onClick={() => contactsFA.remove(idx)}
                                            aria-label="حذف"
                                        >
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ================== Social Links ================== */}
                <div className="space-y-3">
        <span className="text-sm text-muted-foreground">
            {t('partners.form.social_links')}
        </span>

                    {socialsFA.fields.map((f, idx) => {
                        const isSingle = socialsFA.fields.length === 1
                        const platformValue = watch(
                            `identity.social_links.${idx}.platform`,
                        )

                        return (
                            <div key={f.id} className="flex items-center gap-2">
                                {/* platform */}
                                <Controller
                                    control={control}
                                    name={`identity.social_links.${idx}.platform`}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || ''}
                                            disabled={isView}
                                            onValueChange={(v) =>
                                                field.onChange(
                                                    v === EMPTY ? '' : (v as any),
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-28">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={EMPTY}>—</SelectItem>
                                                {SOCIAL_PLATFORM_OPTIONS.map((o) => (
                                                    <SelectItem
                                                        key={o.value}
                                                        value={o.value}
                                                    >
                                                        {o.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {/* custom platform */}
                                {platformValue === 'other' && (
                                    <Input
                                        className="w-32"
                                        disabled={isView}
                                        placeholder="نام پلتفرم"
                                        {...register(
                                            `identity.social_links.${idx}.custom_label` as any,
                                        )}
                                    />
                                )}

                                {/* url */}
                                <Input
                                    className="flex-1"
                                    disabled={isView}
                                    dir="ltr"
                                    placeholder="https://"
                                    {...register(
                                        `identity.social_links.${idx}.url`,
                                    )}
                                />

                                {/* action */}
                                <div className="flex items-center">
                                    {idx === 0 ? (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            disabled={isView}
                                            onClick={() =>
                                                socialsFA.append({
                                                    platform: 'instagram',
                                                    url: '',
                                                    custom_label: '',
                                                })
                                            }
                                            aria-label="افزودن"
                                        >
                                            <Plus className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            disabled={isView}
                                            onClick={() => socialsFA.remove(idx)}
                                            aria-label="حذف"
                                        >
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>


            {/* -------- Location -------- */}
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

            {/* -------- Notes -------- */}
            <Textarea
                disabled={isView}
                placeholder={t('partners.form.notes')}
                {...register('identity.notes')}
            />
        </TabsContent>
    )
}
