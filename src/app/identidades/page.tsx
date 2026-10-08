import { PageHeader } from "@/components/layout/PageHeader";
import { RealmAtivoChip } from "@/components/layout/RealmAtivoChip";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProvisionarIdentidadeDialog } from "@/components/identidades/ProvisionarIdentidadeDialog";
import { IdentidadeProvider } from "./context/IdentidadeContext";
import { TableBodyIdentidade } from "./components/TableBodyIdentidade";
import { ConfirmarExclusaoDialog } from "@/components/identidades/ConfirmarExclusaoDialog";
import { PaginationIdentidade } from "./components/PaginationIdentidade";

export default function IdentidadesPage() {
    return (
        <IdentidadeProvider>
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
                            <TableBodyIdentidade />
                        </Table>
                        <PaginationIdentidade />
                    </CardContent>
                </Card>
            </div>

            <ConfirmarExclusaoDialog />
        </IdentidadeProvider>
    );
}
