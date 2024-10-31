# Los Estudiantes Monkey Testing

Este proyecto realiza pruebas de monkey testing en el sitio web [Los Estudiantes](https://losestudiantes.com). Utiliza Cypress para automatizar eventos aleatorios, simulando la interacción aleatoria de un usuario con el sitio. La función `randomEvent()` ejecuta eventos como hacer clic en enlaces, llenar campos de texto, seleccionar opciones de un combo, y hacer clic en botones en la página, todo de manera recursiva y aleatoria hasta completar el número especificado de eventos.

## Enunciado

1.3 Su turno  
Ahora usted deberá crear una nueva función `randomEvent()` que tome como parámetro la cantidad de eventos que se desean lanzar secuencialmente, al igual que el método `randomClick`, y debe:

- Seleccionar un evento al azar entre estos:
  - Hacer click en un link al azar
  - Llenar un campo de texto al azar
  - Seleccionar un combo al azar
  - Hacer click en un botón al azar
- Realizar el evento
- Hacer un llamado recursivo a esta misma función hasta que no queden más monkeys.

**Aclaración:** El evento al azar es seleccionado por la función, no por usted.

## Solución

La función `randomEvent()` fue diseñada para cumplir con todos los requisitos del enunciado. A continuación, se describe cómo se implementó cada punto:

1. **"Debe tomar por parámetro la cantidad de eventos que se desean lanzar secuencialmente al igual que el método randomClick"**  
   La función `randomEvent(monkeysLeft)` toma un parámetro `monkeysLeft`, que representa la cantidad de eventos que se desean lanzar. Esta variable se decrementa en cada llamada recursiva hasta que llega a cero.

2. **"Seleccionar un evento al azar entre estos: Hacer click en un link al azar, Llenar un campo de texto al azar, Seleccionar un combo al azar, Hacer click en un botón al azar"**  
   Dentro de la función `randomEvent`, se selecciona un evento al azar usando el objeto `eventStrategies`, que contiene las estrategias para cada tipo de evento. La función elige una estrategia aleatoria de `eventStrategies` y ejecuta el evento correspondiente.

3. **"Realizar el evento"**  
   Cada estrategia en `eventStrategies` se implementa para realizar la acción correspondiente (clic en un enlace, llenado de un campo de texto, selección de un combo, clic en un botón).

4. **"Hacer un llamado recursivo a esta misma función hasta que no queden más monkeys"**  
   Después de realizar cada evento, la función `randomEvent` se llama a sí misma con `monkeysLeft - 1`. La recursividad continúa hasta que `monkeysLeft` llega a 0, momento en el cual la función deja de llamarse a sí misma.

5. **"El evento al azar es seleccionado por la función, no por usted"**  
   La selección del evento es aleatoria y se realiza dentro de la función `randomEvent` mediante la elección de una estrategia de `eventStrategies`. Esto significa que la selección es controlada por la función, no manualmente por el usuario.

## Estructura del Proyecto

- **Cypress**: La carpeta principal de Cypress.
- **cypress/e2e/monkey/monkey_testing.cy.js**: Contiene la función `randomEvent()` y las estrategias de eventos. Aquí es donde se define la lógica para ejecutar los eventos aleatorios.
- **cypress.config.js**: Archivo de configuración de Cypress para personalizar el entorno de prueba.

## Requisitos Previos

- Node.js (versión 12 o superior)
- npm (que se instala junto con Node.js)

## Instalación

1. Clona el repositorio en tu máquina local.
    ```bash
    git clone <url_del_repositorio>
    ```
2. Navega a la carpeta del proyecto.
    ```bash
    cd nombre_del_proyecto
    ```
3. Instala las dependencias del proyecto.
    ```bash
    npm install
    ```

## Ejecución de las Pruebas

Para ejecutar las pruebas de monkey testing en Los Estudiantes, sigue los pasos a continuación.

### Modo Interactivo

Ejecuta el siguiente comando para abrir Cypress en modo interactivo:

```bash
npx cypress open
```

### Modo Manual HeadLess

Ejecuta el siguiente comando para ejecutar Cypress en modo manul:

```bash
npx cypress run --spec "cypress/e2e/monkey/monkey_testing.cy.js"

```

### Modo Manual Head(Ver ejecucion)

Ejecuta el siguiente comando para ejecutar Cypress en modo manul:

```bash
npx cypress run --spec "cypress/e2e/monkey/monkey_testing.cy.js" --headed
```

