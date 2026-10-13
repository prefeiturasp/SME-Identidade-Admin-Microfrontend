'use client'

import React, { createContext, useMemo, useState } from 'react';

import { useClientsList } from '@/hooks/queries/client-admin/useClientsList';
import { TClientAdmin, TClientCreateRequest, TClientListResponse } from '@/lib/client/types';
import { useClientDelete } from '@/hooks/queries/client-admin/useClientDelete';
import { useClientCreate } from '@/hooks/queries/client-admin/useClientCreate';
import { useClientPatch } from '@/hooks/queries/client-admin/useClientPatch';
import { useClientRotacionar } from '@/hooks/queries/client-admin/useClientRotacionar';

interface IIdentidadeContext {
    dataClientsList: TClientListResponse | undefined;
    dataClientsListPaginated: TClientListResponse | undefined;
    isLoadingDataClientsList: boolean;
    clientDataForm: TClientAdmin;
    setClientDataForm: (e: TClientAdmin) => void;
    clientDataFormAttributes: string[][];
    setClientDataFormAttributes: (e: string[][]) => void;
    pageSize: number;
    page: number;
    setPage: (e: number) => void;
    mutationPost: ReturnType<typeof useClientCreate>['mutationPost'];
    isLoadingClientRotate: boolean;
    openModalDataForm: boolean;
    openConfirmDelete: boolean;
    openRotateDialog: boolean;
    detailRotatedSecret: { clientId: string; secret: string } | null;
    setDetailRotatedSecret: (detail: { clientId: string; secret: string } | null) => void;
    setOpenRotateDialog: (open: boolean) => void;
    setOpenModalDataForm: (e: boolean) => void;
    handleSubmitClientForm: (e: React.FormEvent<HTMLFormElement>) => void;
    handleOpenConfirmDelete: (clientData: TClientAdmin) => void;
    handleCloseConfirmDelete: () => void;
    handleDeleteClient: () => void;
    handleOpenModalDataForm: (clientData?: TClientAdmin) => void;
    handleCloseModalDataForm: () => void;
    handleRefreshDataClientsList: () => void;
    handleRotateClientSecret: (id: string, clientId: string) => void;
}

export const SistemasContext = createContext<IIdentidadeContext>({
    dataClientsList: {} as TClientListResponse,
    dataClientsListPaginated: {} as TClientListResponse,
    isLoadingDataClientsList: false,
    clientDataForm: {} as TClientAdmin,
    setClientDataForm: () => { },
    clientDataFormAttributes: [],
    setClientDataFormAttributes: () => { },
    pageSize: 10,
    page: 1,
    setPage: () => { },
    mutationPost: {} as ReturnType<typeof useClientCreate>['mutationPost'],
    isLoadingClientRotate: false,
    openModalDataForm: false,
    openConfirmDelete: false,
    openRotateDialog: false,
    detailRotatedSecret: null,
    setDetailRotatedSecret: () => { },
    setOpenRotateDialog: () => { },
    setOpenModalDataForm: () => { },
    handleSubmitClientForm: () => { },
    handleDeleteClient: () => { },
    handleOpenModalDataForm: () => { },
    handleCloseModalDataForm: () => { },
    handleOpenConfirmDelete: () => { },
    handleCloseConfirmDelete: () => { },
    handleRefreshDataClientsList: () => { },
    handleRotateClientSecret: () => { },
});

