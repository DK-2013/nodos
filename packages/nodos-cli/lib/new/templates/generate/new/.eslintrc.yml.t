---
to: './<%= name %>/.eslintrc.yml'
---
---

plugins:
  - jest
  - babel

root: true

# https://eslint.org/docs/user-guide/configuring#specifying-environments
env:
  node: true
  jest: true

# https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser
parser: @babel/eslint-parser

globals:
  app: readonly

extends:
  - 'eslint:recommended'
  - 'plugin:jest/recommended'

rules:
  no-console: 0

