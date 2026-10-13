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
import { SpinnerCustom } from "../SpinnerCustom";
import { Separator } from "../ui/separator";

export function VisualizarSecretRotacionarDialog() {
    const {
        isLoadingClientRotate,
        detailRotatedSecret,
        openRotateDialog,
        setDetailRotatedSecret,
        setOpenRotateDialog
    } = useSistemasContext()

    const handleCopyToClipboard = () => {
        const secret = detailRotatedSecret?.secret || '';
        navigator.clipboard.writeText(secret)
            .then(() => {
                alert('Secret copiado para a área de transferência');
            })
            .catch((err) => {
                console.error('Erro ao copiar o secret: ', err);
                alert('Falha ao copiar o secret');
            });
    };

    const handleCloseDialog = () => {
        setOpenRotateDialog(false);
        setDetailRotatedSecret(null);
    };

    return (
        <Dialog open={isLoadingClientRotate || openRotateDialog} onOpenChange={handleCloseDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold">Confirmação de rotação de secret</DialogTitle>
                </DialogHeader>

                {
                    isLoadingClientRotate ? (
                        <SpinnerCustom />
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <Separator />

                            <div className="grid grid-cols-1 gap-2">
                                <h6 className="font-bold text-sm">Client ID:</h6>
                                <div className="bg-gray-100 p-2 rounded-md">
                                    <p className="text-sm">{detailRotatedSecret?.clientId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <h6 className="font-bold text-sm">Client Secret:</h6>
                                <div className="bg-gray-100 p-2 rounded-md">
                                    <p className="text-sm">{detailRotatedSecret?.secret}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                        Fechar
                    </Button>
                    <Button type="button" onClick={handleCopyToClipboard}>
                        Copiar Secret
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
