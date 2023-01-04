import { StrictMode } from 'react';
import { createRoot as createReactDOMRoot } from 'react-dom/client';
import { AppLayout } from './app';
const root = createReactDOMRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <AppLayout />
    </StrictMode>
);
