"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { RealmFormDialog } from "@/components/dashboard/RealmFormDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useClientsList } from "@/hooks/queries/client-admin/useClientsList";
import { useRealmFinalidades } from "@/hooks/queries/realm/useRealmFinalidades";
import { useRealmsList } from "@/hooks/queries/realm/useRealmsList";
import { useUsersList } from "@/hooks/queries/user/useUsersList";
import { useRealmAtivo } from "@/providers/RealmAtivoProvider";
import type { RealmData } from "@/lib/realm/types";

function Contador({ titulo, valor, carregando, descricao }: Readonly<{ titulo: string, valor?: number, carregando: boolean, descricao?: string }>) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-bold leading-none text-grey-700">
                    {titulo}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {carregando ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <p className="text-[32px] font-bold leading-none text-action">
                        {valor ?? "-"}
                    </p>
                )}
                {descricao && (
                    <p className="mt-2 text-xs text-grey-600">{descricao}</p>
                )}
            </CardContent>
        </Card>
    );
}

function descreverRealm(realmSelecionado: string | null, realmPadrao?: string | null) {
    if (realmSelecionado) return `Realm: ${realmSelecionado}`;
    if (realmPadrao) return `Realm: ${realmPadrao} (padrão)`;
    return "Realm: padrão";
}

function BadgeDesabilitado({ realm }: Readonly<{ realm: RealmData }>) {
    if (realm.habilitado) return null;
    return <Badge variant="destructive">Desabilitado</Badge>;
}

// Realm sem finalidade de teste está em uso normal.
function StatusRealm({ realm, finalidadePadrao }: Readonly<{ realm: RealmData, finalidadePadrao: string }>) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {realm.finalidade ? (
                <Badge variant="warning">{`Teste / ${realm.finalidade}`}</Badge>
            ) : (
                <Badge variant="success">{finalidadePadrao}</Badge>
            )}
            <BadgeDesabilitado realm={realm} />
        </div>
    );
}

function BotaoEditar({ realm, onClick }: Readonly<{ realm: RealmData, onClick: () => void }>) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-action hover:bg-action/5 hover:text-action"
            aria-label={`Editar ${realm.nome}`}
            title="Editar"
            onClick={onClick}
        >
            <Pencil className="h-4 w-4" />
        </Button>
    );
}

