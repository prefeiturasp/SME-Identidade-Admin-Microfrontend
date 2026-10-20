'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useRealmsList } from "@/hooks/queries/realm/useRealmsList";
import { definirRealmAtivo } from "@/lib/axios-admin";

export const CHAVE_REALM_ATIVO = "admin-mfe:realm-ativo";

type RealmAtivoContextType = {
    realmAtivo: string | null,
    realmPadrao: string | null,
    realmEfetivo: string | null,
    selecionarRealm: (nome: string) => void,
    limparRealm: () => void
};

const RealmAtivoContext = createContext<RealmAtivoContextType>({
    realmAtivo: null,
    realmPadrao: null,
    realmEfetivo: null,
    selecionarRealm: () => { },
    limparRealm: () => { },
});

function lerRealmSalvo(): string | null {
    try {
        return globalThis.localStorage.getItem(CHAVE_REALM_ATIVO);
    } catch {
        return null;
    }
}

function salvarRealm(nome: string | null) {
    try {
        if (nome) {
            globalThis.localStorage.setItem(CHAVE_REALM_ATIVO, nome);
        } else {
            globalThis.localStorage.removeItem(CHAVE_REALM_ATIVO);
        }
    } catch {
        // Sem armazenamento disponível, a escolha vale só até recarregar.
    }
}

export function RealmAtivoProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = useQueryClient();
    const [realmAtivo, setRealmAtivo] = useState<string | null>(null);
    const { data: realms } = useRealmsList();
    const realmPadrao = realms?.find((realm) => realm.padrao)?.nome ?? null;

    const aplicarRealm = useCallback((nome: string | null) => {
        definirRealmAtivo(nome);
        setRealmAtivo(nome);
        // As consultas já carregadas pertencem ao realm anterior.
        queryClient.invalidateQueries().then();
    }, [queryClient]);

    // O armazenamento só existe no navegador, por isso a leitura ocorre após montar.
    useEffect(() => {
        const salvo = lerRealmSalvo();
        if (salvo) aplicarRealm(salvo);
    }, [aplicarRealm]);

    // Sem realm escolhido, o Admin-MS volta a operar no realm configurado nele.
    const limparRealm = useCallback(() => {
        salvarRealm(null);
        aplicarRealm(null);
    }, [aplicarRealm]);

    // Escolher o realm padrão equivale a não ter escolha explícita.
    const selecionarRealm = useCallback((nome: string) => {
        if (nome === realmPadrao) {
            limparRealm();
            return;
        }
        salvarRealm(nome);
        aplicarRealm(nome);
    }, [aplicarRealm, limparRealm, realmPadrao]);

    const value = useMemo(
        () => ({
            realmAtivo,
            realmPadrao,
            realmEfetivo: realmAtivo ?? realmPadrao,
            selecionarRealm,
            limparRealm,
        }),
        [realmAtivo, realmPadrao, selecionarRealm, limparRealm],
    );

    return (
        <RealmAtivoContext.Provider value={value}>
            {children}
        </RealmAtivoContext.Provider>
    );
}

export function useRealmAtivo() {
    return useContext(RealmAtivoContext);
}
