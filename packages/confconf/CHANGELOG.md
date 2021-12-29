# @confconf/confconf

## 2.0.1

### Patch Changes

- 8b8dc64: fix ERR_PACKAGE_PATH_NOT_EXPORTED runtime error

## 2.0.0

### Major Changes

- 5e39f09: improve typescript typings

  1. Add support for typing both the schema and config separately

  This enables better type support when working with libraries like typebox and
  purify-ts.

  2. Type the `schema` property of `options` as `JSONSchemaType<TypeOfConfig>`

  This enables better checking that the schema and the type of config do
  match. Also it enables intellisense support when typing the schema inline,
  as long as the config type has been defined.

  3. Add missing `Confconf` type export

- 5e39f09: add @confconf/confconf-typebox package

  To better integrate `confconf` with `@sinclair/typebox`, a separate package
  `@confconf/confconf-typebox` has been created. It's a replacement for
  `@confconf/confconf` and their versions are kept in sync.

- 5e39f09: add @confconf/confconf-purify package

  To better integrate `confconf` with `purify-ts`, a separate package
  `@confconf/confconf-purify` has been created. It's a replacement for
  `@confconf/confconf` and their versions are kept in sync.
