import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SistemasContext, SistemasProvider } from './SistemasContext';
import type { TClientAdmin } from '@/lib/client/types';

const mutations = vi.hoisted(() => ({ post: vi.fn(), patch: vi.fn(), remove: vi.fn(), rotate: vi.fn(), refetch: vi.fn() }));
const clients = Array.from({ length: 12 }, (_, index) => ({
  id: `id-${index}`, client_id: `client-${index}`, nome: `Client ${index}`, habilitado: true,
  client_publico: false, protocolo: 'openid-connect', redirect_uris: [], web_origins: [], atributos: {},
}));

vi.mock('@/hooks/queries/client-admin/useClientsList', () => ({ useClientsList: () => ({ data: clients, isFetching: false, refetch: mutations.refetch }) }));
vi.mock('@/hooks/queries/client-admin/useClientCreate', () => ({ useClientCreate: () => ({ mutationPost: { mutate: mutations.post } }) }));
vi.mock('@/hooks/queries/client-admin/useClientPatch', () => ({ useClientPatch: () => ({ mutationPatch: { mutate: mutations.patch } }) }));
vi.mock('@/hooks/queries/client-admin/useClientDelete', () => ({ useClientDelete: () => ({ mutationDelete: { mutate: mutations.remove } }) }));
vi.mock('@/hooks/queries/client-admin/useClientRotacionar', () => ({ useClientRotacionar: () => ({ mutationRotate: { mutate: mutations.rotate }, isLoadingClientRotate: false }) }));

function Harness() {
  return <SistemasContext.Consumer>{(ctx) => <>
    <output data-testid="state">{String(ctx.openModalDataForm)}|{String(ctx.openConfirmDelete)}|{ctx.dataClientsListPaginated?.length}</output>
    <output data-testid="form">{JSON.stringify(ctx.clientDataForm)}</output>
    <output data-testid="attributes">{JSON.stringify(ctx.clientDataFormAttributes)}</output>
    <button onClick={() => ctx.handleOpenModalDataForm()}>novo</button>
    <button onClick={() => ctx.handleOpenModalDataForm({ ...clients[0], atributos: { role: 'admin' } })}>editar</button>
    <button onClick={ctx.handleCloseModalDataForm}>fechar</button>
    <button onClick={() => ctx.setClientDataForm({ nome: ' Nome ', client_id: ' app ', client_publico: true } as TClientAdmin)}>dados para criar</button>
    <button onClick={() => ctx.setClientDataFormAttributes([[' role ', ' admin '], [' ', 'ignorado']])}>atributos</button>
    <button onClick={() => ctx.handleOpenConfirmDelete(clients[0])}>excluir</button>
    <button onClick={ctx.handleCloseConfirmDelete}>cancelar exclusão</button>
    <button onClick={ctx.handleDeleteClient}>confirmar exclusão</button>
    <button onClick={() => ctx.handleRotateClientSecret('id-1', 'client-1')}>rotacionar</button>
    <button onClick={() => ctx.handleRotateClientSecret('', 'client-1')}>rotacionar sem ID</button>
    <button onClick={ctx.handleRefreshDataClientsList}>atualizar</button>
    <button onClick={() => ctx.setPage(2)}>página 2</button>
    <form onSubmit={ctx.handleSubmitClientForm}><button type="submit">enviar</button></form>
  </>}</SistemasContext.Consumer>;
}

describe('SistemasProvider', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.spyOn(window, 'alert').mockImplementation(() => {}); });
  const renderProvider = () => render(<SistemasProvider><Harness /></SistemasProvider>);

  it('abre e limpa o formulário de criação e carrega atributos na edição', () => {
    renderProvider();
    fireEvent.click(screen.getByText('novo'));
    expect(screen.getByTestId('state')).toHaveTextContent('true|false|10');
    fireEvent.click(screen.getByText('fechar'));
    expect(screen.getByTestId('form')).toHaveTextContent('{}');
    fireEvent.click(screen.getByText('editar'));
    expect(screen.getByTestId('attributes')).toHaveTextContent('[[' + '"role","admin"' + ']]');
  });

  it('normaliza e cria os dados do client, removendo valores vazios e curingas', () => {
    renderProvider();
    fireEvent.click(screen.getByText('dados para criar'));
    fireEvent.click(screen.getByText('atributos'));
    fireEvent.click(screen.getByText('enviar'));
    expect(mutations.post).toHaveBeenCalledWith({
      nome: 'Nome', client_id: 'app', client_publico: true, redirect_uris: undefined,
      web_origins: undefined, atributos: { role: 'admin' },
    });
  });

  it('edita clients e envia os atributos convertidos para objeto', () => {
    renderProvider();
    fireEvent.click(screen.getByText('editar'));
    fireEvent.click(screen.getByText('enviar'));
    expect(mutations.patch).toHaveBeenCalledWith(expect.objectContaining({ id: 'id-0', atributos: { role: 'admin' } }));
  });

  it('confirma exclusão, alerta sem ID e executa rotação e atualização', () => {
    renderProvider();
    fireEvent.click(screen.getByText('excluir'));
    expect(screen.getByTestId('state')).toHaveTextContent('false|true|10');
    fireEvent.click(screen.getByText('confirmar exclusão'));
    expect(mutations.remove).toHaveBeenCalledWith({ id: 'id-0' });
    fireEvent.click(screen.getByText('cancelar exclusão'));
    fireEvent.click(screen.getByText('confirmar exclusão'));
    expect(window.alert).toHaveBeenCalledWith('Necessário informar o ID do usuário para excluir a identidade.');
    fireEvent.click(screen.getByText('rotacionar'));
    expect(mutations.rotate).toHaveBeenCalledWith({ id: 'id-1', clientId: 'client-1' });
    fireEvent.click(screen.getByText('rotacionar sem ID'));
    expect(window.alert).toHaveBeenCalledWith('Necessário informar o id do client para rotacionar o secret.');
    fireEvent.click(screen.getByText('atualizar'));
    expect(mutations.refetch).toHaveBeenCalledOnce();
  });

  it('pagina a lista em grupos de dez clients', () => {
    renderProvider();
    fireEvent.click(screen.getByText('página 2'));
    expect(screen.getByTestId('state')).toHaveTextContent('false|false|2');
  });
});
