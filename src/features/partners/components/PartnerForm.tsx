import { useEffect, useMemo } from 'react'
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { PartnerData, PartnerPayload, PartnerBusinessType } from '@/features/partners/model/types'
import { useI18n } from '@/shared/hooks/useI18n'

interface PartnerFormProps {
    initialValues?: PartnerData | null
    submitting?: boolean
    onSubmit: (payload: PartnerPayload) => void
    onCancel?: () => void
}

type TextListItem = { value: string }

type PartnerFormState = {
    brand_name: string
    manager_full_name: string
    contact_numbers: { label: string; number: string }[]
    social_links: { platform: string; url: string }[]
    business_type: PartnerBusinessType
    category: string
    sub_category: string
    tags: TextListItem[]
    address: string
    latitude: string
    longitude: string
    first_transaction_date: string
    first_transaction_amount: string
    last_transaction_date: string
    last_transaction_amount: string
    total_transaction_amount: string
    transaction_count: string
    avg_transaction_value: string
    credit_status: string
    purchased_products: TextListItem[]
    partnership_status: string
    last_interaction: string
    interest_level: string
    potential: string
    current_contract: string
    purchase_probability: string
    team_size: string
    satisfaction: string
    payment_type: string
    sensitivity: string
    preferred_channel: string
    funnel_stage: string
    how_found: string
    customer_type: string
    customer_level: string
    notes: string
}

const emptyContact = { label: '', number: '' }
const emptySocial = { platform: '', url: '' }
const emptyText = { value: '' }

function toFormState(partner?: PartnerData | null): PartnerFormState {
    return {
        brand_name: partner?.brand_name ?? '',
        manager_full_name: partner?.manager_full_name ?? '',
        contact_numbers: partner?.contact_numbers?.length ? partner.contact_numbers : [emptyContact],
        social_links: partner?.social_links?.length ? partner.social_links : [emptySocial],
        business_type: partner?.business_type ?? 'other',
        category: partner?.category ?? '',
        sub_category: partner?.sub_category ?? '',
        tags: partner?.tags?.length ? partner.tags.map((value) => ({ value })) : [emptyText],
        address: partner?.address ?? '',
        latitude: partner?.location?.latitude ? `${partner.location.latitude}` : '',
        longitude: partner?.location?.longitude ? `${partner.location.longitude}` : '',
        first_transaction_date: partner?.first_transaction_date ?? '',
        first_transaction_amount: partner?.first_transaction_amount?.toString() ?? '',
        last_transaction_date: partner?.last_transaction_date ?? '',
        last_transaction_amount: partner?.last_transaction_amount?.toString() ?? '',
        total_transaction_amount: partner?.total_transaction_amount?.toString() ?? '',
        transaction_count: partner?.transaction_count?.toString() ?? '',
        avg_transaction_value: partner?.avg_transaction_value?.toString() ?? '',
        credit_status: partner?.credit_status ?? '',
        purchased_products: partner?.purchased_products?.length
            ? partner.purchased_products.map((value) => ({ value }))
            : [emptyText],
        partnership_status: partner?.partnership_status ?? '',
        last_interaction: partner?.last_interaction ?? '',
        interest_level: partner?.interest_level?.toString() ?? '',
        potential: partner?.potential ?? '',
        current_contract: partner?.current_contract ?? '',
        purchase_probability: partner?.purchase_probability?.toString() ?? '',
        team_size: partner?.team_size?.toString() ?? '',
        satisfaction: partner?.satisfaction?.toString() ?? '',
        payment_type: partner?.payment_type ?? '',
        sensitivity: partner?.sensitivity ?? '',
        preferred_channel: partner?.preferred_channel ?? '',
        funnel_stage: partner?.funnel_stage ?? '',
        how_found: partner?.how_found ?? '',
        customer_type: partner?.customer_type ?? '',
        customer_level: partner?.customer_level ?? '',
        notes: partner?.notes ?? '',
    }
}

