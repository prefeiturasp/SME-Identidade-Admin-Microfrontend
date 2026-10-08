import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { RealmAtivoChip } from "@/components/layout/RealmAtivoChip";
import { Button } from "@/components/ui/button";
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
import { KeyRoundIcon } from "@/components/icons/KeyRoundIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { RefreshIcon } from "@/components/icons/RefreshIcon";
import { clientsMock } from "@/mocks/sistemas";

export default function SistemasPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <RealmAtivoChip realm="sme-devops" />

            <PageHeader
                title="Administração de sistemas"
                description={
                    <>
                        Gerenciando contexto do realm: <span className="font-semibold text-text-title">sme-devops</span>
                    </>
                }
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="text-action" aria-label="Atualizar lista">
                            <RefreshIcon className="h-4 w-4" />
                        </Button>
                        <Button className="h-12 w-[296px] max-w-full gap-2 bg-blue-700 text-base font-semibold leading-6 text-white hover:bg-blue-700/90">
                            <Plus className="h-3.5 w-3.5 text-white" />
                            Novo client
                        </Button>
                    </div>
                }
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
                        <TableBody>
                            {clientsMock.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <p className="font-bold leading-5">{client.identificador}</p>
                                        <p className="text-[10px] font-normal leading-none text-grey-500">
                                            ID: {client.id}
                                        </p>
                                    </TableCell>
                                    <TableCell>{client.nome}</TableCell>
                                    <TableCell>
                                        <Badge variant="info">{client.protocolo}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">{client.status}</Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-3">
                                            <button aria-label="Credenciais" className="text-action-credentials hover:text-action-credentials/80">
                                                <KeyRoundIcon className="h-4 w-4" />
                                            </button>
                                            <button aria-label="Excluir" className="text-action-delete hover:text-action-delete/80">
                                                <TrashIcon className="h-4 w-4" />
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
