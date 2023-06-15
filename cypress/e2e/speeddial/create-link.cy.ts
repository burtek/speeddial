/* eslint no-warning-comments: 1 */
describe('create link', () => {
    beforeEach(() => {
        cy.clearAllLocalStorage();
        cy.visit('/', { timeout: 10_000 });
    });

    it('hover', () => {
        cy.findByLabelText('Add new link').should('not.exist');
        cy.findByLabelText('Add new group').should('not.exist');

        cy.findByLabelText('Add new link or group').trigger('mouseover');

        cy.findByLabelText('Add new link').should('exist');
        cy.findByLabelText('Add new group').should('exist');
    });

    it('open dialog', () => {
        cy.getAllVisibleTiles().should('have.length', 0);

        cy.findByLabelText('Add new link or group').trigger('mouseover');

        cy.findByLabelText('Add new link').click();

        // TODO: use own test server
        cy.findByLabelText(/^URL/).type('https://www.youtube.com/');

        cy.findByText('Next').click();

        let title: string | undefined;

        cy.findByLabelText(/^Name/, { timeout: 10000 }).should('be.visible')
            .invoke('val')
            .should('have.length.above', 0)
            .then(v => {
                title = v?.toString();
            });
        cy.findByLabelText(/^Image URL/, { timeout: 10000 }).should('be.visible')
            .invoke('val')
            .should('have.length.above', 0);

        cy.findByLabelText('Background color').invoke('text')
            .should('match', /^#[0-9a-z]{6}$/i);
        cy.findByLabelText('Theme color').invoke('text')
            .should('match', /^#[0-9a-z]{6}$/i);

        cy.findByText('Save').click();

        cy.getTileByTitle(title as string).should('be.visible');
        cy.getAllVisibleTiles().should('have.length', 1);
    });
});
