import seedrandom from 'seedrandom';
const rng = seedrandom('prueba-automatizada-semana-4-bono'); // Seed for reproducibility
function getRandomInt(min, max) {
    return min + Math.floor(rng() * (max - min));
}

const eventStrategies = {
    clickLink: () => {
        cy.get('a').then($links => {
            const randomLink = $links.get(getRandomInt(0, $links.length));
            if (!Cypress.dom.isHidden(randomLink)) {
                cy.wrap(randomLink).click({ force: true });
            }
        });
    },
    fillTextInput: () => {
        cy.get('input[type="text"]').then($inputs => {
            const randomInput = $inputs.get(getRandomInt(0, $inputs.length));
            if (!Cypress.dom.isHidden(randomInput)) {
                cy.wrap(randomInput).type('Texto aleatorio', { force: true });
            }
        });
    },
    selectCombo: () => {
        cy.get('select').then($selects => {
            const randomSelect = $selects.get(getRandomInt(0, $selects.length));
            if (!Cypress.dom.isHidden(randomSelect)) {
                const optionsLength = randomSelect.options.length;
                cy.wrap(randomSelect).select(getRandomInt(0, optionsLength));
            }
        });
    },
    clickButton: () => {
        cy.get('button').then($buttons => {
            const randomButton = $buttons.get(getRandomInt(0, $buttons.length));
            if (!Cypress.dom.isHidden(randomButton)) {
                cy.wrap(randomButton).click({ force: true });
            }
        });
    }
};

function randomEvent(monkeysLeft) {
    if (monkeysLeft > 0) {
        const strategies = Object.keys(eventStrategies);
        const randomStrategy = strategies[getRandomInt(0, strategies.length)];

        eventStrategies[randomStrategy]();

        cy.wait(1000);

        randomEvent(monkeysLeft - 1);
    }
}

describe('Los estudiantes under monkeys', function() {
    it('visits los estudiantes and survives monkeys', function() {
        cy.visit('https://losestudiantes.com');
        
        cy.get('button').contains('Cerrar').then($button => {
            if ($button.is(':visible')) {
                cy.wrap($button).click({ force: true });
            }
        });

        cy.wait(1000);
        randomEvent(10);
    });
});
