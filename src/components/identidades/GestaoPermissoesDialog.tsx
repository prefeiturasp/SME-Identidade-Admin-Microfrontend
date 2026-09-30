"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { IdentidadeMock } from "@/mocks/identidades";

export function GestaoPermissoesDialog({ identidade }: { identidade: IdentidadeMock }) {
    const [open, setOpen] = useState(false);
    const iniciais = (identidade.nome || identidade.identidade).slice(0, 2).toUpperCase();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <button
                aria-label="Permissões"
                className="hover:text-primary"
                onClick={() => setOpen(true)}
            >
                <ShieldCheck className="h-4 w-4" />
            </button>
            <DialogContent>
                <DialogHeader className="flex-row items-center gap-3 space-y-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-semibold text-destructive">
                        {iniciais}
                    </div>
                    <div>
                        <DialogTitle>{identidade.identidade}</DialogTitle>
                        {identidade.nome && (
                            <p className="text-sm text-muted-foreground">{identidade.nome}</p>
                        )}
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-2">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Grupos ativos
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Este usuário não possui grupos no realm sme-apps.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Roles de sistema
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Nenhuma role associada no contexto atual.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Fechar gestão</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
