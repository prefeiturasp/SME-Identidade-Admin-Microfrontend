"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "@/components/layout/nav-items";
import { mockSession } from "@/lib/auth/mock-session";

export function AppSidebar() {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between px-1 py-1">
                    <div className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:hidden">
                        <PanelLeft className="h-5 w-5 shrink-0" />
                        <span className="truncate font-semibold">SME Identidade</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="shrink-0 rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        aria-label="Alternar menu lateral"
                    >
                        <PanelLeft className="h-4 w-4" />
                    </button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/20 px-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
                    <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                        <p className="truncate text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/70">
                            Real ativo
                        </p>
                        <p className="truncate text-sm font-semibold">
                            {mockSession.usuario.realmAtivo}
                        </p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
