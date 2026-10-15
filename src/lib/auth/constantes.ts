// Fica separado do restante da sessão para poder ser usado no middleware,
// que roda no Edge e não tem acesso ao módulo de criptografia do Node.
export const NOME_COOKIE_SESSAO = "admin_sessao";
