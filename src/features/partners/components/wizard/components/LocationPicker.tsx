import L from 'leaflet'
import {
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
} from 'react-leaflet'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PartnerLocation } from '@/features/partners/model/types'

import { RecenterOnLocation } from './RecenterOnLocation'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

/* -----------------------------
 * Leaflet icon fix (Vite)
 * ----------------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

const TEHRAN_CENTER: [number, number] = [35.6892, 51.389]

type Props = {
    disabled: boolean
    location: PartnerLocation | null
    onChange: (loc: PartnerLocation | null) => void
    t: (key: string) => string
}

/* -----------------------------
 * Click handler
 * ----------------------------- */
function ClickHandler({
                          disabled,
                          onChange,
                      }: {
    disabled: boolean
    onChange: (loc: PartnerLocation) => void
}) {
    useMapEvents({
        click(e) {
            if (disabled) return
            onChange({
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
            })
        },
    })
    return null
}

/* -----------------------------
 * Component
 * ----------------------------- */
export function LocationPicker({
                                   disabled,
                                   location,
                                   onChange,
                                   t,
                               }: Props) {
    const center: [number, number] = location
        ? [location.latitude, location.longitude]
        : TEHRAN_CENTER

    return (
        <div className="space-y-3">
            {/* Map */}
            <div className="rounded-lg border overflow-hidden">
                <MapContainer
                    center={center}
                    zoom={location ? 14 : 11}
                    className="h-72 w-full"
                    scrollWheelZoom
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution={t('partners.map.attribution')}
                    />

                    <ClickHandler
                        disabled={disabled}
                        onChange={(loc) => onChange(loc)}
                    />

                    <RecenterOnLocation location={location} />

                    {location && (
                        <Marker
                            position={[location.latitude, location.longitude]}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Lat / Lng inputs */}
            <div className="grid gap-3 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.latitude')}
                    </label>
                    <Input
                        disabled={disabled}
                        value={location?.latitude ?? ''}
                        onChange={(e) => {
                            const v = e.target.value.trim()
                            if (!v) {
                                onChange(null)
                                return
                            }
                            const lat = Number(v)
                            if (!Number.isFinite(lat)) return
                            onChange({
                                latitude: lat,
                                longitude: location?.longitude ?? TEHRAN_CENTER[1],
                            })
                        }}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        {t('partners.form.longitude')}
                    </label>
                    <Input
                        disabled={disabled}
                        value={location?.longitude ?? ''}
                        onChange={(e) => {
                            const v = e.target.value.trim()
                            if (!v) {
                                onChange(null)
                                return
                            }
                            const lng = Number(v)
                            if (!Number.isFinite(lng)) return
                            onChange({
                                latitude: location?.latitude ?? TEHRAN_CENTER[0],
                                longitude: lng,
                            })
                        }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {t('partners.form.location_help')}
                </p>

                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || !location}
                    onClick={() => onChange(null)}
                >
                    {t('partners.form.actions.clear_location')}
                </Button>
            </div>
        </div>
    )
}
