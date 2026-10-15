"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DESTINO_PADRAO = "/dashboard";

type LoginFormProps = {
    basePath: string,
    destino?: string,
    sessaoExpirada?: boolean,
    urlEsqueciSenha?: string
};

// Só caminhos internos são aceitos, para o login não servir de redirecionamento aberto.
function destinoSeguro(destino?: string): string {
    if (destino?.startsWith("/") && !destino.startsWith("//")) return destino;
    return DESTINO_PADRAO;
}

export function LoginForm({ basePath, destino, sessaoExpirada = false, urlEsqueciSenha }: Readonly<LoginFormProps>) {
    const router = useRouter();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const podeEnviar = Boolean(login.trim() && senha) && !enviando;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!podeEnviar) return;

        setEnviando(true);
        setErro(null);
        try {
            const resposta = await fetch(`${basePath}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: login.trim(), senha }),
            });

            if (resposta.ok) {
                router.replace(destinoSeguro(destino));
                router.refresh();
                return;
            }

            const corpo = await resposta.json().catch(() => ({}));
            setErro(corpo.message ?? "Não foi possível entrar. Tente novamente.");
        } catch {
            setErro("Serviço de autenticação indisponível.");
        }
        setSenha("");
        setEnviando(false);
    };

    return (
        <div className="w-full max-w-[316px]">
            <div className="mb-12 flex justify-center">
                <Image
                    src={`${basePath}/images/logoprefeitura.png`}
                    alt="Prefeitura de São Paulo"
                    width={240}
                    height={108}
                    className="mix-blend-multiply"
                    priority
                />
            </div>

            <h1 className="text-xl font-bold text-text-title">Entrar</h1>
            <p className="mt-2 text-sm text-grey-600">
                Um único acesso para os sistemas da Secretaria Municipal de Educação.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                {sessaoExpirada && !erro && (
                    <output className="block rounded-md bg-muted px-3 py-2 text-sm">
                        Sua sessão expirou. Entre novamente.
                    </output>
                )}
                {erro && (
                    <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {erro}
                    </p>
                )}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="login">Usuário</Label>
                    <Input
                        id="login"
                        name="login"
                        placeholder="Usuário"
                        autoComplete="username"
                        className="h-10 bg-white"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                        <Input
                            id="senha"
                            name="senha"
                            placeholder="Senha"
                            type={mostrarSenha ? "text" : "password"}
                            autoComplete="current-password"
                            className="h-10 bg-white pr-10"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha((atual) => !atual)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-grey-600"
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={!podeEnviar}
                    className="mt-2 h-10 bg-[#3E4F6B] font-semibold text-white hover:bg-[#3E4F6B]/90"
                >
                    {enviando ? "Entrando..." : "Entrar"}
                </Button>
                {urlEsqueciSenha && (
                    <a href={urlEsqueciSenha} className="text-center text-xs text-grey-600 underline">
                        Esqueci minha senha
                    </a>
                )}
            </form>
        </div>
    );
}
