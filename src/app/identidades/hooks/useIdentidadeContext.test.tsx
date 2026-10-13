import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { IdentidadeContext } from '../context/IdentidadeContext';
import { useIdentidadeContext } from './useIdentidadeContext';

type IdentidadeContextValue = React.ContextType<typeof IdentidadeContext>;

const contextValue: IdentidadeContextValue = {
    dataUserList: undefined,
    isLoadingDataUserList: false,
    userDataForm: {
        nome: '',
        sobrenome: '',
        cpf: '',
        email: '',
        tipo_usuario: '',
        usuario: '',
        rf: null,
    },
    setUserDataForm: vi.fn(),
    page: 3,
    setPage: vi.fn(),
    mutationPost: {} as IdentidadeContextValue['mutationPost'],
    openModalDataForm: false,
    openConfirmDelete: false,
    setOpenModalDataForm: vi.fn(),
    handleSubmitUserForm: vi.fn(),
    handleOpenConfirmDelete: vi.fn(),
    handleCloseConfirmDelete: vi.fn(),
    handleDeleteUser: vi.fn(),
    handleOpenModalDataForm: vi.fn(),
    handleCloseModalDataForm: vi.fn(),
};

function ContextConsumer() {
    const context = useIdentidadeContext();

    return <output data-testid="page">{context.page}</output>;
}

describe('useIdentidadeContext', () => {
    it('retorna o valor fornecido pelo IdentidadeContext', () => {
        render(
            <IdentidadeContext.Provider value={contextValue}>
                <ContextConsumer />
            </IdentidadeContext.Provider>
        );

        expect(screen.getByTestId('page')).toHaveTextContent('3');
    });
});
