import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { createStore } from '@@data/index';
import { ThemedApp } from 'src/theme/themed-app';


const { store: testStore } = createStore(false);

const AllTheProviders: FC<PropsWithChildren> = ({ children }) => (
    <StoreProvider store={testStore}>
        <ThemedApp>
            {children}
        </ThemedApp>
    </StoreProvider>
);

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/* eslint-disable import/export */
// re-export everything
export * from '@testing-library/react';
export { customRender as render };
