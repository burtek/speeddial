import userEvent from '@testing-library/user-event';

import { render, waitFor } from '@@config/test-utils';

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
        const { queryByRole } = render(<App />);

        expect(queryByRole('presentation')).toBeNull();

        expect(document.body).toMatchSnapshot();
    });

    describe('dialog management', () => {
        it('should show and hide dialog', async () => {
            const user = userEvent.setup();

            const { queryByLabelText, queryAllByRole } = render(<App />);

            await user.click(queryByLabelText('tooltips.settings') as HTMLButtonElement);

            await waitFor(() => {
                expect(queryAllByRole('presentation')).not.toBeEmpty();
            });

            expect(document.body).toMatchSnapshot('opened');

            await user.click(document.body.querySelector('.MuiBackdrop-root') as HTMLDivElement);

            await waitFor(() => {
                expect(queryAllByRole('presentation')).toBeEmpty();
                expect(document.body.querySelector('.MuiTouchRipple-childLeaving')).not.toBeInTheDocument();
            });

            expect(document.body).toMatchSnapshot('closed');
        });
    });

    describe('settings', () => {
        describe('theme mode', () => {
            it.each(['dark', 'light', 'auto'])('should change theme mode to %s', async mode => {
                const user = userEvent.setup();

                const { queryByLabelText, queryAllByRole, queryByText } = render(<App />);

                await user.click(queryByLabelText('tooltips.settings') as HTMLButtonElement);

                await waitFor(() => {
                    expect(queryAllByRole('presentation').length > 0).toBeTrue();
                });

                await user.click(document.body.querySelector('#theme-mode-select') as HTMLDivElement);

                await user.click(queryByText(`configDialog.themeMode.option.${mode}`) as HTMLLIElement);

                expect(document.body.querySelector('#theme-mode-select')).toHaveTextContent(`configDialog.themeMode.option.${mode}`);

                expect(document.body).toMatchSnapshot();
            });
        });
    });
});
