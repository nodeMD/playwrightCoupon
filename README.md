Playwright E2E tests

Test are set up to check the web app to cover all three browsers engines:
- blink - engine for: chrome, edge, opera, etc. (tests are running on *Chrome*),
- gecko - engine for: firefox (tests are running on *Firefox*),
- webkit - engine for: safari (tests are running on *Safari*),

plus on *Mobile Chrome* browser.

Tests are set up to run on Github Action CI.

# Quick start guide:
install all dependencies:
`yarn`

start all tests:
`yarn test`

start with browsers UI:
`yarn test-headed`

format tests code:
`yarn format`

check test code linting:
`yarn lint`

fix test code linting:
`yarn lint-fix`
