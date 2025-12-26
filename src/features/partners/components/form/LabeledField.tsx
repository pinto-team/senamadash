type LabeledFieldProps = {
    label: string
    children: React.ReactNode
    required?: boolean
}

export function LabeledField({
                                 label,
                                 children,
                                 required,
                             }: LabeledFieldProps) {
    return (
        <div className="space-y-1 text-right">
            <label className="text-sm font-medium text-muted-foreground">
                {label}
                {required && <span className="mr-1 text-destructive">*</span>}
            </label>
            {children}
        </div>
    )
}
