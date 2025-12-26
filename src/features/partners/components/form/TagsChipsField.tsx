import * as React from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
type TagsChipsFieldProps = {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    sampleTags?: string[]
}

function normalize(value: string[]) {
    return Array.from(new Set(value.map((v) => v.trim()).filter(Boolean)))
}

export function TagsChipsField({
                                   value,
                                   onChange,
                                   disabled,
                                   sampleTags = [],
                               }: TagsChipsFieldProps) {
    const [input, setInput] = React.useState('')

    const tags = React.useMemo(
        () => value.split(',').map((t) => t.trim()).filter(Boolean),
        [value]
    )

    function commit(next: string[]) {
        onChange(normalize(next).join(','))
    }

    function addTag(tag: string) {
        if (!tag) return
        commit([...tags, tag])
        setInput('')
    }

    function removeTag(tag: string) {
        commit(tags.filter((t) => t !== tag))
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
                    >
            {tag}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X size={14} />
                            </button>
                        )}
          </span>
                ))}
            </div>

            {!disabled && (
                <Input
                    value={input}
                    placeholder="برچسب جدید + Enter"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag(input)
                        }
                    }}
                />
            )}

            {!disabled && sampleTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {sampleTags.map((t) => (
                        <Button
                            key={t}
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addTag(t)}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
