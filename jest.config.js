module.exports = {
  verbose: true,
  // preset: '@vue/cli-plugin-unit-jest/presets/no-babel'
  "transform": {
    // process `*.js` files with `babel-jest`
    ".*\\.(js)$": "babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  "collectCoverage": true,
  "collectCoverageFrom": [
    "!**/node_modules/**",
    "<rootDir>/src/**/**/*.vue",
    "<rootDir>/src/*.vue"
  ]
}
