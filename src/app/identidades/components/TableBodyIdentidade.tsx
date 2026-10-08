'use client'

import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GestaoPermissoesDialog } from "@/components/identidades/GestaoPermissoesDialog";

import { EditSquareIcon } from "@/components/icons/EditSquareIcon";
import { KeyRoundIcon } from "@/components/icons/KeyRoundIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";

import { useIdentidadeContext } from "../hooks/useIdentidadeContext";
import { TooltipCustom } from "@/components/TooltipCustom";

export function TableBodyIdentidade() {
    const { dataUserList, handleOpenModalDataForm, handleOpenConfirmDelete } = useIdentidadeContext();

    return (
        <TableBody>
            {dataUserList?.results?.map((identidade) => (
                <TableRow key={identidade.id}>
                    <TableCell>
                        <p className="font-normal">{identidade.username}</p>
                        {identidade.firstName && (
                            <p className="text-[10px] font-normal leading-none text-grey-500">
                                {identidade.firstName} {identidade.lastName}
                            </p>
                        )}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Badge variant="info">{identidade.tipo_usuario ?? 'N/A'}</Badge>
                            <span className="text-xs text-muted-foreground">
                                {identidade.rf ?? 'N/A'}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={identidade.enabled ? "success" : "destructive"}>{identidade.enabled ? 'Ativo' : 'Inativo'}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center justify-end gap-3">
                            <TooltipCustom side="top" title={identidade.enabled ? "Editar" : ""}>
                                <button
                                    disabled={!identidade.enabled}
                                    aria-label="Editar"
                                    className="text-grey-500 hover:text-grey-700 disabled:text-zinc-300"
                                    onClick={() => handleOpenModalDataForm({
                                        nome: identidade.firstName,
                                        sobrenome: identidade.lastName,
                                        cpf: identidade.cpf,
                                        email: identidade.email,
                                        tipo_usuario: identidade.tipo_usuario,
                                        usuario: identidade.username,
                                        rf: identidade.rf,
                                        id: identidade.id
                                    })}
                                >
                                    <EditSquareIcon className="h-5 w-5" />
                                </button>
                            </TooltipCustom>

                            <GestaoPermissoesDialog identidade={identidade} />

                            <button aria-label="Credenciais" className="text-action-credentials hover:text-action-credentials/80">
                                <KeyRoundIcon className="h-4 w-4" />
                            </button>

                            <TooltipCustom side="top" title={identidade.enabled ? "Desativar" : ""}>
                                <button
                                    disabled={!identidade.enabled}
                                    aria-label="Excluir"
                                    className="text-action-delete hover:text-action-delete/80 disabled:text-zinc-300"
                                    onClick={() => handleOpenConfirmDelete({
                                        nome: identidade.firstName,
                                        sobrenome: identidade.lastName,
                                        cpf: identidade.cpf,
                                        email: identidade.email,
                                        tipo_usuario: identidade.tipo_usuario,
                                        usuario: identidade.username,
                                        rf: identidade.rf,
                                        id: identidade.id
                                    })}
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
