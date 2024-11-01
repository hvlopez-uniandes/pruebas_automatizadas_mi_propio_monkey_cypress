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
    const $dialogModal = Cypress.$('div[role="dialog"]:visible');
    const $errorModal = Cypress.$('div:contains("Ocurrió un error"):visible');
    
    if ($dialogModal.length > 0 && eventsInModal >= modalEventLimit) {
        console.log("Se alcanzó el límite de eventos en el modal, cerrándolo.");
        cy.get('body').click('topRight');
        eventsInModal = 0;
    } else if ($errorModal.length > 0) {
        console.log("Modal de error detectado, cerrándolo.");
        cy.contains('button', 'OK').click({ force: true });
    }
}

function isModalPresent() {
    const $dialogModal = Cypress.$('div[role="dialog"]:visible');
    return $dialogModal.length > 0;
}

const eventStrategies = {
    clickLink: (inModal) => {
        console.log("Evento: Click en un enlace");
        const selector = inModal ? 'div[role="dialog"] a' : 'a';
        const $links = Cypress.$(selector);
        if ($links.length > 0) {
            const visibleLink = selectVisibleElement($links);
            if (visibleLink) {
                cy.wrap(visibleLink).click({ force: true });
            }
        }
    },
    fillTextInput: (inModal) => {
        console.log("Evento: Rellenar un campo de texto o email");
        
        // Selector basado en la presencia del modal
        const selector = inModal 
            ? 'div[role="dialog"] input' 
            : Cypress.$('form input').length > 0 
                ? 'form input' 
                : 'input';

        const $inputs = Cypress.$(selector);
        if ($inputs.length > 0) {
            const visibleInput = selectVisibleElement($inputs);
            if (visibleInput) {
                const inputType = visibleInput.getAttribute('type');
                const inputValue = inputType === 'email' ? faker.internet.email() : faker.lorem.words();
                cy.wrap(visibleInput).type(inputValue, { force: true });
            }
        }
    },
    selectCombo: (inModal) => {
        console.log("Evento: Interactuar con el elemento <ul> con clase 'nav navbar-nav' o selects");
        if (!inModal) {
            const $navUl = Cypress.$('ul.nav.navbar-nav');
            if ($navUl.length > 0) {
                cy.wrap($navUl).realClick();
            }
        } else {
            const $selectInModal = Cypress.$('div[role="dialog"] select');
            if ($selectInModal.length > 0) {
                const visibleSelect = selectVisibleElement($selectInModal);
                if (visibleSelect) {
                    cy.wrap(visibleSelect).select(getRandomInt(0, visibleSelect.options.length));
                }
            }
        }
    },
    clickButton: (inModal) => {
        console.log("Evento: Click en un botón");
        const selector = inModal ? 'div[role="dialog"] button' : 'button';
        const $buttons = Cypress.$(selector);
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
