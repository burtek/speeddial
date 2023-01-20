import { render } from 'config/test-utils';

import { SearchBar } from './index';


describe('search-bar', () => {
    it('should match snapshot', () => {
        const { container } = render(<SearchBar />);

        expect(container).toMatchSnapshot();
    });
});
