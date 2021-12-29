# Contributing

## Documenting changes

Changelogs are generated using [changesets](https://github.com/changesets/changesets). Every change that should be included in the changelog should have a changeset. It can be created with

```bash
npx changeset
```

## Publishing new versions

Clean, build & test code:

```bash
npm run clean && npm run build && npm run test
```

Ensure everything builds and tests pass. Bump versions and update changelogs:

```bash
npx changeset version
```

Review both the changelog entries and the version changes for packages. Commit the changes. Publish new versions:

```bash
npx changeset publish
```

Push the commit & tags to remote:

```bash
git push --follow-tags
```
