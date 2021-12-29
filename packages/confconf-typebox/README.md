# confconf-typebox

Integrates [`@confconf/confconf`](https://github.com/tomi/confconf/tree/main/packages/confconf) with [`@sinclair/typebox`](https://github.com/sinclairzx81/typebox).

## Install

```bash
npm i --save @confconf/confconf-typebox @sinclair/typebox
```

## Usage

```ts
import { confconf, envConfig } from "@confconf/confconf-typebox";
import { Static, Type } from "@sinclair/typebox";

// Define a schema
const configSchema = Type.Object({
  port: Type.Number(),
  db: Type.Object({
    host: Type.String(),
    name: Type.String(),
  }),
});

type Config = Static<typeof configSchema>;

// Create the configuration loader and load configuration and validate
// it against the schema
const config = await confconf({
  schema: configSchema,
  providers: [
    // Load from env variables
    envConfig({
      // Map the specifc env variables into a specific structure
      structure: {
        port: "PORT",
        db: {
          host: "DB_HOST",
          name: "DB_NAME",
        },
      },
    }),
  ],
}).loadAndValidate();
```
