// eslint-disable-next-line no-warning-comments
// TODO: util functions for repetitive user actions?

import userEvent from '@testing-library/user-event';

import { render, renderHook, waitFor } from '@@config/test-utils';

import type { ContextMenuOption, ContextMenuOptionWithAction, ContextMenuOptionWithArgAction } from '../use-context-menu';
import { useContextMenu } from '../use-context-menu';


describe('speeddial/hooks/use-context-menu', () => {
    const noArgAction = vitest.fn<[key: string], undefined>();
    const argAction = vitest.fn<[value: string], undefined>();

    const optionWithoutConfirmationByDefault: ContextMenuOptionWithAction = {
        key: 'noarg-noconfirmdef',
        label: 'Option without arg, without confirmation (default)',
        action: () => {
            noArgAction('noarg-noconfirmdef');
        }
    };
    const optionWithoutConfirmation: ContextMenuOptionWithAction = {
        key: 'noarg-noconfirm',
        label: 'Option without arg, without confirmation',
        action: () => {
            noArgAction('noarg-noconfirm');
        },
        requireConfirm: false
    };
    const optionWithConfirmation: ContextMenuOptionWithAction = {
        key: 'noarg-confirm',
        label: 'Option without arg, with confirmation',
        action: () => {
            noArgAction('noarg-confirm');
        },
        requireConfirm: 'Are you sure?'
    };
    const optionWithSubOptions: ContextMenuOptionWithArgAction = {
        key: 'arg',
        label: 'Option with suboptions',
        action: argAction,
        options: [
            { value: 'arg1', label: 'SubOption 1' },
            { value: 'arg2', label: 'SubOption 2' },
            { value: 'arg3', label: 'SubOption 3' },
            { value: 'arg4', label: 'SubOption 4' }
        ]
    };

    const options: ContextMenuOption[] = [
        optionWithoutConfirmationByDefault,
        optionWithoutConfirmation,
        optionWithConfirmation,
        optionWithSubOptions
    ];
    const id = 'some-id';

    function Component() {
        const { menu, triggerProps } = useContextMenu(options, id);

        return (
            <>
                <div {...triggerProps}>Trigger</div>
                {menu}
            </>
        );
    }

    beforeEach(() => {
        vitest.clearAllMocks();
    });

    it('should provide trigger and menu props', () => {
        const { result } = renderHook((renderOptions: ContextMenuOption[]) => useContextMenu(renderOptions, id), { initialProps: options });

        expect(result.current.triggerProps).toMatchObject({ onContextMenu: expect.any(Function) });
        expect(result.current.menu).toBeDefined();
        expect(() => render(result.current.menu)).not.toThrow();
    });

    describe('rendering', () => {
        it('should open menu on context menu trigger', async () => {
            const user = userEvent.setup();

            const { queryByText, queryByRole } = render(<Component />);

            expect(document.body).toMatchSnapshot('initial');

            await user.pointer([
                { target: queryByText('Trigger') as HTMLDivElement, keys: '[MouseRight]' }
            ]);

            await waitFor(() => {
                expect(queryByRole('presentation')).toBeInTheDocument();
            });

            expect(document.body).toMatchSnapshot('opened');
        });

        describe('trigger action', () => {
            it.each([
                optionWithoutConfirmationByDefault,
                optionWithoutConfirmation
            ].map(option => ({
                option,
                label: option.label
            })))('should work without confirmation for $label', async ({ option: { key, label } }) => {
                const user = userEvent.setup();

                const { queryByText, queryByRole } = render(<Component />);

                await user.pointer([
                    { target: queryByText('Trigger') as HTMLDivElement, keys: '[MouseRight]' }
                ]);

                await waitFor(() => {
                    expect(queryByRole('presentation')).toBeInTheDocument();
                });

                await user.click(queryByText(label) as HTMLElement);

                await waitFor(() => {
                    expect(queryByRole('presentation')).not.toBeInTheDocument();
                });

                expect(noArgAction).toHaveBeenCalledWith(key);
            });

            it.each([
                {
                    withWhat: 'confirmation',
                    clickOn: optionWithConfirmation.label,
                    clickOn2: optionWithConfirmation.requireConfirm as string,
                    action: noArgAction,
                    calledWith: optionWithConfirmation.key
                },
                {
                    withWhat: 'suboption',
                    clickOn: optionWithSubOptions.label,
                    clickOn2: optionWithSubOptions.options[1].label,
                    action: argAction,
                    calledWith: optionWithSubOptions.options[1].value
                }
            ])('should trigger action with $withWhat', async ({ clickOn, clickOn2, action, calledWith }) => {
                const user = userEvent.setup();

                const { queryByText, queryByRole } = render(<Component />);

                await user.pointer([
                    { target: queryByText('Trigger') as HTMLDivElement, keys: '[MouseRight]' }
                ]);

                await waitFor(() => {
                    expect(queryByRole('presentation')).toBeInTheDocument();
                });

                await user.click(queryByText(clickOn) as HTMLElement);

                await waitFor(() => {
                    expect(queryByText(clickOn2)).toBeInTheDocument();
                });

                expect(queryByRole('presentation')).toBeInTheDocument();
                expect(action).not.toHaveBeenCalled();
                expect(document.body).toMatchSnapshot('suboptions');

                await user.click(queryByText(clickOn2) as HTMLElement);

                await waitFor(() => {
                    expect(queryByText(clickOn2)).not.toBeInTheDocument();
                    expect(queryByRole('presentation')).not.toBeInTheDocument();
                });

                expect(action).toHaveBeenCalledWith(calledWith);
            });
        });

        describe('cancel option', () => {
            it.each([
                {
                    where: 'confirmation menu',
                    clickOn: optionWithConfirmation.label,
                    waitForAppear: optionWithConfirmation.requireConfirm as string,
                    action: noArgAction
                },
                {
                    where: 'suboptions menu',
                    clickOn: optionWithSubOptions.label,
                    waitForAppear: optionWithSubOptions.options[1].label,
                    action: argAction
                }
            ])('should return to main menu from $where', async ({ clickOn, waitForAppear, action }) => {
                const user = userEvent.setup();

                const { getByText, queryByText, queryByRole } = render(<Component />);

                await user.pointer([
                    { target: getByText('Trigger'), keys: '[MouseRight]' }
                ]);

                await waitFor(() => {
                    expect(queryByRole('presentation')).toBeInTheDocument();
                });

                await user.click(getByText(clickOn));

                await waitFor(() => {
                    expect(getByText(waitForAppear)).toBeInTheDocument();
                });

                expect(queryByRole('presentation')).toBeInTheDocument();
                expect(action).not.toHaveBeenCalled();
                expect(document.body).toMatchSnapshot('suboptions');

                await user.click(getByText('actions.cancel'));

                await waitFor(() => {
                    expect(queryByText(waitForAppear)).not.toBeInTheDocument();
                });

                expect(queryByRole('presentation')).toBeInTheDocument();
                expect(action).not.toHaveBeenCalled();
            });
        });

        describe('click on backdrop', () => {
            it('should hide menu in root menu', async () => {
                const user = userEvent.setup();

                const { queryByText, queryByRole } = render(<Component />);

                await user.pointer([
                    { target: queryByText('Trigger') as HTMLDivElement, keys: '[MouseRight]' }
                ]);

                await waitFor(() => {
                    expect(queryByRole('presentation')).toBeInTheDocument();
                });

                await user.click(document.body.querySelector(`#context-menu-${id} .MuiModal-backdrop`) as HTMLElement);

                await waitFor(() => {
                    expect(queryByRole('presentation')).not.toBeInTheDocument();
                });
            });

            it.each([
                {
                    where: 'suboptions menu',
                    clickOn: optionWithSubOptions.label,
                    waitForAppear: optionWithSubOptions.options[1].label
                },
                {
                    where: 'confirmation menu',
                    clickOn: optionWithConfirmation.label,
                    waitForAppear: optionWithConfirmation.requireConfirm as string
                }
            ])('should hide menu in $where', async ({ clickOn, waitForAppear }) => {
                const user = userEvent.setup();

                const { queryByText, queryByRole } = render(<Component />);

                await user.pointer([
                    { target: queryByText('Trigger') as HTMLDivElement, keys: '[MouseRight]' }
                ]);

                await waitFor(() => {
                    expect(queryByRole('presentation')).toBeInTheDocument();
                });

                await user.click(queryByText(clickOn) as HTMLElement);

                await waitFor(() => {
                    expect(queryByText(waitForAppear)).toBeInTheDocument();
                });

                await user.click(document.body.querySelector(`#context-menu-${id} .MuiModal-backdrop`) as HTMLElement);

                await waitFor(() => {
                    expect(queryByText(waitForAppear)).not.toBeInTheDocument();
                    expect(queryByRole('presentation')).not.toBeInTheDocument();
                });
            });
        });
    });
});
