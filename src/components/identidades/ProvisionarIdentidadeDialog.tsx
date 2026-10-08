"use client";

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
} from "@/components/ui/dialog";
import { useIdentidadeContext } from "@/app/identidades/hooks/useIdentidadeContext";

export function ProvisionarIdentidadeDialog() {
    const {
        handleOpenModalDataForm,
        handleCloseModalDataForm,
        openModalDataForm,
        userDataForm,
        setUserDataForm,
        handleSubmitUserForm
    } = useIdentidadeContext()

    const handleChangeUserDataForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, fieldName: keyof typeof userDataForm) => {
        const value = e.target.value;

        const newValue = { ...userDataForm, [fieldName]: value };

        setUserDataForm(newValue);
    }

    return (
        <>
            <Button
                className="h-12 w-[296px] max-w-full gap-2 bg-blue-700 text-base font-semibold leading-6 text-white hover:bg-blue-700/90"
                onClick={() => handleOpenModalDataForm()}
            >
                <Plus className="h-4 w-4" />
                Novo usuário
            </Button>

            <Dialog open={openModalDataForm} onOpenChange={handleCloseModalDataForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Provisionar identidade</DialogTitle>
                    </DialogHeader>
                    <form id="form-provisionar-identidade" onSubmit={handleSubmitUserForm} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nome">Nome*</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    placeholder="João"
                                    value={userDataForm?.nome || ""}
                                    onChange={(e) => handleChangeUserDataForm(e, "nome")}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="sobrenome">Sobrenome*</Label>
                                <Input
                                    id="sobrenome"
                                    name="sobrenome"
                                    placeholder="Silva Fernandes"
                                    value={userDataForm?.sobrenome || ""}
                                    onChange={(e) => handleChangeUserDataForm(e, "sobrenome")}
                                    required
                                />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label htmlFor="login">Login (CPF)*</Label>
                                <Input
                                    id="login"
                                    name="login"
                                    placeholder="123.456.789-10"
                                    value={userDataForm?.cpf || ""}
                                    onChange={(e) => handleChangeUserDataForm(e, "cpf")}
                                    required
                                    maxLength={11}
                                />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label htmlFor="email">E-mail institucional*</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="joaosilva@spassu.com.br"
                                    value={userDataForm?.email || ""}
                                    onChange={(e) => handleChangeUserDataForm(e, "email")}
                                    required
                                />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label htmlFor="tipo-sme">Tipo SME*</Label>
                                <select
                                    id="tipo-sme"
                                    name="tipo-sme"
                                    value={userDataForm?.tipo_usuario || ""}
                                    onChange={(e) => handleChangeUserDataForm(e, "tipo_usuario")}
                                    className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="">Selecione uma opção</option>
                                    <option value="legado-coresso">Terceirizado / Externo</option>
                                    <option value="servidor">Servidor</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModalDataForm}>
                            Cancelar
                        </Button>
                        <Button type="submit" form="form-provisionar-identidade">
                            Provisionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
