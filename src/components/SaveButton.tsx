import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SaveButtonProps {
    onSave: () => Promise<void>
    isDirty: boolean
}

export function SaveButton({ onSave, isDirty }: SaveButtonProps) {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave()
        } catch (error) {
            console.error('Error saving:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
        >
            {isSaving ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                'Save Changes'
            )}
        </Button>
    )
}
