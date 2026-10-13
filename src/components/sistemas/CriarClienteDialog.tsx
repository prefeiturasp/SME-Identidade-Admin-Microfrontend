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
import { RefreshIcon } from "@/components/icons/RefreshIcon";
import { useIdentidadeContext } from "@/app/identidades/hooks/useIdentidadeContext";
import { useSistemasContext } from "@/app/sistemas/hooks/useSistemasContext";
import { Switch } from "../ui/switch";
import { TrashIcon } from "../icons/TrashIcon";
import { Separator } from "../ui/separator";

export function CriarClienteDialog() {
    const {
        handleOpenModalDataForm,
        handleCloseModalDataForm,
        openModalDataForm,
        handleSubmitClientForm,
        handleRefreshDataClientsList,
        clientDataForm,
        setClientDataForm,
        clientDataFormAttributes,
        setClientDataFormAttributes,
    } = useSistemasContext()

    const handleChangeClientDataForm = (value: unknown, fieldName: keyof typeof clientDataForm) => {
        const newValue = { ...clientDataForm, [fieldName]: value };

        setClientDataForm(newValue);
    }

    const handleChangeClientDataFormAttributes = (value: string[][]) => {
        setClientDataFormAttributes(value);
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 text-action"
                    aria-label="Atualizar lista"
                    onClick={handleRefreshDataClientsList}
                >
                    <RefreshIcon className="h-4 w-4" />
                </Button>

                <Button
                    className="h-12 w-[296px] max-w-full gap-2 bg-blue-700 text-base font-semibold leading-6 text-white hover:bg-blue-700/90"
                    onClick={() => handleOpenModalDataForm()}
                >
                    <Plus className="h-4 w-4 text-white" />
                    Novo client
                </Button>
            </div>

            <Dialog open={openModalDataForm} onOpenChange={handleCloseModalDataForm}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{clientDataForm?.nome ? 'Alterar' : 'Adicionar'} Client</DialogTitle>
                    </DialogHeader>
                    <form id="form-provisionar-identidade" onSubmit={handleSubmitClientForm} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 flex justify-end flex-row gap-1.5">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="cliente-publico"
                                        checked={clientDataForm?.client_publico}
                                        onCheckedChange={(checked) => {
                                            handleChangeClientDataForm(
                                                checked,
                                                "client_publico"
                                            )
                                        }}
                                    />
                                    <Label htmlFor="cliente-publico">Cliente Público</Label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nome">Nome*</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    placeholder="Nome Cliente"
                                    value={clientDataForm?.nome || ""}
                                    onChange={(e) => handleChangeClientDataForm(e.target.value, "nome")}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="clientId">Client ID*</Label>
                                <Input
                                    id="clientId"
                                    name="clientId"
                                    placeholder="client-id"
                                    value={clientDataForm?.client_id || ""}
                                    onChange={(e) => handleChangeClientDataForm(e.target.value, "client_id")}
                                    required
                                />
                            </div>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label>Redirects URLs</Label>

                                {
                                    clientDataForm?.redirect_uris?.map((redirectUri, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                id={`redirect-uri-${index}`}
                                                name={`redirect-uri-${index}`}
                                                placeholder="https://example.com/callback"
                                                value={redirectUri}
                                                onChange={(e) => {
                                                    const newRedirectUris = [...(clientDataForm.redirect_uris || [])];
                                                    newRedirectUris[index] = e.target.value;
                                                    handleChangeClientDataForm(newRedirectUris, "redirect_uris");
                                                }}
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const newRedirectUris = [...(clientDataForm.redirect_uris || [])];
                                                    newRedirectUris.splice(index, 1);
                                                    handleChangeClientDataForm(newRedirectUris, "redirect_uris");
                                                }}
                                                type="button"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                }
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newRedirectUris = [...(clientDataForm.redirect_uris || []), ""];
                                        handleChangeClientDataForm(newRedirectUris, "redirect_uris");
                                    }}
                                >
                                    Adicionar Redirect URL
                                </Button>
                            </div>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Separator />
                            </div>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label>Web Origins</Label>

                                {
                                    clientDataForm?.web_origins?.map((webOrigin, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                id={`web-origin-${index}`}
                                                name={`web-origin-${index}`}
                                                placeholder="https://example.com"
                                                value={webOrigin}
                                                onChange={(e) => {
                                                    const newWebOrigins = [...(clientDataForm.web_origins || [])];
                                                    newWebOrigins[index] = e.target.value;
                                                    handleChangeClientDataForm(newWebOrigins, "web_origins");
                                                }}
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const newWebOrigins = [...(clientDataForm.web_origins || [])];
                                                    newWebOrigins.splice(index, 1);
                                                    handleChangeClientDataForm(newWebOrigins, "web_origins");
                                                }}
                                                type="button"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                }
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newWebOrigins = [...(clientDataForm.web_origins || []), ""];
                                        handleChangeClientDataForm(newWebOrigins, "web_origins");
                                    }}
                                >
                                    Adicionar Web Origin
                                </Button>
                            </div>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Separator />
                            </div>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label>Atributos</Label>

                                {
                                    clientDataFormAttributes?.map((attribute, index) => (
                                        <div key={`attribute-${index}`} className="flex gap-2">
                                            <Input
                                                id={`attribute-key-${index}`}
                                                name={`attribute-key-${index}`}
                                                placeholder="Chave"
                                                value={attribute[0]}
                                                onChange={(e) => {
                                                    const newAttributes = clientDataFormAttributes.map(
                                                        (item, i) =>
                                                            i === index
                                                                ? [e.target.value, item[1]]
                                                                : item
                                                    );
                                                    handleChangeClientDataFormAttributes(newAttributes);
                                                }}
                                                className="w-1/2"
                                            />
                                            <Input
                                                id={`attribute-value-${index}`}
                                                name={`attribute-value-${index}`}
                                                placeholder="Valor"
                                                value={attribute[1]}
                                                onChange={(e) => {
                                                    const newAttributes = clientDataFormAttributes.map(
                                                        (item, i) =>
                                                            i === index
                                                                ? [item[0], e.target.value]
                                                                : item
                                                    );
                                                    handleChangeClientDataFormAttributes(newAttributes);
                                                }}
                                                className="w-1/2"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const newAttributes = clientDataFormAttributes.filter(
                                                        (_, i) => i !== index
                                                    );

                                                    handleChangeClientDataFormAttributes(newAttributes);
                                                }}
                                                type="button"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                }
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newAttributes = [...(clientDataFormAttributes || []), ["", ""]];
                                        handleChangeClientDataFormAttributes(newAttributes);
                                    }}
                                >
                                    Adicionar Atributo
                                </Button>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModalDataForm}>
                            Cancelar
                        </Button>
                        <Button type="submit" form="form-provisionar-identidade">
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
