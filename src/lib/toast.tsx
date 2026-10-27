import { toast as reactToast, type ToastOptions } from "react-toastify";

const ToastContent = (titulo: string, mensagem?: string) => {
    return (
        <div className="flex flex-col gap-1">
            <strong>{titulo}</strong>
            {mensagem && <div>{mensagem}</div>}
        </div>
    )
}

/** Exibe notificações com título e mensagem. A chamada direta usa success. */
export const toast = Object.assign(
    (titulo: string, mensagem: string, options?: ToastOptions) =>
        reactToast.success(ToastContent(titulo, mensagem), options),
    {
        success: (titulo: string, mensagem?: string, options?: ToastOptions) =>
            reactToast.success(ToastContent(titulo, mensagem), options),
        error: (titulo: string, mensagem?: string, options?: ToastOptions) =>
            reactToast.error(ToastContent(titulo, mensagem), options),
        info: (titulo: string, mensagem?: string, options?: ToastOptions) =>
            reactToast.info(ToastContent(titulo, mensagem), options),
        warning: (titulo: string, mensagem?: string, options?: ToastOptions) =>
            reactToast.warning(ToastContent(titulo, mensagem), options),
    }
);
