import { Pencil, KeyRound, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { RealmAtivoChip } from "@/components/layout/RealmAtivoChip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProvisionarIdentidadeDialog } from "@/components/identidades/ProvisionarIdentidadeDialog";
import { GestaoPermissoesDialog } from "@/components/identidades/GestaoPermissoesDialog";
import { identidadesMock } from "@/mocks/identidades";

export default function IdentidadesPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <RealmAtivoChip realm="Todos" />

            <PageHeader
                title="Gestão de identidades"
                description="Visão geral dos realms, sistemas e usuários da plataforma de Identidade."
                action={<ProvisionarIdentidadeDialog />}
            />

            <Card>
                <CardContent className="px-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Identidade</TableHead>
                                <TableHead>Tipo / ID SME</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {identidadesMock.map((identidade) => (
                                <TableRow key={identidade.identidade}>
                                    <TableCell>
                                        <p className="font-medium">{identidade.identidade}</p>
                                        {identidade.nome && (
                                            <p className="text-xs text-muted-foreground">{identidade.nome}</p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge>{identidade.tipo}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {identidade.idSme}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">{identidade.estado}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-3 text-muted-foreground">
                                            <button aria-label="Editar" className="hover:text-foreground">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <GestaoPermissoesDialog identidade={identidade} />
                                            <button aria-label="Credenciais" className="hover:text-success">
                                                <KeyRound className="h-4 w-4" />
                                            </button>
                                            <button aria-label="Excluir" className="hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
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
