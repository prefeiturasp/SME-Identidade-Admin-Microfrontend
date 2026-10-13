import type { Metadata } from "next";
import Script from "next/script";
import { AppShell } from "@/components/layout/AppShell";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"

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
                <Script src="/admin/env.js" strategy="beforeInteractive" />
                <ReactQueryProvider>
                    <AppShell>{children}</AppShell>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
