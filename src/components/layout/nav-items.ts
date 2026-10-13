import { LayoutGrid, Users, Monitor, Layers, type LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { title: "Identidades", href: "/identidades", icon: Users },
    { title: "Sistemas (Clients)", href: "/sistemas", icon: Monitor },
    { title: "Blueprints", href: "/blueprints", icon: Layers },
];
