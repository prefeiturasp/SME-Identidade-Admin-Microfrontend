/** Prefixo sob o qual a aplicação é servida (o mesmo `basePath` do Next). */
export function caminhoBase(): string {
    return process.env.NEXT_BASE_PATH ?? "/admin";
}
