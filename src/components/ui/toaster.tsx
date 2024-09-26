"use client"

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster({ position = "bottom-right" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport className={`fixed ${getPositionClasses(position)} flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none`} />
        </ToastProvider>
    )
}

function getPositionClasses(position: string) {
    switch (position) {
        case "top-left":
            return "top-0 left-0"
        case "top-right":
            return "top-0 right-0"
        case "bottom-left":
            return "bottom-0 left-0"
        case "bottom-right":
            return "bottom-0 right-0"
        default:
            return "bottom-0 right-0"
    }
}