export const SistemasProvider = ({ children }: { children: React.ReactNode }) => {
    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);
    const [clientDataForm, setClientDataForm] = useState<TClientAdmin>({} as TClientAdmin);
    const [clientDataFormAttributes, setClientDataFormAttributes] = useState<string[][]>([]);
    const [openModalDataForm, setOpenModalDataForm] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [openRotateDialog, setOpenRotateDialog] = useState(false);
    const [detailRotatedSecret, setDetailRotatedSecret] = useState<{ clientId: string; secret: string } | null>(null);

    const handleOpenModalDataForm = (clientData?: TClientAdmin) => {
        if (clientData) {
            setClientDataForm(clientData);
            const attributes = clientData.atributos || {};
            const attributesObject: string[][] = [];
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    attributesObject.push([key, attributes[key]]);
                }
            }
            setClientDataFormAttributes(attributesObject);
        } else {
            setClientDataForm({} as TClientAdmin);
        }
        setOpenModalDataForm(true);
    }

    const handleCloseModalDataForm = () => {
        setOpenModalDataForm(false);
        setClientDataForm({} as TClientAdmin);
        setClientDataFormAttributes([]);
    }

    const handleOpenConfirmDelete = (clientData: TClientAdmin) => {
        setClientDataForm(clientData);
        setOpenConfirmDelete(true);
    }

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setClientDataForm({} as TClientAdmin);
    }

    const { data: dataClientsList, isFetching: isLoadingDataClientsList, refetch: refetchDataClientsList } = useClientsList();
    const { mutationPost } = useClientCreate({ handleCloseModalDataForm });
    const { mutationPatch } = useClientPatch({ handleCloseModalDataForm });
    const { mutationDelete } = useClientDelete({ handleCloseConfirmDelete });
    const { mutationRotate, isLoadingClientRotate } = useClientRotacionar({ setOpenRotateDialog, setDetailRotatedSecret });

    const normalizeDataClientForm = (clientData: TClientAdmin, clientDataFormAttributes: string[][]): TClientCreateRequest => {
        const atributos: Record<string, string> = clientDataFormAttributes.reduce((acc, [key, value]) => {
            if (key.trim() !== '') {
                acc[key.trim()] = value.trim();
            }
            return acc;
        }, {} as Record<string, string>);

        const redirect_uris = clientData?.redirect_uris?.map(uri => uri.trim()).filter(uri => uri !== '*');
        const web_origins = clientData?.web_origins?.map(origin => origin.trim()).filter(origin => origin !== '*');

        return {
            nome: clientData.nome.trim(),
            client_id: clientData.client_id.trim(),
            client_publico: clientData.client_publico,
            redirect_uris,
            web_origins,
            atributos,
        }
    }

    const handleSubmitClientForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const normalizedData = normalizeDataClientForm(clientDataForm, clientDataFormAttributes);

        if (clientDataForm.id) {
            mutationPatch.mutate({
                id: clientDataForm.id, ...normalizedData
            });
        } else {
            mutationPost.mutate({ ...normalizedData });
        }
    }

    const handleDeleteClient = () => {
        if (!clientDataForm.id) {
            alert('Necessário informar o ID do usuário para excluir a identidade.');
            return;
        }

        mutationDelete.mutate({ id: clientDataForm.id });
    }

    const handleRefreshDataClientsList = () => {
        refetchDataClientsList();
    }

    const handleRotateClientSecret = (id: string, clientId: string) => {
        if (!id) {
            alert('Necessário informar o id do client para rotacionar o secret.');
            return;
        }

        mutationRotate.mutate({ id, clientId });
    }

    const dataClientsListPaginated = useMemo(() => {
        if (!dataClientsList) return [];

        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        return dataClientsList.slice(startIndex, endIndex);
    }, [dataClientsList, page]);

    const contextValue = useMemo(() => {
        return {
            dataClientsList,
            dataClientsListPaginated,
            isLoadingDataClientsList,
            clientDataForm,
            setClientDataForm,
            pageSize: PAGE_SIZE,
            page,
            setPage,
            mutationPost,
            openModalDataForm,
            openConfirmDelete,
            setOpenModalDataForm,
            handleSubmitClientForm,
            handleDeleteClient,
            handleOpenModalDataForm,
            handleCloseModalDataForm,
            handleOpenConfirmDelete,
            handleCloseConfirmDelete,
            handleRefreshDataClientsList,
            clientDataFormAttributes,
            setClientDataFormAttributes,
            isLoadingClientRotate,
            handleRotateClientSecret,
            openRotateDialog,
            detailRotatedSecret,
            setDetailRotatedSecret,
            setOpenRotateDialog
        };
    }, [
        dataClientsList,
        dataClientsListPaginated,
        isLoadingDataClientsList,
        clientDataForm,
        PAGE_SIZE,
        page,
        openConfirmDelete,
        handleDeleteClient,
        handleSubmitClientForm,
        mutationPost,
        openModalDataForm,
        clientDataFormAttributes,
        isLoadingClientRotate,
    ]);

    return (
        <SistemasContext.Provider value={contextValue}>
            {children}
        </SistemasContext.Provider>
    )

}
