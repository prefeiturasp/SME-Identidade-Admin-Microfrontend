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
                    <Button>
                        <Plus className="h-4 w-4" />
                        Novo realm (Provisionar)
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-normal text-muted-foreground">
                            Realms ativos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">
                            {dashboardContadores.realmsAtivos}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-normal text-muted-foreground">
                            Sistemas (Clients)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">
                            {dashboardContadores.sistemasClients}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-normal text-muted-foreground">
                            Usuários base
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">
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
                                <p className="font-semibold">{realm.nome}</p>
                                <p className="mb-4 text-sm text-muted-foreground">{realm.descricao}</p>
                                <Button className="w-full">Selecionar</Button>
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
                                        <Button variant="outline" className="border-primary px-16 text-primary hover:bg-primary/5 hover:text-primary">
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
