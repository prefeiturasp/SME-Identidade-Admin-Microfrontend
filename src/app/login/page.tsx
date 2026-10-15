import { LoginForm } from "@/components/login/LoginForm";
import { caminhoBase } from "@/lib/auth/caminho";

type LoginPageProps = {
    searchParams: { next?: string, expirada?: string }
};

export default function LoginPage({ searchParams }: Readonly<LoginPageProps>) {
    const basePath = caminhoBase();

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Sem o arquivo da foto, o painel fica só com a cor de fundo. */}
            <div
                aria-hidden="true"
                data-testid="login-imagem"
                className="hidden bg-blue-900 bg-cover bg-center lg:block"
                style={{ backgroundImage: `url(${basePath}/images/login-sala-de-aula.png)` }}
            />
            <div className="flex items-center justify-center bg-[#F4F5F7] px-6 py-12">
                <LoginForm
                    basePath={basePath}
                    destino={searchParams.next}
                    sessaoExpirada={searchParams.expirada === "1"}
                    urlEsqueciSenha={process.env.URL_ESQUECI_SENHA || undefined}
                />
            </div>
        </main>
    );
}