export default function DashboardPage() {
    const { data: realms, isLoading, isError } = useRealmsList();
    const { data: clients, isLoading: isLoadingClients } = useClientsList();
    const { data: usuarios, isLoading: isLoadingUsuarios } = useUsersList({ page: 1, pageSize: 1 });
    const { data: finalidadesData } = useRealmFinalidades();
    const finalidadePadrao = finalidadesData?.padrao ?? "Produção";

    const { realmAtivo, selecionarRealm, limparRealm } = useRealmAtivo();
    const [dialogAberto, setDialogAberto] = useState(false);
    const [realmSelecionado, setRealmSelecionado] = useState<RealmData | null>(null);

    const realmPadrao = realms?.find((realm) => realm.padrao)?.nome;
    // Sem escolha explícita, o realm de trabalho é o padrão do Admin-MS.
    const realmEfetivo = realmAtivo ?? realmPadrao;
    const selecaoExplicita = Boolean(realmAtivo) && realmAtivo !== realmPadrao;
    const descricaoRealm = descreverRealm(selecaoExplicita ? realmAtivo : null, realmPadrao);

    const realmsOficiais = realms?.filter((realm) => realm.oficial) ?? [];
    const realmsOutros = realms?.filter((realm) => !realm.oficial) ?? [];

    const abrirDialog = (realm: RealmData | null) => {
        setRealmSelecionado(realm);
        setDialogAberto(true);
    };

    // Realm desabilitado não aceita operações, por isso não pode virar o de trabalho.
    const renderSelecionar = (realm: RealmData, className: string, variant?: "outline") => {
        const selecionado = realm.nome === realmEfetivo;
        return (
            <Button
                variant={variant}
                className={className}
                disabled={selecionado || !realm.habilitado || !realm.nome}
                onClick={() => realm.nome && selecionarRealm(realm.nome)}
            >
                {selecionado ? "Selecionado" : "Selecionar"}
            </Button>
        );
    };

    const renderEstado = (vazio: string) => {
        if (isLoading) return <Skeleton className="h-8 w-full" data-testid="realms-carregando" />;
        if (isError) return <p className="text-center text-destructive">Não foi possível carregar os realms.</p>;
        return <p className="text-center text-grey-600">{vazio}</p>;
    };

    const renderTopologiaOficial = () => {
        if (isLoading || isError || !realmsOficiais.length) {
            return renderEstado("Nenhum realm na topologia oficial.");
        }
        return (
            <div className="grid gap-4 sm:grid-cols-3" data-testid="topologia-oficial">
                {realmsOficiais.map((realm) => (
                    <div key={realm.id ?? realm.nome} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-base font-bold leading-none text-text-title">
                                {realm.nome}
                            </p>
                            <BadgeDesabilitado realm={realm} />
                        </div>
                        <p className="mb-4 mt-[10px] text-sm font-normal leading-none text-grey-600">
                            {realm.nome_exibicao || "-"}
                        </p>
                        <div className="flex items-center gap-2">
                            {renderSelecionar(
                                realm,
                                "h-8 w-[324px] max-w-full bg-blue-700 text-sm font-semibold leading-6 text-primary-foreground hover:bg-blue-700/90",
                            )}
                            <BotaoEditar realm={realm} onClick={() => abrirDialog(realm)} />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderOutros = () => {
        if (isLoading || isError || !realmsOutros.length) {
            return (
                <TableRow>
                    <TableCell colSpan={3}>{renderEstado("Nenhum realm em outros / testes.")}</TableCell>
                </TableRow>
            );
        }
        return realmsOutros.map((realm) => (
            <TableRow key={realm.id ?? realm.nome}>
                <TableCell>{realm.nome}</TableCell>
                <TableCell>
                    <StatusRealm realm={realm} finalidadePadrao={finalidadePadrao} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <BotaoEditar realm={realm} onClick={() => abrirDialog(realm)} />
                        {renderSelecionar(
                            realm,
                            "h-8 w-[200px] border-action bg-white text-sm font-semibold leading-6 text-action hover:bg-action/5 hover:text-action",
                            "outline",
                        )}
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <PageHeader
                title="Painel de controle"
                description="Visão geral dos realms, sistemas e usuários da plataforma de Identidade."
                action={
                    <Button
                        className="h-12 w-[296px] max-w-full gap-2 bg-blue-700 text-base font-semibold leading-6 text-white hover:bg-blue-700/90"
                        onClick={() => abrirDialog(null)}
                    >
                        <Plus className="h-3.5 w-3.5 text-white" />
                        Novo realm (Provisionar)
                    </Button>
                }
            />

            {selecaoExplicita && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-action/30 bg-action/5 px-4 py-3">
                    <p className="text-sm text-text-title">
                        Exibindo sistemas e usuários do realm <span className="font-bold">{realmAtivo}</span>.
                    </p>
                    <Button
                        variant="outline"
                        className="h-8 border-action bg-white text-sm font-semibold text-action hover:bg-action/5 hover:text-action"
                        onClick={limparRealm}
                    >
                        Limpar seleção
                    </Button>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
                <Contador titulo="Realms ativos" valor={realms?.filter((realm) => realm.habilitado).length} carregando={isLoading} descricao="Todos os realms" />
                <Contador titulo="Sistemas (Clients)" valor={clients?.length} carregando={isLoadingClients} descricao={descricaoRealm} />
                <Contador titulo="Usuários base" valor={usuarios?.count} carregando={isLoadingUsuarios} descricao={descricaoRealm} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Topologia oficial SME</CardTitle>
                </CardHeader>
                <CardContent>{renderTopologiaOficial()}</CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Outros / testes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do realm</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-px whitespace-nowrap">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{renderOutros()}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            <RealmFormDialog
                open={dialogAberto}
                onOpenChange={setDialogAberto}
                realm={realmSelecionado}
            />
        </div>
    );
}
