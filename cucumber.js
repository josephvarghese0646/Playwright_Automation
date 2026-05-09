module.exports = {
  default: {
    require: ['src/steps/**/*.steps.ts', 'src/hooks/hooks.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
};