'use client'

import { Badge } from "@/components/ui/badge";
import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { KeyRoundIcon } from "@/components/icons/KeyRoundIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { useSistemasContext } from "../hooks/useSistemasContext";
import { SpinnerCustom } from "@/components/SpinnerCustom";
import { TooltipCustom } from "@/components/TooltipCustom";
import { EditSquareIcon } from "@/components/icons/EditSquareIcon";

export function TableBodySistemas() {
    const {
        dataClientsListPaginated,
        isLoadingDataClientsList,
        handleOpenConfirmDelete,
        handleOpenModalDataForm,
        handleRotateClientSecret,
    } = useSistemasContext();

    if (isLoadingDataClientsList) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5}>
                        <SpinnerCustom />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
        <TableBody>
            {dataClientsListPaginated?.map((client) => (
                <TableRow key={client.id}>
                    <TableCell>
                        <p className="font-bold leading-5">{client.client_id}</p>
                        <p className="text-[10px] font-normal leading-none text-grey-500">
                            ID: {client.id}
                        </p>
                    </TableCell>
                    <TableCell>{client.nome}</TableCell>
                    <TableCell>
                        <Badge variant="info">{client.protocolo}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={client.habilitado ? "success" : "destructive"}>{client.habilitado ? 'Ativo' : 'Inativo'}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                            <TooltipCustom side="top" title="Alterar">
                                <button
                                    aria-label="Editar"
                                    className="text-grey-500 hover:text-grey-700 disabled:text-zinc-300"
                                    onClick={() => handleOpenModalDataForm({ ...client })}
                                >
                                    <EditSquareIcon className="h-5 w-5" />
                                </button>
                            </TooltipCustom>

                            <TooltipCustom side="top" title="Rotacionar Secret">
                                <button
                                    type="button"
                                    aria-label="Credenciais"
                                    className="text-action-credentials hover:text-action-credentials/80"
                                    onClick={() => handleRotateClientSecret(client.id, client.client_id)}
                                >
                                    <KeyRoundIcon className="h-4 w-4" />
                                </button>
                            </TooltipCustom>

                            <TooltipCustom side="top" title={client.habilitado ? "Desativar" : ""}>
                                <button
                                    disabled={!client.habilitado}
                                    aria-label="Excluir"
                                    className="text-action-delete hover:text-action-delete/80 disabled:text-zinc-300"
                                    onClick={() => handleOpenConfirmDelete({ ...client })}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </TooltipCustom>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
