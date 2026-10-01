"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function ProvisionarIdentidadeDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 w-[296px] max-w-full gap-2 bg-blue-700 text-base font-semibold leading-6 text-white hover:bg-blue-700/90">
                    <Plus className="h-4 w-4" />
                    Novo usuário
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Provisionar identidade</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="nome">Nome</Label>
                        <Input id="nome" placeholder="João" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sobrenome">Sobrenome</Label>
                        <Input id="sobrenome" placeholder="Silva Fernandes" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="login">Login (CPF)</Label>
                        <Input id="login" placeholder="123.456.789-10" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">E-mail institucional</Label>
                        <Input id="email" type="email" placeholder="joaosilva@spassu.com.br" />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                        <Label htmlFor="tipo-sme">Tipo SME</Label>
                        <select
                            id="tipo-sme"
                            className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            defaultValue="Terceirizado / Externo"
                        >
                            <option>Terceirizado / Externo</option>
                            <option>Servidor</option>
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={() => setOpen(false)}>Provisionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
