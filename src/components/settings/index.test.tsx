import userEvent from '@testing-library/user-event';

import { render, fireEvent, waitFor } from 'config/test-utils';

import { SettingsButton } from './button';
import { SettingsModal } from './modal';


function App() {
    return (
        <>
            <SettingsButton />
            <SettingsModal />
        </>
    );
}

describe('settings', () => {
    it('should match snapshot', () => {
        const { queryAllByRole } = render(<App />);

        expect(queryAllByRole('presentation')).toHaveLength(0);

        expect(document.body).toMatchSnapshot();
    });

    describe('dialog management', () => {
        it('should react to click', async () => {
            const { queryByRole, queryAllByRole } = render(<App />);

            fireEvent.click(queryByRole('button') as HTMLButtonElement);

            await waitFor(() => {
                expect(queryAllByRole('presentation').length > 0).toBeTrue();
            });

            expect(document.body).toMatchSnapshot();
        });

        it('should hide dialog', async () => {
            const { queryByRole, queryAllByRole } = render(<App />);

            fireEvent.click(queryByRole('button') as HTMLButtonElement);

            fireEvent.click(document.body.querySelector('.MuiBackdrop-root') as HTMLDivElement);

            await waitFor(() => {
                expect(queryAllByRole('presentation')).toHaveLength(0);
            });

            expect(document.body).toMatchSnapshot();
        });
    });

    describe('settings', () => {
        describe('theme mode', () => {
            it('should change theme mode to light', async () => {
                const user = userEvent.setup();

                const { queryByRole, queryAllByRole } = render(<App />);

                await user.click(queryByRole('button') as HTMLButtonElement);

                await waitFor(() => {
                    expect(queryAllByRole('presentation').length > 0).toBeTrue();
                });

                await user.click(document.body.querySelector('#theme-mode-select') as HTMLDivElement);

                expect(document.body).toMatchSnapshot();
            });
        });
    });
});