function toPayload(values: PartnerFormState): PartnerPayload {
    const toNumber = (value: string) => {
        if (!value.trim()) return null
        const parsed = Number(value)
        return Number.isNaN(parsed) ? null : parsed
    }

    const cleanTextList = (items: TextListItem[]) =>
        items.map((item) => item.value.trim()).filter((value) => value.length > 0)

    return {
        brand_name: values.brand_name.trim(),
        manager_full_name: values.manager_full_name.trim(),
        contact_numbers: values.contact_numbers
            .filter((contact) => contact.number.trim().length > 0)
            .map((contact) => ({
                label: contact.label?.trim() || null,
                number: contact.number.trim(),
            })),
        social_links: values.social_links
            .filter((link) => link.platform.trim() || link.url.trim())
            .map((link) => ({ platform: link.platform.trim(), url: link.url.trim() })),
        business_type: values.business_type,
        category: values.category.trim() || null,
        sub_category: values.sub_category.trim() || null,
        tags: cleanTextList(values.tags),
        address: values.address.trim() || null,
        location: (() => {
            const lat = toNumber(values.latitude)
            const lon = toNumber(values.longitude)
            if (lat === null || lon === null) return null
            return { latitude: lat, longitude: lon }
        })(),
        first_transaction_date: values.first_transaction_date.trim() || null,
        first_transaction_amount: toNumber(values.first_transaction_amount),
        last_transaction_date: values.last_transaction_date.trim() || null,
        last_transaction_amount: toNumber(values.last_transaction_amount),
        total_transaction_amount: toNumber(values.total_transaction_amount),
        transaction_count: toNumber(values.transaction_count),
        avg_transaction_value: toNumber(values.avg_transaction_value),
        credit_status: (values.credit_status.trim() || null) as PartnerPayload['credit_status'],
        purchased_products: cleanTextList(values.purchased_products),
        partnership_status: (values.partnership_status.trim() || null) as PartnerPayload['partnership_status'],
        last_interaction: values.last_interaction.trim() || null,
        interest_level: toNumber(values.interest_level),
        potential: (values.potential.trim() || null) as PartnerPayload['potential'],
        current_contract: values.current_contract.trim() || null,
        purchase_probability: toNumber(values.purchase_probability),
        team_size: toNumber(values.team_size),
        satisfaction: toNumber(values.satisfaction),
        payment_type: (values.payment_type.trim() || null) as PartnerPayload['payment_type'],
        sensitivity: (values.sensitivity.trim() || null) as PartnerPayload['sensitivity'],
        preferred_channel: (values.preferred_channel.trim() || null) as PartnerPayload['preferred_channel'],
        funnel_stage: (values.funnel_stage.trim() || null) as PartnerPayload['funnel_stage'],
        how_found: values.how_found.trim() || null,
        customer_type: values.customer_type.trim() || null,
        customer_level: (values.customer_level.trim() || null) as PartnerPayload['customer_level'],
        notes: values.notes.trim() || null,
    }
}

