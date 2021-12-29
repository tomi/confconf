# confconf-purify

Integrates [`@confconf/confconf`](https://github.com/tomi/confconf/tree/main/packages/confconf) with [`purify-ts`](https://github.com/gigobyte/purify).

## Install

```bash
npm i --save @confconf/confconf-purify purify-ts
```

## Usage

```ts
import { confconf, envConfig } from "@confconf/confconf-purify";
import { Codec, number, string, GetType } from "purify-ts/Codec";

// Define a schema
const configSchema = Codec.interface({
  port: number,
  db: Codec.interface({
    host: string,
    name: string,
  }),
});

type Config = GetType<typeof configSchema>;

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
