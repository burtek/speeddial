import userEvent from '@testing-library/user-event';

import { render, screen } from '@@config/test-utils';

import { AddNewTile } from '../add-tile';


describe('speeddial/add-tile', () => {
    beforeEach(() => {
        vitest.clearAllMocks();
    });

    it.each([
        {
            expectedNotToExist: ['tooltips.add_link_or_group', 'tooltips.add_group'],
            hover: 'tooltips.add_link',
            onAddLink: vitest.fn(),
            onAddGroup: undefined
        },
        {
            expectedNotToExist: ['tooltips.add_link', 'tooltips.add_group'],
            hover: 'tooltips.add_link_or_group',
            onAddLink: vitest.fn(),
            onAddGroup: vitest.fn()
        }
    ])('should render add icon without button', ({ expectedNotToExist, hover, onAddGroup, onAddLink }) => {
        const { container } = render(<AddNewTile onAddLink={onAddLink} onAddGroup={onAddGroup} />);

        expect(screen.queryAllByRole('button')).toHaveLength(0);
        expect(container.querySelectorAll('svg')).toHaveLength(1);
        expect(screen.getByLabelText(hover)).toBeInTheDocument();

        expectedNotToExist.forEach(label => {
            expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
        });

        expect(container).toMatchSnapshot();
    });

    it.each([
        {
            hover: 'tooltips.add_link_or_group',
            onAddLink: vitest.fn(),
            onAddGroup: vitest.fn(),
            expectedButtonLabels: ['tooltips.add_link', 'tooltips.add_group'],
            notExpectedButtonLabels: ['tooltips.add_link_or_group']
        },
        {
            hover: 'tooltips.add_link',
            onAddLink: vitest.fn(),
            onAddGroup: undefined,
            expectedButtonLabels: ['tooltips.add_link'],
            notExpectedButtonLabels: ['tooltips.add_link_or_group', 'tooltips.add_group']
        }
    ])('should render expected buttons on hover', async ({ hover, expectedButtonLabels, notExpectedButtonLabels, ...props }) => {
        const user = userEvent.setup();
        const { container } = render(<AddNewTile {...props} />);

        await user.hover(screen.getByLabelText(hover));
        const buttons = screen.getAllByRole('button');

        expect(buttons).toHaveLength(expectedButtonLabels.length);

        expectedButtonLabels.forEach(label => {
            expect(screen.getByLabelText(label)).toBeInTheDocument();
        });
        notExpectedButtonLabels.forEach(label => {
            expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
        });

        expect(container).toMatchSnapshot();
    });

    describe('callbacks', () => {
        const onAddLink = vitest.fn();
        const onAddGroup = vitest.fn();

        it.each([
            {
                clickLabel: 'tooltips.add_link',
                expectation: () => {
                    expect(onAddLink).toHaveBeenCalled();
                }
            },
            {
                clickLabel: 'tooltips.add_group',
                expectation: () => {
                    expect(onAddGroup).toHaveBeenCalled();
                }
            }
        ])('$clickLabel should call back expected function', async ({ clickLabel, expectation }) => {
            const user = userEvent.setup();
            render(<AddNewTile onAddLink={onAddLink} onAddGroup={onAddGroup} />);

            await user.hover(screen.getByLabelText('tooltips.add_link_or_group'));
            const button = await screen.findByLabelText(clickLabel);

            expect(button).toBeInTheDocument();

            await user.click(button);

            expectation();
        });
    });
});
