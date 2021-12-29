# confconf

confconf is a Node.js configuration management library.

This repository is a monorepo for the following packages managed with [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

## Packages

- [@confconf/confconf](/packages/confconf) : the main package
- [@confconf/confconf-purify](/packages/confconf-purify) : integrates confconf with [`purify-ts`](https://github.com/gigobyte/purify)
- [@confconf/confconf-typebox](/packages/confconf-typebox) : integrates confconf with [`@sinclair/typebox`](https://github.com/sinclairzx81/typebox)
- [@confconf/aws-secrets-manager](/packages/aws-secrets-manager) : AWS Secrets Manager configuration provider

## Contributing

Read the [Contributing](./CONTRIBUTING.md) doc.
