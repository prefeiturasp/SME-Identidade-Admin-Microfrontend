"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { blueprintsMock } from "@/mocks/blueprints";

export function BlueprintsProvisionamento({ realm }: { realm: string }) {
    const [selecionado, setSelecionado] = useState(blueprintsMock[0].id);
    const ferramenta = blueprintsMock.find((item) => item.id === selecionado)!;

    return (
        <div className="grid gap-4 lg:grid-cols-[1fr_370px]">
            <Card className="w-full min-h-[358px] gap-6 rounded-lg border-none bg-white p-4 pt-6 shadow-[3px_4px_6px_0px_#0000001A]">
                <CardHeader className="gap-1.5 p-0">
                    <CardTitle>Ferramenta a provisionar</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {blueprintsMock.map((item) => {
                            const ativo = item.id === selecionado;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelecionado(item.id)}
                                    className={cn(
                                        "flex flex-col items-start gap-6 rounded border px-4 py-3 text-left transition-colors hover:shadow-[0px_4px_14px_-4px_#05409A40]",
                                        ativo
                                            ? "border-action bg-blue-50 shadow-[0px_4px_14px_-4px_#05409A40]"
                                            : "border-grey-250 bg-white hover:border-blue-300"
                                    )}
                                >
                                    <div className="flex w-full items-start justify-between">
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded border",
                                                ativo
                                                    ? "border-action bg-action text-white"
                                                    : "border-grey-300 bg-white text-grey-600"
                                            )}
                                        >
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <span
                                            className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                                                ativo ? "border-action" : "border-grey-500"
                                            )}
                                        >
                                            {ativo && <span className="h-2.5 w-2.5 rounded-full bg-action" />}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="pb-1 pt-[5px] text-base font-bold leading-none text-text-title">
                                            {item.nome}
                                        </p>
                                        <p className="mt-[10px] text-sm font-normal leading-none text-grey-600">
                                            {item.descricao}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-[370px] min-h-[358px] gap-6 rounded-lg border-none bg-white p-4 pt-6 shadow-[3px_4px_6px_0px_#0000001A]">
                <CardHeader className="gap-1.5 p-0">
                    <CardTitle>Configuração final</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 p-0">
                    <div className="text-sm leading-none text-grey-700">
                        <span className="font-normal">REALM: </span>
                        <span className="font-normal">{realm}</span>
                    </div>
                    <div className="text-sm leading-none text-grey-700">
                        <span className="font-normal">Ferramenta selecionada: </span>
                        <span className="font-bold">{ferramenta.nome}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Input
                            id="client-id"
                            aria-label="Client ID (Sistema)"
                            placeholder="Client ID (Sistema)"
                            className="h-[52px] min-h-[52px] border-grey-300 bg-white pt-2 text-base font-normal leading-6 placeholder:text-grey-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 rounded-md border border-blue-400 bg-blue-50 p-4 text-sm font-normal leading-5 text-grey-700">
                        <Info className="h-6 w-6 shrink-0 text-action-permissions" />
                        <p>Blueprints aplicam automaticamente Redirect URIs e Mappers de identidade.</p>
                    </div>

                    <Button className="h-12 w-full max-w-[338px] gap-2 bg-blue-700 pt-2 text-base font-semibold leading-6 text-white hover:bg-blue-700/90">
                        Iniciar provisionamento
                        <ArrowRightIcon className="h-4 w-4 text-white" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
