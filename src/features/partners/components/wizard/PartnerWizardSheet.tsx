import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import { useI18n } from '@/shared/hooks/useI18n'

import type { WizardMode, WizardTab, WizardFormValues } from './PartnerWizard.types'
import { usePartnerWizardLogic } from './PartnerWizard.hooks'

import { IdentityTab } from './tabs/IdentityTab'
import { RelationshipTab } from './tabs/RelationshipTab'
import { FinancialTab } from './tabs/FinancialTab'
import { AnalysisTab } from './tabs/AnalysisTab'
import { AcquisitionTab } from './tabs/AcquisitionTab'
import { LocationTab } from './tabs/LocationTab'

const PHONE_LABEL_MAP: Record<string, string> = {
    'موبایل': 'mobile',
    'تلفن همراه': 'mobile',
    'mobile': 'mobile',

    'تلفن ثابت': 'landline',
    'landline': 'landline',

    'دفتر': 'office',
    'office': 'office',

    'کارخانه': 'factory',
    'انبار': 'warehouse',
    'فروش': 'sales',
    'پشتیبانی': 'support',
    'مدیریت': 'manager',
    'حسابداری': 'accounting',
    'فکس': 'fax',
}

const SOCIAL_PLATFORM_MAP: Record<string, string> = {
    'instagram': 'instagram',
    'اینستاگرام': 'instagram',

    'telegram': 'telegram',
    'تلگرام': 'telegram',

    'whatsapp': 'whatsapp',
    'واتساپ': 'whatsapp',
}


type Props = {
    open: boolean
    mode: WizardMode
    partner?: any
    onClose: () => void
    onFinished?: () => void
}

