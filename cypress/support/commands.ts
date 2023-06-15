/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';


Cypress.Commands.add('loadApp', () => {
    cy.clearAllLocalStorage();
    cy.visit('/', { timeout: 10_000 });
});

Cypress.Commands.add('getTileByTitle', (title: string) => cy.findByText(title, { timeout: 500 }).parents('a'));

Cypress.Commands.add('getAllVisibleTiles', () => {
    try {
        return cy.findByRole('presentation').get('[data-group-content]');
    } catch {
        return cy.get('#root [data-group-content]');
    }
});

declare global {
    namespace Cypress {
        interface Chainable {
            getAllVisibleTiles: () => Cypress.Chainable<JQuery<HTMLAnchorElement | HTMLDivElement>>;
            getTileByTitle: (title: string) => Cypress.Chainable<JQuery<HTMLAnchorElement>>;
            loadApp: () => Chainable<void>;
        }
    }
}
