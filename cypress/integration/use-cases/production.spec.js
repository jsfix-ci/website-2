import { onlyOn } from '@cypress/skip-test';

// The other tests only check the English site. For the production tests, we need to make sure the other language
// versions are also healthy. This test does some *very* basic checks on all our language versions, working on the
// assumption that if the extensive other tests pass and these basic tests ensure that the other sites are alive and
// correctly serving the JS, they will likely also be ok.
describe('Make sure all productions sites are still alive', () => {
    const sites = [
        'https://www.datenanfragen.de',
        'https://www.datarequests.org',
        'https://www.demandetesdonnees.fr',
        'https://www.pedidodedados.org',
        'https://www.solicituddedatos.es',
        'https://www.osobnipodaci.org',
        'https://www.gegevensaanvragen.nl',
    ];

    for (const site of sites) {
        it(site, () => {
            onlyOn('production');

            cy.visit(site);
            cy.get('#wizard-tabs > :nth-last-child(1)').click();

            cy.visit(`${site}/generator`);
            cy.get('[for="request-type-choice-erasure"]').click();
            cy.get('[for="request-transport-medium-choice-fax"]').click();
            cy.get('#name0-delete-id_data').click();
            cy.get('#download-button').clickLinkWithoutFollowingHref({ force: true });

            // Some languages don't have any blog posts, so we have to exclude them here.
            if (!['https://www.gegevensaanvragen.nl'].includes(site)) {
                cy.visit(`${site}/blog`);
                cy.get(':nth-child(1) > .padded > a > h1').click();
                cy.url().should('match', new RegExp(`${site.replace('.', '\\.')}/blog/.+`));
            }
        });
    }
});
