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
import type { Partner } from '@/features/partners/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { convertDigitsByLocale } from '@/shared/i18n/numbers'

interface PartnerDetailsDrawerProps {
    partner: Partner | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PartnerDetailsDrawer({ partner, open, onOpenChange }: PartnerDetailsDrawerProps) {
    const { t, locale } = useI18n()
    const na = t('common.na')

    if (!partner) return null

    const d = (value: string | number | null | undefined) => convertDigitsByLocale(value ?? na, locale)

    const identity = partner.identity
    const rel = partner.relationship
    const fin = partner.financial_estimation
    const analysis = partner.analysis
    const acq = partner.acquisition

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="sm:max-w-3xl">
                <DrawerHeader className="items-start text-left">
                    <DrawerTitle>{identity.brand_name}</DrawerTitle>
                    <DrawerDescription>{identity.manager_full_name || na}</DrawerDescription>
                </DrawerHeader>

                <div className="max-h-[70vh] space-y-6 overflow-y-auto px-4 pb-6">
                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.contact')}
                        </h3>

                        <div className="mt-2 space-y-2">
                            {identity.contact_numbers.map((c, idx) => (
                                <div key={`${c.number}-${idx}`} className="rounded-md border p-2">
                                    <div className="text-xs text-muted-foreground">
                                        {c.label ?? t('partners.form.contact_label')}
                                    </div>
                                    <div className="font-medium">{c.number}</div>
                                </div>
                            ))}

                            {(identity.social_links ?? []).map((link, idx) => (
                                <div key={`${link.platform}-${idx}`} className="rounded-md border p-2">
                                    <div className="text-xs text-muted-foreground">{link.platform}</div>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-primary underline"
                                    >
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
                                <dd className="font-medium">{d(fin?.first_transaction_date ?? null)}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.first_transaction_amount')}</dt>
                                <dd className="font-medium">{d(fin?.first_transaction_amount_estimated ?? null)}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.last_transaction_date')}</dt>
                                <dd className="font-medium">{d(fin?.last_transaction_date ?? null)}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.last_transaction_amount')}</dt>
                                <dd className="font-medium">{d(fin?.last_transaction_amount_estimated ?? null)}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.total_transaction_amount')}</dt>
                                <dd className="font-medium">{d(fin?.total_transaction_amount_estimated ?? null)}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.transaction_count')}</dt>
                                <dd className="font-medium">{d(fin?.transaction_count_estimated ?? null)}</dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.crm')}
                        </h3>

                        <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.business_type')}</dt>
                                <dd className="font-medium">
                                    {identity.business_type ? t(`partners.enums.business_type.${identity.business_type}`) : na}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.funnel_stage')}</dt>
                                <dd className="font-medium">
                                    {analysis?.funnel_stage ? t(`partners.enums.funnel_stage.${analysis.funnel_stage}`) : na}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.potential')}</dt>
                                <dd className="font-medium">
                                    {analysis?.potential_level ? t(`partners.enums.potential.${analysis.potential_level}`) : na}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.partnership_status')}</dt>
                                <dd className="font-medium">
                                    {rel?.partnership_status ? t(`partners.enums.partnership_status.${rel.partnership_status}`) : na}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.credit_status')}</dt>
                                <dd className="font-medium">
                                    {rel?.credit_status ? t(`partners.enums.credit_status.${rel.credit_status}`) : na}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.preferred_channel')}</dt>
                                <dd className="font-medium">
                                    {rel?.preferred_channel ? t(`partners.enums.preferred_channel.${rel.preferred_channel}`) : na}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">{t('partners.form.acquisition_source')}</dt>
                                <dd className="font-medium">
                                    {acq?.source ? t(`partners.enums.acquisition_source.${acq.source}`) : na}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            {t('partners.details.notes')}
                        </h3>

                        <p className="mt-2 whitespace-pre-line rounded-md border p-3 text-sm">
                            {rel?.notes?.trim() || t('partners.details.no_notes')}
                        </p>
                    </section>

                    {(analysis?.tags ?? []).length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-muted-foreground">{t('partners.form.tags')}</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {(analysis?.tags ?? []).map((tag) => (
                                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs">
                    {tag}
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
