import userEvent from '@testing-library/user-event';

import { render } from '@@config/test-utils';
import { useAppDispatch } from '@@data/index';
import { actions as speeddialActions, ROOT_SPEEDDIAL_ID } from '@@data/speeddial/slice';

import { AddNewTile } from '../add-tile';

// MUST be full or relative path, vite-tsconfig-paths doesn't resolve vitest.mock paths using `compilerOptions.paths` setting
vitest.mock('src/data/index', async importOriginal => {
    const module = await importOriginal<typeof import('@@data/index')>();
    return {
        ...module,
        useAppDispatch: vitest.fn(module.useAppDispatch)
    };
});

describe('speeddial/add-tile', () => {
    const mockDispatch = vitest.fn();
    vitest.mocked(useAppDispatch).mockReturnValue(mockDispatch);

    beforeEach(() => {
        vitest.clearAllMocks();
    });

    it.each([
        { type: 'root', parentId: ROOT_SPEEDDIAL_ID },
        { type: 'non-root', parentId: 'some other id' }
    ])('should render add icon without button for $type parent', ({ parentId }) => {
        const { container, queryAllByRole, queryByLabelText } = render(<AddNewTile parentId={parentId} />);

        expect(queryAllByRole('button')).toHaveLength(0);
        expect(container.querySelectorAll('svg')).toHaveLength(1);
        expect(queryByLabelText('tooltips.add_link_or_group')).toBeInTheDocument();
        expect(queryByLabelText('tooltips.add_link')).not.toBeInTheDocument();
        expect(queryByLabelText('tooltips.add_group')).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it.each([
        {
            type: 'root',
            parentId: ROOT_SPEEDDIAL_ID,
            expectedButtonLabels: ['tooltips.add_link', 'tooltips.add_group'],
            notExpectedButtonLabels: ['tooltips.add_link_or_group']
        },
        {
            type: 'non-root',
            parentId: 'some other id',
            expectedButtonLabels: ['tooltips.add_link'],
            notExpectedButtonLabels: ['tooltips.add_link_or_group', 'tooltips.add_group']
        }
    ])('should render expected buttons on hover for $type parent', async ({ parentId, expectedButtonLabels, notExpectedButtonLabels }) => {
        const user = userEvent.setup();
        const { container, queryAllByRole, queryByLabelText } = render(<AddNewTile parentId={parentId} />);

        await user.hover(queryByLabelText('tooltips.add_link_or_group') as HTMLElement);
        const buttons = queryAllByRole('button');

        expect(buttons).toHaveLength(expectedButtonLabels.length);

        expectedButtonLabels.forEach(label => {
            expect(queryByLabelText(label)).toBeInTheDocument();
        });
        notExpectedButtonLabels.forEach(label => {
            expect(queryByLabelText(label)).not.toBeInTheDocument();
        });

        expect(container).toMatchSnapshot();
    });

    it.each([
        {
            actionName: 'add link',
            type: 'root',
            parentId: ROOT_SPEEDDIAL_ID,
            expectedAction: speeddialActions.createLink({ parentId: ROOT_SPEEDDIAL_ID }),
            clickLabel: 'tooltips.add_link'
        },
        {
            actionName: 'add link',
            type: 'non-root',
            parentId: 'some other id',
            expectedAction: speeddialActions.createLink({ parentId: 'some other id' }),
            clickLabel: 'tooltips.add_link'
        },
        {
            actionName: 'add group',
            type: 'root',
            parentId: ROOT_SPEEDDIAL_ID,
            expectedAction: speeddialActions.createGroup(),
            clickLabel: 'tooltips.add_group'
        }
    ])('$clickLabel should dispatch expected action for $type parent upon clicking', async ({ clickLabel, expectedAction, parentId }) => {
        const user = userEvent.setup();
        const { queryByLabelText } = render(<AddNewTile parentId={parentId} />);

        await user.hover(queryByLabelText('tooltips.add_link_or_group') as HTMLElement);
        const button = queryByLabelText(clickLabel);

        expect(button).toBeInTheDocument();

        await user.click(button as HTMLElement);

        expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });
});
