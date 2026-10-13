"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSistemasContext } from "@/app/sistemas/hooks/useSistemasContext";

export function ConfirmarDesativacaoDialog() {
    const {
        handleCloseConfirmDelete,
        openConfirmDelete,
        handleDeleteClient,
    } = useSistemasContext()

    return (
        <Dialog open={openConfirmDelete} onOpenChange={handleCloseConfirmDelete}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold">Confirmar desativação</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4">
                    <h3>Tem certeza que deseja desativar este client?</h3>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseConfirmDelete}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" type="button" onClick={handleDeleteClient}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
