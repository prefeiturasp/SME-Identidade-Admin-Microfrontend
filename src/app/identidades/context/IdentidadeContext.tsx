'use client'

import React, { createContext, useMemo, useState } from 'react';
import { useUsersList } from '@/hooks/queries/user/useUsersList';
import { UserListResponse } from '@/lib/user/types';
import { useUserCreate } from '@/hooks/queries/user/useUserCreate';
import { useUserPatch } from '@/hooks/queries/user/useUserPatch';
import { useUserEmailPatch } from '@/hooks/queries/user/useUserEmailPatch';
import { useUserDelete } from '@/hooks/queries/user/useUserDelete';

interface IUserDataForm {
    id?: string,
    nome: string,
    sobrenome: string,
    cpf: string,
    email: string,
    tipo_usuario: string,
    usuario: string,
    rf: string | null
}

interface IIdentidadeContext {
    dataUserList: UserListResponse | undefined;
    isLoadingDataUserList: boolean;
    userDataForm: IUserDataForm;
    setUserDataForm: (e: IUserDataForm) => void;
    page: number;
    setPage: (e: number) => void;
    mutationPost: ReturnType<typeof useUserCreate>['mutationPost'];
    openModalDataForm: boolean;
    openConfirmDelete: boolean;
    setOpenModalDataForm: (e: boolean) => void;
    handleSubmitUserForm: (e: React.FormEvent<HTMLFormElement>) => void;
    handleOpenConfirmDelete: (userData: IUserDataForm) => void;
    handleCloseConfirmDelete: () => void;
    handleDeleteUser: () => void;
    handleOpenModalDataForm: (userData?: IUserDataForm) => void;
    handleCloseModalDataForm: () => void;
}

export const IdentidadeContext = createContext<IIdentidadeContext>({
    dataUserList: {} as UserListResponse,
    isLoadingDataUserList: false,
    userDataForm: {} as IUserDataForm,
    setUserDataForm: () => { },
    page: 1,
    setPage: () => { },
    mutationPost: {} as ReturnType<typeof useUserCreate>['mutationPost'],
    openModalDataForm: false,
    openConfirmDelete: false,
    setOpenModalDataForm: () => { },
    handleSubmitUserForm: () => { },
    handleDeleteUser: () => { },
    handleOpenModalDataForm: () => { },
    handleCloseModalDataForm: () => { },
    handleOpenConfirmDelete: () => { },
    handleCloseConfirmDelete: () => { }
});

export const IdentidadeProvider = ({ children }: { children: React.ReactNode }) => {
    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);
    const [storageUserDataForm, setStorageUserDataForm] = useState<IUserDataForm>({} as IUserDataForm);
    const [userDataForm, setUserDataForm] = useState<IUserDataForm>({} as IUserDataForm);
    const [openModalDataForm, setOpenModalDataForm] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

    const handleOpenModalDataForm = (userData?: IUserDataForm) => {
        if (userData) {
            setUserDataForm(userData);
            setStorageUserDataForm(userData);
        } else {
            setUserDataForm({} as IUserDataForm);
        }
        setOpenModalDataForm(true);
    }

    const handleCloseModalDataForm = () => {
        setOpenModalDataForm(false);
        setUserDataForm({} as IUserDataForm);
        setStorageUserDataForm({} as IUserDataForm);
    }

    const handleOpenConfirmDelete = (userData: IUserDataForm) => {
        setUserDataForm(userData);
        setOpenConfirmDelete(true);
    }

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setUserDataForm({} as IUserDataForm);
    }

    const { data: dataUserList, isFetching: isLoadingDataUserList } = useUsersList({ page, pageSize: PAGE_SIZE });
    const { mutationPost } = useUserCreate();
    const { mutationPatch } = useUserPatch({ handleCloseModalDataForm });
    const { mutationEmailPatch } = useUserEmailPatch({ handleCloseModalDataForm });
    const { mutationDelete } = useUserDelete();

    const validateUserDataForm = (userData: IUserDataForm) => {
        for (const key in userData) {
            const field = userData[key as keyof IUserDataForm];

            if (key === "rf") continue;

            if (
                field === null ||
                field === undefined ||
                field?.trim() === ''
            ) {
                return `O campo ${key} é obrigatório.`;
            }
        }

        const cpfRegex = /^\d{11}$/;
        const emailRegex = /^[^\s@]{1,64}@[^\s@.]{1,255}\.[^\s@.]{2,63}$/;

        if (!cpfRegex.test(userData.cpf)) {
            return 'CPF inválido. Certifique-se de que o CPF contém exatamente 11 dígitos numéricos.'
        }

        if (!emailRegex.test(userData.email)) {
            return 'Email inválido. Certifique-se de que o email está no formato correto.'
        }

        return ""
    }

    const normalizeDataUserForm = (userData: IUserDataForm) => {
        const cpf = userData.cpf.trim().replaceAll(/\D/g, '')
        const rf = cpf.slice(-7);
        return {
            nome: userData.nome.trim(),
            sobrenome: userData.sobrenome.trim(),
            cpf,
            email: userData.email.trim().toLowerCase(),
            tipo_usuario: userData.tipo_usuario.trim(),
            usuario: cpf,
            rf,
        }
    }

    const handleSubmitUserForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateUserDataForm(userDataForm);

        if (validationError) {
            alert(validationError);
            return;
        }

        const normalizedData = normalizeDataUserForm(userDataForm);

        if (userDataForm.id) {
            const hasChanges = Object.keys(normalizedData).some(key => {
                const field = key as keyof typeof normalizedData;
                if (field === "email") return false;
                const isDifferent = normalizedData[field] !== storageUserDataForm[field];
                return isDifferent;
            });
            const emailChanged = normalizedData.email !== storageUserDataForm.email;

            if (hasChanges) {
                mutationPatch.mutate({
                    userId: userDataForm.id, ...normalizedData
                });
            }

            if (emailChanged) {
                mutationEmailPatch.mutate({
                    needInvalidateQuery: !hasChanges,
                    userId: userDataForm.id, email: normalizedData.email
                });
            }
        } else {
            mutationPost.mutate({ ...normalizedData });
        }
    }

    const handleDeleteUser = () => {
        if (!userDataForm.id) {
            alert('Necessário informar o ID do usuário para excluir a identidade.');
            return;
        }

        mutationDelete.mutate({ userId: userDataForm.id });
    }

    const contextValue = useMemo(() => {
        return {
            dataUserList,
            isLoadingDataUserList,
            userDataForm,
            setUserDataForm,
            page,
            setPage,
            mutationPost,
            openModalDataForm,
            openConfirmDelete,
            setOpenModalDataForm,
            handleSubmitUserForm,
            handleDeleteUser,
            handleOpenModalDataForm,
            handleCloseModalDataForm,
            handleOpenConfirmDelete,
            handleCloseConfirmDelete,
        };
    }, [
        dataUserList,
        isLoadingDataUserList,
        userDataForm,
        page,
        openConfirmDelete,
        handleDeleteUser,
        handleSubmitUserForm,
        mutationPost,
        openModalDataForm
    ]);

    return (
        <IdentidadeContext.Provider value={contextValue}>
            {children}
        </IdentidadeContext.Provider>
    )

}
