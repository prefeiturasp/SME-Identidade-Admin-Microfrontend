import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IdentidadeContext, IdentidadeProvider } from './IdentidadeContext';

const mutations = vi.hoisted(() => ({
  post: vi.fn(), patch: vi.fn(), email: vi.fn(), delete: vi.fn(),
}));

vi.mock('@/hooks/queries/user/useUsersList', () => ({ useUsersList: vi.fn(() => ({ data: { count: 0, page: 1, results: [] }, isFetching: false })) }));
vi.mock('@/hooks/queries/user/useUserCreate', () => ({ useUserCreate: () => ({ mutationPost: { mutate: mutations.post } }) }));
vi.mock('@/hooks/queries/user/useUserPatch', () => ({ useUserPatch: () => ({ mutationPatch: { mutate: mutations.patch } }) }));
vi.mock('@/hooks/queries/user/useUserEmailPatch', () => ({ useUserEmailPatch: () => ({ mutationEmailPatch: { mutate: mutations.email } }) }));
vi.mock('@/hooks/queries/user/useUserDelete', () => ({ useUserDelete: () => ({ mutationDelete: { mutate: mutations.delete } }) }));

function Harness() {
  return <IdentidadeContext.Consumer>{(ctx) => <>
    <output data-testid="flags">{String(ctx.openModalDataForm)}|{String(ctx.openConfirmDelete)}</output>
    <button onClick={() => ctx.handleOpenModalDataForm()}>novo</button>
    <button onClick={() => ctx.handleOpenModalDataForm({ id: 'u1', nome: 'Ana', sobrenome: 'Lima', cpf: '12345678901', email: 'ana@example.com', tipo_usuario: 'servidor', usuario: '12345678901', rf: '5678901' })}>editar</button>
    <button onClick={ctx.handleCloseModalDataForm}>fechar</button>
    <button onClick={() => ctx.handleOpenConfirmDelete({ id: 'u2', nome: 'B', sobrenome: 'C', cpf: '12345678901', email: 'b@c.com', tipo_usuario: 'x', usuario: 'b', rf: null })}>excluir</button>
    <button onClick={ctx.handleCloseConfirmDelete}>cancelar exclusão</button>
    <button onClick={ctx.handleDeleteUser}>confirmar exclusão</button>
    <button onClick={() => ctx.setUserDataForm({ nome: ' Ana ', sobrenome: ' Lima ', cpf: '12345678901', email: 'ANA@EXAMPLE.COM', tipo_usuario: ' servidor ', usuario: 'qualquer', rf: null })}>form válido</button>
    <button onClick={() => ctx.setUserDataForm({ nome: '', sobrenome: 'Lima', cpf: '12345678901', email: 'a@b.com', tipo_usuario: 'x', usuario: 'a', rf: null })}>form inválido</button>
    <button onClick={() => ctx.setUserDataForm({ id: 'u1', nome: 'Ana', sobrenome: 'Lima', cpf: '12345678901', email: 'novo@example.com', tipo_usuario: 'servidor', usuario: 'old', rf: '5678901' })}>email alterado</button>
    <button onClick={() => ctx.setUserDataForm({ id: 'u1', nome: 'Outra', sobrenome: 'Lima', cpf: '12345678901', email: 'ana@example.com', tipo_usuario: 'servidor', usuario: 'old', rf: '5678901' })}>dados alterados</button>
    <form onSubmit={ctx.handleSubmitUserForm}><button type="submit">enviar</button></form>
  </>}</IdentidadeContext.Consumer>;
}

describe('IdentidadeProvider', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.spyOn(window, 'alert').mockImplementation(() => {}); });
  const renderProvider = () => render(<IdentidadeProvider><Harness /></IdentidadeProvider>);

  it('abre e fecha o formulário novo e o formulário de edição', () => {
    renderProvider();
    fireEvent.click(screen.getByText('novo'));
    expect(screen.getByTestId('flags')).toHaveTextContent('true|false');
    fireEvent.click(screen.getByText('fechar'));
    fireEvent.click(screen.getByText('editar'));
    expect(screen.getByTestId('flags')).toHaveTextContent('true|false');
  });

  it('valida e normaliza os dados antes de criar', () => {
    renderProvider();
    fireEvent.click(screen.getByText('form inválido'));
    fireEvent.click(screen.getByText('enviar'));
    expect(window.alert).toHaveBeenCalledWith('O campo nome é obrigatório.');
    fireEvent.click(screen.getByText('form válido'));
    fireEvent.click(screen.getByText('enviar'));
    expect(mutations.post).toHaveBeenCalledWith({ nome: 'Ana', sobrenome: 'Lima', cpf: '12345678901', email: 'ana@example.com', tipo_usuario: 'servidor', usuario: '12345678901', rf: '5678901' });
  });

  it('atualiza email e dados separadamente, ou ambos quando necessário', () => {
    renderProvider();
    fireEvent.click(screen.getByText('editar'));
    fireEvent.click(screen.getByText('email alterado'));
    fireEvent.click(screen.getByText('enviar'));
    expect(mutations.email).toHaveBeenCalledWith({ needInvalidateQuery: true, userId: 'u1', email: 'novo@example.com' });
    fireEvent.click(screen.getByText('editar'));
    fireEvent.click(screen.getByText('dados alterados'));
    fireEvent.click(screen.getByText('enviar'));
    expect(mutations.patch).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', nome: 'Outra' }));
  });

  it('abre confirmação, exclui usuário com ID e alerta quando falta ID', () => {
    renderProvider();
    fireEvent.click(screen.getByText('excluir'));
    expect(screen.getByTestId('flags')).toHaveTextContent('false|true');
    fireEvent.click(screen.getByText('confirmar exclusão'));
    expect(mutations.delete).toHaveBeenCalledWith({ userId: 'u2' });
    fireEvent.click(screen.getByText('cancelar exclusão'));
    fireEvent.click(screen.getByText('novo'));
    fireEvent.click(screen.getByText('confirmar exclusão'));
    expect(window.alert).toHaveBeenCalledWith('Necessário informar o ID do usuário para excluir a identidade.');
  });
});
