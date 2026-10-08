"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useIdentidadeContext } from "@/app/identidades/hooks/useIdentidadeContext";

export function ConfirmarExclusaoDialog() {
    const {
        handleCloseConfirmDelete,
        openConfirmDelete,
        handleDeleteUser,
    } = useIdentidadeContext()

    return (
        <Dialog open={openConfirmDelete} onOpenChange={handleCloseConfirmDelete}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold">Confirmar exclusão</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4">
                    <h3>Tem certeza que deseja excluir esta identidade?</h3>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseConfirmDelete}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" type="button" onClick={handleDeleteUser}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
