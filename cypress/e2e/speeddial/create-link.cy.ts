/* eslint no-warning-comments: 1 */
describe('create link', () => {
    beforeEach(() => {
        cy.loadApp();
    });

    it('should create link', () => {
        cy.getAllRootTiles().should('have.length', 0);

        cy.findByLabelText('Add new link').should('not.exist');
        cy.findByLabelText('Add new group').should('not.exist');

        cy.findByLabelText('Add new link or group').trigger('mouseover');

        cy.findByLabelText('Add new link').should('exist');
        cy.findByLabelText('Add new group').should('exist');

        cy.findByLabelText('Add new link').click();

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

        cy.findByText('Save').click();

        cy.getTileByTitle('YouTube').should('be.visible');
        cy.getAllRootTiles().should('have.length', 1);
    });
});
