import type { Metadata } from "next";
import Script from "next/script";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"

import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "SME Identidade - Admin",
    description: "Administração de clients, roles e grupos da plataforma de Identidade.",
};

const basePath = process.env.NEXT_BASE_PATH ?? "/admin";
const runtimeEnvPath = `${basePath === "/" ? "" : basePath}/runtime-env.js`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>
                <Script src={runtimeEnvPath} strategy="beforeInteractive" />
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </body>
        </html>
    );
}
