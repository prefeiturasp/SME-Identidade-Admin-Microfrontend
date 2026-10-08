'use client';

import { useContext } from 'react';
import { IdentidadeContext } from '../context/IdentidadeContext';

/**
 * Hook para acessar o contexto de Identidade
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Identidade
 */
export const useIdentidadeContext = () => {
    const context = useContext(IdentidadeContext);

    if (!context) {
        throw new Error('useIdentidadeContext deve ser usado dentro de um IdentidadeProvider');
    }

    return context;
};
