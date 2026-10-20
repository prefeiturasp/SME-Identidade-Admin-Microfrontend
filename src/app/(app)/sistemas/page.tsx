import { PageHeader } from "@/components/layout/PageHeader";
import { RealmAtivoChip } from "@/components/layout/RealmAtivoChip";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SistemasProvider } from "./context/SistemasContext";
import { TableBodySistemas } from "./components/TableBodySistemas";
import { PaginationSistemas } from "./components/PaginationSistemas";
import { CriarClienteDialog } from "@/components/sistemas/CriarClienteDialog";
import { ConfirmarDesativacaoDialog } from "@/components/sistemas/ConfirmarDesativacaoDialog";
import { VisualizarSecretRotacionarDialog } from "@/components/sistemas/VisualizarSecretRotacionarDialog";

export default function SistemasPage() {
    return (
        <SistemasProvider>
            <div className="flex flex-col gap-6 p-6">
                <RealmAtivoChip />

                <PageHeader
                    title="Administração de sistemas"
                    description={
                        <>
                            Gerenciando contexto do realm: <span className="font-semibold text-text-title">sme-devops</span>
                        </>
                    }
                    action={<CriarClienteDialog />}
                />

                <Card>
                    <CardContent className="px-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Identificador</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Protocolo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-px whitespace-nowrap">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBodySistemas />
                        </Table>
                        <PaginationSistemas />
                    </CardContent>
                </Card>
            </div>

            <ConfirmarDesativacaoDialog />
            <VisualizarSecretRotacionarDialog />
        </SistemasProvider>
    );
}
