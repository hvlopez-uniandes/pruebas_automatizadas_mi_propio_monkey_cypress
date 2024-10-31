const { defineConfig } = require("cypress");
const merge = require('mochawesome-merge').merge;
const marge = require('mochawesome-report-generator');

module.exports = defineConfig({
  e2e: {
    video: true,
    videosFolder: 'results/videos',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'results',
      overwrite: false,
      html: true,
      json: true,
    },
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        try {
          const jsonReport = await merge({
            files: ['results/*.json'],
          });

          const fs = require('fs');
          fs.writeFileSync('results/combined-report.json', JSON.stringify(jsonReport, null, 2));

          console.log("Archivos JSON combinados exitosamente.");

          await marge.generate(jsonReport, {
            reportDir: 'results',
            saveJson: true,
          });

          console.log("Reporte HTML generado exitosamente en la carpeta results.");
        } catch (error) {
          console.error(`Error al generar el reporte: ${error.message}`);
        }
      });
    },
  },
});
