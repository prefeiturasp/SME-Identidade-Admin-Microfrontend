import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/AppShell";

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
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
