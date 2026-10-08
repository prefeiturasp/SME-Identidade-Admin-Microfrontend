import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    dashboardContadores,
    realmsOutrosTestes,
    realmsTopologiaOficial,
} from "@/mocks/dashboard";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <PageHeader
                title="Painel de controle"
                description="Visão geral dos realms, sistemas e usuários da plataforma de Identidade."
                action={
                    <Button className="h-12 w-[296px] max-w-full gap-2 bg-blue-700 text-base font-semibold leading-6 text-white hover:bg-blue-700/90">
                        <Plus className="h-3.5 w-3.5 text-white" />
                        Novo realm (Provisionar)
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold leading-none text-grey-700">
                            Realms ativos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[32px] font-bold leading-none text-action">
                            {dashboardContadores.realmsAtivos}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold leading-none text-grey-700">
                            Sistemas (Clients)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[32px] font-bold leading-none text-action">
                            {dashboardContadores.sistemasClients}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold leading-none text-grey-700">
                            Usuários base
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[32px] font-bold leading-none text-action">
                            {dashboardContadores.usuariosBase}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Topologia oficial SME</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {realmsTopologiaOficial.map((realm) => (
                            <div key={realm.nome} className="rounded-lg border p-4">
                                <p className="text-base font-bold leading-none text-text-title">
                                    {realm.nome}
                                </p>
                                <p className="mb-4 mt-[10px] text-sm font-normal leading-none text-grey-600">
                                    {realm.descricao}
                                </p>
                                <Button className="h-8 w-[324px] max-w-full bg-blue-700 text-sm font-semibold leading-6 text-primary-foreground hover:bg-blue-700/90">
                                    Selecionar
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
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
                        <TableBody>
                            {realmsOutrosTestes.map((realm, index) => (
                                <TableRow key={`${realm.nome}-${index}`}>
                                    <TableCell>{realm.nome}</TableCell>
                                    <TableCell>
                                        <Badge variant="warning">{realm.status}</Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <Button
                                            variant="outline"
                                            className="h-8 w-[200px] border-action bg-white text-sm font-semibold leading-6 text-action hover:bg-action/5 hover:text-action"
                                        >
                                            Selecionar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
