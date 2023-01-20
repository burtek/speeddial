import { render } from 'config/test-utils';

import { AppFooter } from './index';


describe('app-footer', () => {
    beforeAll(() => {
        vitest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2021);
    })
    
    afterAll(() => {
        vitest.mocked(Date.prototype.getFullYear).mockRestore();
    })

    it('should match snapshot', () => {
        const { container } = render(<AppFooter />);

        expect(container).toMatchSnapshot();
    });
});
