import type { Metadata } from "next";
import Script from "next/script";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import { ToastContainerGlobal } from "@/components/ToastContainerGlobal";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

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
                <ReactQueryProvider>
                    {children}
                    <ToastContainerGlobal />
                </ReactQueryProvider>
            </body>
        </html>
    );
}
