import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { PartnerLocation } from '@/features/partners/model/types'

type Props = {
    location: PartnerLocation | null
}

export function RecenterOnLocation({ location }: Props) {
    const map = useMap()

    useEffect(() => {
        if (!location) return

        map.setView(
            [location.latitude, location.longitude],
            map.getZoom(),
            { animate: true }
        )
    }, [location, map])

    return null
}
