import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { store } from '@@data/index';
import { ThemedApp } from 'src/theme/themed-app';

const AllTheProviders: FC<PropsWithChildren> = ({ children }) => (
    <StoreProvider store={store}>
        <ThemedApp>
            {children}
        </ThemedApp>
    </StoreProvider>
);

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
