import * as React from 'react'
import { Input } from '@/components/ui/input.tsx'
import { cn } from '@/lib/utils.ts'

type MoneyInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
> & {
    value?: string | number
    onChange?: (value: string) => void
    suffix?: string
}

function formatNumber(value: string) {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    return Number(digits).toLocaleString('en-US')
}

function parseNumber(value: string) {
    return value.replace(/\D/g, '')
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ value, onChange, suffix = 'ریال', className, disabled, ...props }, ref) => {
        const displayValue =
            value === undefined || value === null
                ? ''
                : formatNumber(String(value))

        return (
            <div className="relative">
                <Input
                    {...props}
                    ref={ref}
                    disabled={disabled}
                    dir="ltr"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={(e) => onChange?.(parseNumber(e.target.value))}
                    className={cn('pr-14', className)}
                />

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {suffix}
        </span>
            </div>
        )
    }
)

MoneyInput.displayName = 'MoneyInput'
