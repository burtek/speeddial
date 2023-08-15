/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';


Cypress.Commands.add('loadApp', () => {
    cy.clearAllLocalStorage();
    cy.visit('/', { timeout: 5_000 });
});

Cypress.Commands.add('getTileByTitle', (title: string) => cy.findByText(title, { timeout: 500 }).parents('a'));

Cypress.Commands.add(
    'getAllDialogTiles',
    () => cy.findByRole('presentation').get<HTMLAnchorElement | HTMLDivElement>('[data-group-content] > [role="button"]')
);
Cypress.Commands.add(
    'getAllRootTiles',
    () => cy.get<HTMLAnchorElement | HTMLDivElement>('#root [data-group-content] > [role="button"]')
);

declare global {
    namespace Cypress {
        interface Chainable {
            getAllDialogTiles: () => Cypress.Chainable<JQuery<HTMLAnchorElement | HTMLDivElement>>;
            getAllRootTiles: () => Cypress.Chainable<JQuery<HTMLAnchorElement | HTMLDivElement>>;
            getTileByTitle: (title: string) => Cypress.Chainable<JQuery<HTMLAnchorElement>>;
            loadApp: () => Chainable<void>;
        }
    }
}
