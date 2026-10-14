export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
    const config = {
        NEXT_PUBLIC_ADMIN_MS_URL: process.env.NEXT_PUBLIC_ADMIN_MS_URL ?? "",
        NEXT_PUBLIC_ADMIN_CLIENT_ID: process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID ?? "",
        NEXT_PUBLIC_ADMIN_CLIENT_SECRET: process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ?? "",
    };

    return new Response(`globalThis.__ADMIN_CONFIG__ = ${JSON.stringify(config)};`, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Content-Type": "application/javascript; charset=utf-8",
            Expires: "0",
            Pragma: "no-cache",
        },
    });
}
