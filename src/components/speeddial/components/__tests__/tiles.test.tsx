import { render } from '@@config/test-utils';

import { AnchorTile, Tile } from '../tile';


describe('sppeddial/componnets/tile', () => {
    describe.each([
        { type: 'tile', component: Tile },
        { type: 'achor tile', component: AnchorTile }
    ])('$type', ({ component: Component }) => {
        it.each([
            { isDragging: false },
            { isDragging: true }
        ])('should match snapshot with isDragging=$isDragging', ({ isDragging }) => {
            const { container } = render(<Component isDragging={isDragging}><div>Some content</div></Component>);

            expect(container).toMatchSnapshot();
        });
    });
});