export function PartnerForm({ initialValues, submitting, onSubmit, onCancel }: PartnerFormProps) {
    const { t } = useI18n()

    const form = useForm<PartnerFormState>({
        defaultValues: toFormState(initialValues),
    })

    const {
        control,
        register,
        handleSubmit,
        reset,
    } = form

    useEffect(() => {
        reset(toFormState(initialValues))
    }, [initialValues, reset])

    const contactFields = useFieldArray({ control, name: 'contact_numbers' })
    const socialFields = useFieldArray({ control, name: 'social_links' })
    const tagFields = useFieldArray({ control, name: 'tags' })
    const productFields = useFieldArray({ control, name: 'purchased_products' })

    const businessOptions = useMemo(
        () => [
            'producer',
            'supplier',
            'seller',
            'other',
        ].map((value) => ({ value, label: t(`partners.enums.business_type.${value}`) })),
        [t],
    )

    const funnelOptions = useMemo(
        () =>
            ['prospect', 'lead', 'qualified', 'customer', 'churned'].map((value) => ({
                value,
                label: t(`partners.enums.funnel_stage.${value}`),
            })),
        [t],
    )

    const customerLevelOptions = useMemo(
        () =>
            ['A', 'B', 'C'].map((value) => ({ value, label: t(`partners.enums.customer_level.${value}`) })),
        [t],
    )

    const selectFactory = (prefix: string, values: string[]) =>
        values.map((value) => ({ value, label: t(`partners.enums.${prefix}.${value}`) }))

    const creditOptions = useMemo(() => selectFactory('credit_status', ['good', 'normal', 'bad']), [t])
    const partnershipOptions = useMemo(
        () => selectFactory('partnership_status', ['past', 'present', 'future']),
        [t],
    )
    const potentialOptions = useMemo(() => selectFactory('potential', ['low', 'medium', 'high']), [t])
    const paymentOptions = useMemo(() => selectFactory('payment_type', ['cash', 'cheque', 'credit']), [t])
    const sensitivityOptions = useMemo(
        () => selectFactory('sensitivity', ['price', 'quality', 'speed', 'brand', 'other']),
        [t],
    )
    const channelOptions = useMemo(
        () => selectFactory('preferred_channel', ['phone', 'whatsapp', 'instagram', 'telegram', 'email', 'in_person', 'other']),
        [t],
    )

    return (
        <FormProvider {...form}>
            <form
                className="space-y-6"
                onSubmit={handleSubmit((values) => {
                    const payload = toPayload(values)
                    onSubmit(payload)
                })}
            >
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.general')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>{t('partners.form.brand_name')}</Label>
                            <Input {...register('brand_name')} required placeholder={t('partners.form.brand_name') as string} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.manager_full_name')}</Label>
                            <Input
                                {...register('manager_full_name')}
                                placeholder={t('partners.form.manager_full_name') as string}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.business_type')}</Label>
                            <Controller
                                control={control}
                                name="business_type"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value as PartnerBusinessType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.business_type') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businessOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.category')}</Label>
                            <Input {...register('category')} placeholder={t('partners.form.category') as string} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.sub_category')}</Label>
                            <Input {...register('sub_category')} placeholder={t('partners.form.sub_category') as string} />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <Label>{t('partners.form.address')}</Label>
                            <Textarea {...register('address')} placeholder={t('partners.form.address') as string} rows={3} />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.contact_numbers')}</h3>
                    <div className="space-y-3">
                        {contactFields.fields.map((field, index) => (
                            <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                                <Input {...register(`contact_numbers.${index}.label` as const)} placeholder={t('partners.form.contact_label') as string} />
                                <Input {...register(`contact_numbers.${index}.number` as const)} placeholder={t('partners.form.contact_number') as string} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => contactFields.remove(index)}
                                    aria-label={t('partners.form.remove') as string}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => contactFields.append({ ...emptyContact })}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> {t('partners.form.add_contact')}
                        </Button>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.social_links')}</h3>
                    <div className="space-y-3">
                        {socialFields.fields.map((field, index) => (
                            <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                                <Input {...register(`social_links.${index}.platform` as const)} placeholder={t('partners.form.social_platform') as string} />
                                <Input {...register(`social_links.${index}.url` as const)} placeholder={t('partners.form.social_url') as string} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => socialFields.remove(index)}
                                    aria-label={t('partners.form.remove') as string}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => socialFields.append({ ...emptySocial })}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> {t('partners.form.add_link')}
                        </Button>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.transactions')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>{t('partners.form.first_transaction_date')}</Label>
                            <Input {...register('first_transaction_date')} placeholder="1402/01/01" />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.first_transaction_amount')}</Label>
                            <Input type="number" inputMode="numeric" {...register('first_transaction_amount')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.last_transaction_date')}</Label>
                            <Input {...register('last_transaction_date')} placeholder="1403/12/12" />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.last_transaction_amount')}</Label>
                            <Input type="number" inputMode="numeric" {...register('last_transaction_amount')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.total_transaction_amount')}</Label>
                            <Input type="number" inputMode="numeric" {...register('total_transaction_amount')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.transaction_count')}</Label>
                            <Input type="number" inputMode="numeric" {...register('transaction_count')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.avg_transaction_value')}</Label>
                            <Input type="number" inputMode="numeric" {...register('avg_transaction_value')} />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.crm')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>{t('partners.form.credit_status')}</Label>
                            <Controller
                                control={control}
                                name="credit_status"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.credit_status') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {creditOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.partnership_status')}</Label>
                            <Controller
                                control={control}
                                name="partnership_status"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.partnership_status') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {partnershipOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.last_interaction')}</Label>
                            <Input {...register('last_interaction')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.interest_level')}</Label>
                            <Input type="number" inputMode="numeric" step="1" min="0" max="5" {...register('interest_level')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.potential')}</Label>
                            <Controller
                                control={control}
                                name="potential"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.potential') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {potentialOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.current_contract')}</Label>
                            <Input {...register('current_contract')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.purchase_probability')}</Label>
                            <Input type="number" step="0.01" inputMode="decimal" {...register('purchase_probability')} />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.preferences')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>{t('partners.form.team_size')}</Label>
                            <Input type="number" inputMode="numeric" {...register('team_size')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.satisfaction')}</Label>
                            <Input type="number" inputMode="numeric" {...register('satisfaction')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.payment_type')}</Label>
                            <Controller
                                control={control}
                                name="payment_type"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.payment_type') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {paymentOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.sensitivity')}</Label>
                            <Controller
                                control={control}
                                name="sensitivity"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.sensitivity') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {sensitivityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.preferred_channel')}</Label>
                            <Controller
                                control={control}
                                name="preferred_channel"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.preferred_channel') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {channelOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.funnel_stage')}</Label>
                            <Controller
                                control={control}
                                name="funnel_stage"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.funnel_stage') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {funnelOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.how_found')}</Label>
                            <Input {...register('how_found')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.customer_type')}</Label>
                            <Input {...register('customer_type')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.customer_level')}</Label>
                            <Controller
                                control={control}
                                name="customer_level"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('partners.form.customer_level') as string} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-</SelectItem>
                                            {customerLevelOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.lists')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t('partners.form.tags')}</Label>
                            {tagFields.fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <Input {...register(`tags.${index}.value` as const)} placeholder={t('partners.form.tag_label') as string} />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => tagFields.remove(index)}
                                        aria-label={t('partners.form.remove') as string}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => tagFields.append({ ...emptyText })}
                                className="mt-1 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> {t('partners.form.add_tag')}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('partners.form.purchased_products')}</Label>
                            {productFields.fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <Input {...register(`purchased_products.${index}.value` as const)} placeholder={t('partners.form.product_label') as string} />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => productFields.remove(index)}
                                        aria-label={t('partners.form.remove') as string}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => productFields.append({ ...emptyText })}
                                className="mt-1 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> {t('partners.form.add_product')}
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.location')}</h3>
                    <p className="text-xs text-muted-foreground">{t('partners.form.location_hint')}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>{t('partners.form.latitude')}</Label>
                            <Input type="number" step="0.000001" {...register('latitude')} />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('partners.form.longitude')}</Label>
                            <Input type="number" step="0.000001" {...register('longitude')} />
                        </div>
                    </div>
                </section>

                <section className="space-y-2">
                    <Label>{t('partners.form.notes')}</Label>
                    <Textarea rows={4} {...register('notes')} />
                </section>

                <div className="flex items-center justify-end gap-3">
                    {onCancel ? (
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            {t('partners.form.cancel')}
                        </Button>
                    ) : null}
                    <Button type="submit" disabled={submitting}>
                        {submitting ? t('partners.form.submitting') : t('partners.form.submit')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}

export default PartnerForm
