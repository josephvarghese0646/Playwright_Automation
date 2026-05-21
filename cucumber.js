module.exports = {
  default: {
    require: ['step_definitions/**/*.ts', 'hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 2
  }
};