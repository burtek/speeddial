/* eslint no-warning-comments: 1 */
describe('create link', () => {
    beforeEach(() => {
        cy.loadApp();
    });

    it('should edit link', () => {
        cy.getTileByTitle('YouTube').should('be.visible');

        cy.getTileByTitle('YouTube').rightclick();
        cy.findByLabelText('Edit').click();

        // TODO: use own test server
        cy.findByLabelText(/^URL/).type('https://www.youtube.com/');

        cy.findByText('Next').click();

        cy.findByLabelText(/^Name/, { timeout: 10000 }).should('be.visible')
            .invoke('val')
            .should('have.length.above', 0);
        cy.findByLabelText(/^Image URL/, { timeout: 10000 }).should('be.visible')
            .invoke('val')
            .should('have.length.above', 0);

        cy.findByLabelText('Background color').invoke('text')
            .should('match', /^#[0-9a-z]{6}$/i);
        cy.findByLabelText('Theme color').invoke('text')
            .should('match', /^#[0-9a-z]{6}$/i);

        cy.findByDisplayValue('Youtube').type('{end}.new');

        cy.findByText('Save').click();

        cy.getTileByTitle('YouTube.new').should('be.visible');
        cy.getAllRootTiles().should('have.length', 1);
    });
});
