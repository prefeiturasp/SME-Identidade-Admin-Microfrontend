'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type UsuarioSessao = { nome: string, login: string };

type SessaoContextType = {
    usuario: UsuarioSessao | null,
    sair: () => Promise<void>
};

const SessaoContext = createContext<SessaoContextType>({
    usuario: null,
    sair: async () => { },
});

type SessaoProviderProps = {
    usuario: UsuarioSessao,
    basePath: string,
    children: React.ReactNode
};

export function SessaoProvider({ usuario, basePath, children }: Readonly<SessaoProviderProps>) {
    const router = useRouter();
    const pathname = usePathname();
    const primeiraRenderizacao = useRef(true);

    // O layout protegido só roda no carregamento completo; nas trocas de tela
    // a sessão é conferida aqui, para respeitar expiração e logout global.
    useEffect(() => {
        if (primeiraRenderizacao.current) {
            primeiraRenderizacao.current = false;
            return;
        }

        fetch(`${basePath}/api/sessao`, { cache: "no-store" })
            .then((resposta) => {
                if (resposta.status === 401) globalThis.location.assign(`${basePath}/api/logout`);
            })
            .catch(() => { });
    }, [pathname, basePath]);

    const sair = useCallback(async () => {
        await fetch(`${basePath}/api/logout`, { method: "POST" }).catch(() => { });
        router.replace("/login");
        router.refresh();
    }, [basePath, router]);

    const value = useMemo(() => ({ usuario, sair }), [usuario, sair]);

    return (
        <SessaoContext.Provider value={value}>
            {children}
        </SessaoContext.Provider>
    );
}

export function useSessao() {
    return useContext(SessaoContext);
}
