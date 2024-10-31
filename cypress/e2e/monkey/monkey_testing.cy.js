const seedrandom = require('seedrandom');
const { faker } = require('@faker-js/faker');

const rng = seedrandom('prueba-automatizada-semana-4-bono');
const modalEventLimit = 25; 
let eventsInModal = 0;

function getRandomInt(min, max) {
    return min + Math.floor(rng() * (max - min));
}

function selectVisibleElement($elements) {
    let attempts = $elements.length;
    while (attempts > 0) {
        const randomIndex = getRandomInt(0, $elements.length);
        const randomElement = $elements[randomIndex];
        if (!Cypress.dom.isHidden(randomElement)) {
            return randomElement;
        }
        attempts--;
    }
    return null;
}

function closeModalIfLimitReached() {
    const $dialogModal = Cypress.$('div[role="dialog"]');
    const $errorModal = Cypress.$('div:contains("Ocurrió un error")');

    if ($dialogModal.length > 0 && eventsInModal >= modalEventLimit) {
        console.log("Se alcanzó el límite de eventos en el modal, cerrándolo.");
        cy.get('body').click('topRight');
        eventsInModal = 0; 
    } else if ($errorModal.length > 0) {
        console.log("Modal de error detectado, cerrándolo.");
        cy.get('button').contains('OK').click({ force: true }); 
    }
}

function isModalPresent() {
    const $dialogModal = Cypress.$('div[role="dialog"]');
    return $dialogModal.length > 0;
}

const eventStrategies = {
    clickLink: (inModal) => {
        console.log("Evento: Click en un enlace");
        const $links = inModal ? Cypress.$('div[role="dialog"] a') : Cypress.$('a');
        if ($links.length > 0) {
            const visibleLink = selectVisibleElement($links);
            if (visibleLink) {
                cy.wrap(visibleLink).click({ force: true });
            }
        }
    },
    fillTextInput: (inModal) => {
        console.log("Evento: Rellenar un campo de texto o email");
        const $inputs = inModal ? Cypress.$('div[role="dialog"] input[type="text"], div[role="dialog"] input[type="email"]') : Cypress.$('input[type="text"], input[type="email"]');
        if ($inputs.length > 0) {
            const visibleInput = selectVisibleElement($inputs);
            if (visibleInput) {
                const inputType = visibleInput.getAttribute('type');
                if (inputType === 'email') {
                    const randomEmail = faker.internet.email();
                    cy.wrap(visibleInput).type(randomEmail, { force: true });
                } else {
                    const randomText = faker.lorem.words();
                    cy.wrap(visibleInput).type(randomText, { force: true });
                }
            }
        }
    },
    selectCombo: (inModal) => {
        console.log("Evento: Seleccionar una opción de un combo");
        const $selects = inModal ? Cypress.$('div[role="dialog"] select') : Cypress.$('select');
        if ($selects.length > 0) {
            const visibleSelect = selectVisibleElement($selects);
            if (visibleSelect) {
                const optionsLength = visibleSelect.options.length;
                cy.wrap(visibleSelect).select(getRandomInt(0, optionsLength));
            }
        }
    },
    clickButton: (inModal) => {
        console.log("Evento: Click en un botón");
        const $buttons = inModal ? Cypress.$('div[role="dialog"] button') : Cypress.$('button');
        if ($buttons.length > 0) {
            const visibleButton = selectVisibleElement($buttons);
            if (visibleButton) {
                cy.wrap(visibleButton).click({ force: true });
            }
        }
    }
};

function randomEvent(monkeysLeft) {
    if (monkeysLeft > 0) {
        const inModal = isModalPresent();

        if (inModal) {
            if (eventsInModal >= modalEventLimit) {
                closeModalIfLimitReached();
                randomEvent(monkeysLeft); 
                return;
            } else {
                eventsInModal++;
            }
        } else {
            closeModalIfLimitReached();
        }

        console.log(`--- Inicio del evento de monkey ${monkeysLeft} (en modal: ${inModal}) ---`);

        const strategies = Object.keys(eventStrategies);
        const randomStrategy = strategies[getRandomInt(0, strategies.length)];
        eventStrategies[randomStrategy](inModal);

        cy.wait(1000).then(() => {
            console.log(`--- Fin del evento de monkey - Restan ${monkeysLeft - 1} eventos ---`);
            randomEvent(monkeysLeft - 1);
        });
    } else {
        console.log("### Todos los eventos de monkey han sido completados ###");
    }
}

describe('Los estudiantes under monkeys', function() {
    it('visits los estudiantes and survives monkeys', function() {
        cy.visit('https://losestudiantes.com');
        
        console.log("### Inicio de la prueba de monkey testing ###");
        cy.wait(1000);
        randomEvent(100);
    });
});
