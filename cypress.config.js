const { defineConfig } = require("cypress");

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
      // implement node event listeners here
    },
  },
});
