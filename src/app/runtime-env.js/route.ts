export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
    const readRuntimeEnv = (name: string) => process.env[name] ?? "";
    const config = {
        NEXT_PUBLIC_ADMIN_MS_URL: readRuntimeEnv("NEXT_PUBLIC_ADMIN_MS_URL"),
        NEXT_PUBLIC_ADMIN_CLIENT_ID: readRuntimeEnv("NEXT_PUBLIC_ADMIN_CLIENT_ID"),
        NEXT_PUBLIC_ADMIN_CLIENT_SECRET: readRuntimeEnv("NEXT_PUBLIC_ADMIN_CLIENT_SECRET"),
    };

    return new Response(`globalThis.__ADMIN_CONFIG__ = ${JSON.stringify(config)};`, {
        headers: {
            "Cache-Control": "private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
            "Content-Type": "application/javascript; charset=utf-8",
            Expires: "0",
            Pragma: "no-cache",
            Vary: "*",
        },
    });
}
