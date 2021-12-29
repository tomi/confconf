---
"@confconf/confconf": major
---

improve typescript typings

1. Add support for typing both the schema and config separately

This enables better type support when working with libraries like typebox and
purify-ts.

2. Type the `schema` property of `options` as `JSONSchemaType<TypeOfConfig>`

This enables better checking that the schema and the type of config do
match. Also it enables intellisense support when typing the schema inline,
as long as the config type has been defined.

3. Add missing `Confconf` type export
