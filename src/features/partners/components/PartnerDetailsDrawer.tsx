import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import type { PartnerData } from '@/features/partners/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { convertDigitsByLocale } from '@/shared/i18n/numbers'

interface PartnerDetailsDrawerProps {
    partner: PartnerData | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PartnerDetailsDrawer({ partner, open, onOpenChange }: PartnerDetailsDrawerProps) {
    const { t, locale } = useI18n()

    if (!partner) return null

    const d = (value: string | number | null | undefined) => convertDigitsByLocale(value ?? '-', locale)

    const infoRows: Array<{ label: string; value: string | number | null | undefined }> = [
        { label: t('partners.form.business_type'), value: partner.business_type ? t(`partners.enums.business_type.${partner.business_type}`) : '-' },
        { label: t('partners.form.funnel_stage'), value: partner.funnel_stage ? t(`partners.enums.funnel_stage.${partner.funnel_stage}`) : '-' },
        { label: t('partners.form.customer_level'), value: partner.customer_level ? t(`partners.enums.customer_level.${partner.customer_level}`) : '-' },
        { label: t('partners.form.potential'), value: partner.potential ? t(`partners.enums.potential.${partner.potential}`) : '-' },
        { label: t('partners.form.payment_type'), value: partner.payment_type ? t(`partners.enums.payment_type.${partner.payment_type}`) : '-' },
    ]

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="sm:max-w-3xl">
                <DrawerHeader className="items-start text-left">
                    <DrawerTitle>{partner.brand_name}</DrawerTitle>
                    <DrawerDescription>{partner.manager_full_name}</DrawerDescription>
                </DrawerHeader>

                <div className="max-h-[70vh] space-y-6 overflow-y-auto px-4 pb-6">
                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.contact')}
                        </h3>
                        <div className="mt-2 space-y-2">
                            {partner.contact_numbers.map((contact, idx) => (
                                <div key={`${contact.number}-${idx}`} className="rounded-md border p-2">
                                    <div className="text-xs text-muted-foreground">{contact.label ?? t('partners.form.contact_label')}</div>
                                    <div className="font-medium">{contact.number}</div>
                                </div>
                            ))}
                            {partner.social_links.map((link, idx) => (
                                <div key={`${link.platform}-${idx}`} className="rounded-md border p-2">
                                    <div className="text-xs text-muted-foreground">{link.platform}</div>
                                    <a href={link.url} target="_blank" rel="noreferrer" className="font-medium text-primary underline">
                                        {link.url}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.transactions')}
                        </h3>
                        <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.first_transaction_date')}</dt>
                                <dd className="font-medium">{partner.first_transaction_date ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.first_transaction_amount')}</dt>
                                <dd className="font-medium">{d(partner.first_transaction_amount)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.last_transaction_date')}</dt>
                                <dd className="font-medium">{partner.last_transaction_date ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.last_transaction_amount')}</dt>
                                <dd className="font-medium">{d(partner.last_transaction_amount)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.total_transaction_amount')}</dt>
                                <dd className="font-medium">{d(partner.total_transaction_amount)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.transaction_count')}</dt>
                                <dd className="font-medium">{d(partner.transaction_count)}</dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.crm')}
                        </h3>
                        <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {infoRows.map((row) => (
                                <div key={row.label}>
                                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                                    <dd className="font-medium">{row.value ?? '-'}</dd>
                                </div>
                            ))}
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.interest_level')}</dt>
                                <dd className="font-medium">{d(partner.interest_level)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.purchase_probability')}</dt>
                                <dd className="font-medium">{d(partner.purchase_probability)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.credit_status')}</dt>
                                <dd className="font-medium">
                                    {partner.credit_status
                                        ? t(`partners.enums.credit_status.${partner.credit_status}`)
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.partnership_status')}</dt>
                                <dd className="font-medium">
                                    {partner.partnership_status
                                        ? t(`partners.enums.partnership_status.${partner.partnership_status}`)
                                        : '-'}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.preferences')}
                        </h3>
                        <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.preferred_channel')}</dt>
                                <dd className="font-medium">
                                    {partner.preferred_channel
                                        ? t(`partners.enums.preferred_channel.${partner.preferred_channel}`)
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.sensitivity')}</dt>
                                <dd className="font-medium">
                                    {partner.sensitivity
                                        ? t(`partners.enums.sensitivity.${partner.sensitivity}`)
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.payment_type')}</dt>
                                <dd className="font-medium">
                                    {partner.payment_type
                                        ? t(`partners.enums.payment_type.${partner.payment_type}`)
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.team_size')}</dt>
                                <dd className="font-medium">{d(partner.team_size)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.satisfaction')}</dt>
                                <dd className="font-medium">{d(partner.satisfaction)}</dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.notes')}
                        </h3>
                        <p className="mt-2 whitespace-pre-line rounded-md border p-3 text-sm">
                            {partner.notes?.trim() || t('partners.details.no_notes')}
                        </p>
                    </section>

                    {partner.tags.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.tags')}</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {partner.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                    {partner.purchased_products.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                {t('partners.form.purchased_products')}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {partner.purchased_products.map((product) => (
                                    <span key={product} className="rounded-full bg-muted px-3 py-1 text-xs">
                                        {product}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">{t('partners.form.cancel')}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