export function PartnerWizardSheet({
                                       open,
                                       mode,
                                       partner,
                                       onClose,
                                       onFinished,
                                   }: Props) {
    const { t } = useI18n()

    const isView = mode === 'view'
    const [activeTab, setActiveTab] = useState<WizardTab>('identity')

    // ✅ safe defaults (NEVER leave undefined for watch/useFieldArray consumers)
    const defaultValues = useMemo<WizardFormValues>(() => {
        const id = partner?.identity
        const rel = partner?.relationship
        const fin = partner?.financial_estimation
        const ana = partner?.analysis
        const acq = partner?.acquisition

        return {
            identity: {
                brand_name: id?.brand_name ?? '',
                manager_full_name: id?.manager_full_name ?? '',
                business_type: (id?.business_type ?? '') as any,

                contact_numbers:
                    id?.contact_numbers?.length
                        ? id.contact_numbers.map((c: any) => {
                            const normalizedLabel =
                                PHONE_LABEL_MAP[c.label] ?? 'other'

                            return {
                                label: normalizedLabel,
                                custom_label:
                                    normalizedLabel === 'other' ? c.label : '',
                                number: c.number ?? '',
                            }
                        })
                        : [
                            {
                                label: 'mobile',
                                custom_label: '',
                                number: '',
                            },
                        ],

                social_links:
                    id?.social_links?.length
                        ? id.social_links.map((s: any) => {
                            const normalizedPlatform =
                                SOCIAL_PLATFORM_MAP[s.platform] ?? 'other'

                            return {
                                platform: normalizedPlatform,
                                custom_label:
                                    normalizedPlatform === 'other' ? s.platform : '',
                                url: s.url ?? '',
                            }
                        })
                        : [
                            {
                                platform: 'instagram',
                                custom_label: '',
                                url: '',
                            },
                        ],

                province: id?.province ?? '',
                city: id?.city ?? '',
                neighborhood: '',
                full_address: id?.full_address ?? '',
                location_raw: id?.map_link ?? '',
                notes: '',
                location: id?.location ?? null,
            },

            relationship: {
                partnership_status: (rel?.partnership_status ?? '') as any,
                customer_relationship_level: (rel?.customer_relationship_level ?? '') as any,
                customer_satisfaction: (rel?.customer_satisfaction ?? '') as any,
                credit_status: (rel?.credit_status ?? '') as any,
                payment_types: rel?.payment_types ?? [],
                sensitivity: (rel?.sensitivity ?? '') as any,
                preferred_channel: (rel?.preferred_channel ?? '') as any,
                notes: rel?.notes ?? '',
            },

            financial_estimation: {
                first_transaction_date: fin?.first_transaction_date ?? '',
                first_transaction_amount_estimated:
                    fin?.first_transaction_amount_estimated != null
                        ? String(fin.first_transaction_amount_estimated)
                        : '',
                last_transaction_date: fin?.last_transaction_date ?? '',
                last_transaction_amount_estimated:
                    fin?.last_transaction_amount_estimated != null
                        ? String(fin.last_transaction_amount_estimated)
                        : '',
                total_transaction_amount_estimated:
                    fin?.total_transaction_amount_estimated != null
                        ? String(fin.total_transaction_amount_estimated)
                        : '',
                transaction_count_estimated:
                    fin?.transaction_count_estimated != null
                        ? String(fin.transaction_count_estimated)
                        : '',
                avg_transaction_value_estimated:
                    fin?.avg_transaction_value_estimated != null
                        ? String(fin.avg_transaction_value_estimated)
                        : '',
                estimation_note: fin?.estimation_note ?? '',
            },

            analysis: {
                funnel_stage: (ana?.funnel_stage ?? '') as any,
                potential_level: (ana?.potential_level ?? '') as any,
                financial_level: (ana?.financial_level ?? '') as any,
                purchase_readiness: (ana?.purchase_readiness ?? '') as any,
                tags_input: Array.isArray(ana?.tags) ? ana.tags.join(', ') : '', // ✅ avoid undefined.split
            },

            acquisition: {
                source: (acq?.source ?? '') as any,
                source_note: acq?.source_note ?? '',
            },
        }
    }, [partner])

    const form = useForm<WizardFormValues>({
        mode: 'onChange',
        defaultValues,
    })

    const wizard = usePartnerWizardLogic({
        mode,
        partner,
        form,
        onClose,
        onFinished,
    })

    // ✅ reset form whenever sheet opens or partner changes
    useEffect(() => {
        if (!open) return
        setActiveTab('identity')
        form.reset(defaultValues) // ✅ guarantees tags_input/contact_numbers arrays exist
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, partner?.id, defaultValues])

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent size="full" dir="rtl" className="overflow-hidden p-0 text-right ">
                <div className="flex h-full flex-col bg-background">
                    {/* Header */}
                    <div className="border-b px-6 py-4">
                        <SheetHeader className="gap-2 p-0">
                            <div className="flex items-start justify-between gap-3">
                                {/* 👇 فقط این div تغییر کرده */}
                                <div className="pr-10">
                                    <SheetTitle className="text-2xl font-bold">
                                        {mode === 'create'
                                            ? t('partners.wizard.title.create')
                                            : mode === 'edit'
                                                ? t('partners.wizard.title.edit')
                                                : t('partners.wizard.title.view')}
                                    </SheetTitle>
                                    <SheetDescription className="text-base text-muted-foreground">
                                        {t('partners.wizard.subtitle')}
                                    </SheetDescription>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        {t('partners.form.cancel')}
                                    </Button>
                                    <Button type="button" onClick={wizard.finish} disabled={isView && false}>
                                        {t('partners.wizard.actions.finish')}
                                    </Button>
                                </div>
                            </div>
                        </SheetHeader>
                    </div>


                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="mx-auto w-full max-w-5xl">
                            <Tabs
                                value={activeTab}
                                onValueChange={(v) =>
                                    wizard.handleTabChange(v as WizardTab, activeTab, setActiveTab)
                                }
                            >
                                <TabsList className="grid w-full grid-cols-6">
                                    <TabsTrigger value="identity">{t('partners.wizard.tabs.identity')}</TabsTrigger>
                                    <TabsTrigger value="location">{t('partners.wizard.tabs.location')}</TabsTrigger>
                                    <TabsTrigger value="relationship">{t('partners.wizard.tabs.relationship')}</TabsTrigger>
                                    <TabsTrigger value="financial">{t('partners.wizard.tabs.financial')}</TabsTrigger>
                                    <TabsTrigger value="analysis">{t('partners.wizard.tabs.analysis')}</TabsTrigger>
                                    <TabsTrigger value="acquisition">{t('partners.wizard.tabs.acquisition')}</TabsTrigger>
                                </TabsList>

                                <IdentityTab form={form} mode={mode} />
                                <RelationshipTab form={form} mode={mode} />
                                <FinancialTab form={form} mode={mode} />
                                <AnalysisTab form={form} mode={mode} />
                                <AcquisitionTab form={form} mode={mode} />
                                <LocationTab form={form} mode={mode} />

                            </Tabs>

                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
