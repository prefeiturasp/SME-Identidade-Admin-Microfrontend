'use client';

import { useContext } from 'react';
import { SistemasContext } from '../context/SistemasContext';

/**
 * Hook para acessar o contexto de Sistemas
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Sistemas
 */
export const useSistemasContext = () => {
    const context = useContext(SistemasContext);

    if (!context) {
        throw new Error('useSistemasContext deve ser usado dentro de um SistemasProvider');
    }

    return context;
};
