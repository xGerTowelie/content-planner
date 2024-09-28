import { Button } from "@/components/ui/button"
import { HomeIcon, FolderIcon, CalendarIcon, SettingsIcon } from "lucide-react"
import Link from 'next/link'
import SignOutButton from './SignOutButton'

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-8 lg:block hidden">VidManager</h1>
            <nav className="flex-1">
                {[
                    { icon: HomeIcon, label: "Dashboard", href: "/dashboard" },
                    { icon: FolderIcon, label: "Projects", href: "/dashboard" },
                    { icon: CalendarIcon, label: "Timeline", href: "/dashboard/timeline" },
                    { icon: SettingsIcon, label: "Settings", href: "/dashboard/settings" },
                ].map((item, i) => (
                    <Link key={i} href={item.href}>
                        <Button variant="ghost" className="w-full justify-start mb-2">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </nav>
            <SignOutButton />
        </aside>
    )
}
