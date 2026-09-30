import { LayoutGrid, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { title: "Identidades", href: "/identidades", icon: Users },
];
