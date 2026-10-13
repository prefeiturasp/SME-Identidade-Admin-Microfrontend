import { render } from '@testing-library/react';
import { createContext } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../context/IdentidadeContext', () => ({
    IdentidadeContext: createContext(null),
}));

import { useIdentidadeContext } from './useIdentidadeContext';

function ContextConsumer() {
    useIdentidadeContext();
    return null;
}

describe('useIdentidadeContext sem provider', () => {
    it('lança erro quando o contexto não está disponível', () => {
        expect(() => render(<ContextConsumer />)).toThrow(
            'useIdentidadeContext deve ser usado dentro de um IdentidadeProvider'
        );
    });
});
