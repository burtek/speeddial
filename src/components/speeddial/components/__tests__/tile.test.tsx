import { render } from '@@config/test-utils';

import { Tile } from '../tile';


describe('sppeddial/componnets/tile', () => {
    describe.each([
        { type: 'tile', component: 'div' as const },
        { type: 'achor tile', component: 'a' as const }
    ])('$type', ({ component }) => {
        it.each([
            { isDragging: false },
            { isDragging: true }
        ])('should match snapshot with isDragging=$isDragging', ({ isDragging }) => {
            const { container } = render(<Tile component={component} isDragging={isDragging}><div>Some content</div></Tile>);

            expect(container).toMatchSnapshot();
        });
    });
});
