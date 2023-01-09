import { render } from 'config/test-utils';

import { AppLayout } from './app';


describe('app', () => {
    it('should match snapshot', () => {
        const { container } = render(<AppLayout />);

        expect(container).toMatchSnapshot();
    });
});
