# @confconf/confconf-typebox

## 2.1.0

### Minor Changes

- 1dbe80f: add name for configuration providers

### Patch Changes

- 0627bcd: validate whole schema instead of returning first error
- c6de94d: improve validation error messages
- 0627bcd: export ErrorObject type
- 0627bcd: add isValidationError type guard function

  This allows checking if throw error is of a type ValidationError

- Updated dependencies [0627bcd]
  - @confconf/confconf@2.1.0

## 2.0.1

### Patch Changes

- 8b8dc64: fix ERR_PACKAGE_PATH_NOT_EXPORTED runtime error
- Updated dependencies [8b8dc64]
  - @confconf/confconf@2.0.1

## 2.0.0

### Major Changes

- 5e39f09: add @confconf/confconf-typebox package

  To better integrate `confconf` with `@sinclair/typebox`, a separate package
  `@confconf/confconf-typebox` has been created. It's a replacement for
  `@confconf/confconf` and their versions are kept in sync.
