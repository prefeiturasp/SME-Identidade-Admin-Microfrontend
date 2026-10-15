import type { Metadata } from "next";
import Script from "next/script";
import { AppShell } from "@/components/layout/AppShell";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import { RealmAtivoProvider } from "@/providers/RealmAtivoProvider";

import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "SME Identidade - Admin",
    description: "Administração de clients, roles e grupos da plataforma de Identidade.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>
                <Script src="/admin/runtime-env.js" strategy="beforeInteractive" />
                <ReactQueryProvider>
                    <RealmAtivoProvider>
                        <AppShell>{children}</AppShell>
                    </RealmAtivoProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
