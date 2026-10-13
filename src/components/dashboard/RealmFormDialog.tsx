"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRealmCreate } from "@/hooks/queries/realm/useRealmCreate";
import { useRealmFinalidades } from "@/hooks/queries/realm/useRealmFinalidades";
import { useRealmPatch } from "@/hooks/queries/realm/useRealmPatch";
import type { RealmData, RealmUpdateRequest } from "@/lib/realm/types";

const PADRAO_NOME_REALM = /^[A-Za-z0-9_-]+$/;

type RealmFormDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    realm?: RealmData | null
};

export function RealmFormDialog({ open, onOpenChange, realm }: Readonly<RealmFormDialogProps>) {
    const modoEdicao = Boolean(realm);
    const nomeOriginal = realm?.nome ?? "";
    const nomeExibicaoOriginal = realm?.nome_exibicao ?? "";
    const habilitadoOriginal = realm?.habilitado ?? true;
    const oficialOriginal = realm?.oficial ?? false;
    const finalidadeOriginal = realm?.finalidade ?? "";

    const [nome, setNome] = useState(nomeOriginal);
    const [nomeExibicao, setNomeExibicao] = useState(nomeExibicaoOriginal);
    const [habilitado, setHabilitado] = useState(habilitadoOriginal);
    const [oficial, setOficial] = useState(oficialOriginal);
    const [finalidade, setFinalidade] = useState(finalidadeOriginal);

    // Ao abrir, o formulário reflete o realm selecionado (ou fica vazio na criação).
    useEffect(() => {
        if (open) {
            setNome(nomeOriginal);
            setNomeExibicao(nomeExibicaoOriginal);
            setHabilitado(habilitadoOriginal);
            setOficial(oficialOriginal);
            setFinalidade(finalidadeOriginal);
        }
    }, [open, nomeOriginal, nomeExibicaoOriginal, habilitadoOriginal, oficialOriginal, finalidadeOriginal]);

    const { data: finalidadesData } = useRealmFinalidades();
    const finalidades = finalidadesData?.finalidades ?? [];
    const finalidadePadrao = finalidadesData?.padrao ?? "Produção";

    // Realm protegido ou marcado como oficial não pode ser desabilitado;
    // retirar a marcação e desabilitar exigem salvamentos separados.
    const habilitadoBloqueado = oficial || Boolean(realm?.protegido);

    const handleChangeOficial = (marcado: boolean) => {
        setOficial(marcado);
        if (marcado) setHabilitado(true);
    };

    const handleCloseModal = () => onOpenChange(false);
    const { mutationPost } = useRealmCreate({ handleCloseModal });
    const { mutationPatch } = useRealmPatch({ handleCloseModal });

    const nomeTratado = nome.trim();
    const nomeValido = PADRAO_NOME_REALM.test(nomeTratado);

    const alteracoes: RealmUpdateRequest = {};
    if (nomeExibicao !== nomeExibicaoOriginal) alteracoes.nome_exibicao = nomeExibicao;
    if (habilitado !== habilitadoOriginal) alteracoes.habilitado = habilitado;
    if (oficial !== oficialOriginal) alteracoes.oficial = oficial;
    if (finalidade !== finalidadeOriginal) alteracoes.finalidade = finalidade;

    const semAlteracoes = modoEdicao && Object.keys(alteracoes).length === 0;
    const enviando = mutationPost.isPending || mutationPatch.isPending;
    const podeSalvar = modoEdicao ? !semAlteracoes : nomeValido;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!podeSalvar) return;

        if (modoEdicao) {
            mutationPatch.mutate({ nome: nomeOriginal, ...alteracoes });
        } else {
            mutationPost.mutate({
                nome: nomeTratado,
                nome_exibicao: nomeExibicao,
                habilitado,
                oficial,
                finalidade: oficial ? "" : finalidade,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{modoEdicao ? "Editar realm" : "Novo realm"}</DialogTitle>
                </DialogHeader>
                <form id="form-realm" onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="realm-nome">Nome do realm*</Label>
                        <Input
                            id="realm-nome"
                            name="realm-nome"
                            placeholder="sme-apps"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            maxLength={255}
                            disabled={modoEdicao}
                            required
                        />
                        {!modoEdicao && nomeTratado && !nomeValido && (
                            <p className="text-sm text-destructive">
                                Use apenas letras, números, hífen ou sublinhado.
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="realm-nome-exibicao">Nome de exibição</Label>
                        <Input
                            id="realm-nome-exibicao"
                            name="realm-nome-exibicao"
                            placeholder="SME Apps"
                            value={nomeExibicao}
                            onChange={(e) => setNomeExibicao(e.target.value)}
                            maxLength={255}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="realm-oficial"
                            name="realm-oficial"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={oficial}
                            onChange={(e) => handleChangeOficial(e.target.checked)}
                        />
                        <Label htmlFor="realm-oficial">Topologia oficial SME</Label>
                    </div>
                    {!oficial && (
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="realm-finalidade">Finalidade</Label>
                            <select
                                id="realm-finalidade"
                                name="realm-finalidade"
                                value={finalidade}
                                onChange={(e) => setFinalidade(e.target.value)}
                                className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">{finalidadePadrao}</option>
                                {finalidades.map((opcao) => (
                                    <option key={opcao} value={opcao}>{`Teste / ${opcao}`}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <fieldset className="flex flex-col gap-1.5">
                        <legend className="mb-1.5 text-sm font-medium leading-none">Situação</legend>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    id="realm-habilitado"
                                    name="realm-situacao"
                                    type="radio"
                                    className="h-4 w-4"
                                    checked={habilitado}
                                    onChange={() => setHabilitado(true)}
                                />
                                <Label htmlFor="realm-habilitado">Habilitado</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="realm-desabilitado"
                                    name="realm-situacao"
                                    type="radio"
                                    className="h-4 w-4"
                                    checked={!habilitado}
                                    disabled={habilitadoBloqueado}
                                    onChange={() => setHabilitado(false)}
                                />
                                <Label htmlFor="realm-desabilitado">Desabilitado</Label>
                            </div>
                        </div>
                        {habilitadoBloqueado && (
                            <p className="text-sm text-grey-600">
                                Realms da topologia oficial, o master e o realm da aplicação não podem ser desativados.
                            </p>
                        )}
                    </fieldset>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="form-realm"
                        disabled={!podeSalvar || enviando}
                    >
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
