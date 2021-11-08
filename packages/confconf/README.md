# confconf

## Features

- Loading and merging: configuration is loaded from a number of configuration providers and merged
- Multiple supported loaders: configuration can be loaded e.g. from environment variables, json files, .env files, AWS secrets manager
- Nested structure: keys and values can be organized in a tree structure
- Validation: configurations are validated against a JSON schema using [ajv](https://ajv.js.org/)
- Type safe: Written in TypeScript. Type definitions included.

## Install

```bash
npm i --save @confconf/confconf
```

## Usage

The library is used as follows:

1. define a JSON schema for the configuration. Something like [TypeBox](https://github.com/sinclairzx81/typebox) or [purify-ts Codecs](https://gigobyte.github.io/purify/utils/Codec) are recommended for this.
2. define where the configuration is loaded from using configuration providers. See list of providers [here](#providers)
3. load and validate the configuration

### With [TypeBox](https://github.com/sinclairzx81/typebox)

```ts
import { confconf, envConfig } from "@confconf/confconf";
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

// Create the configuration loader
const configLoader = confconf<Config>({
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
});

// Load configuration and validate it against the schema
const config = await configLoader.loadAndValidate();
```

### With purify-ts

```ts
import { confconf, envConfig } from "@confconf/confconf";
import { Codec, number, string, GetType } from "purify-ts";

// Define a schema
const configSchema = Codec.interface({
  port: number,
  db: Codec.interface({
    host: string,
    name: string,
  }),
});

type Config = GetType<typeof configSchema>;

// Create the configuration loader
const configLoader = confconf<Config>({
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
});

// Load configuration and validate it against the schema
const config = await configLoader.loadAndValidate();
```

### With plain JSON schema

```ts
import { confconf, envConfig } from "@confconf/confconf";

// Define a schema
const configSchema = {
  type: "object",
  properties: {
    port: { type: "number" },
    db: {
      type: "object",
      properties: {
        host: { type: "string" },
        name: { type: "string" },
      },
      required: ["host", "name"]
    }),
  },
  required: ["port", "db"]
});

type Config = {
  port: number;
  db: {
    host: string;
    name: string;
  }
}

// Create the configuration loader
const configLoader = confconf<Config>({
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
});

// Load configuration and validate it against the schema
const config = await configLoader.loadAndValidate();
```

## Default values

Default values can be defined either using the JSON schema or by using the static configuration provider.

### With JSON schema:

```ts
import { confconf } from "@confconf/confconf";

// Define a schema using JSON schema
const configSchema = {
  type: "object",
  properties: {
    port: {
      type: "number",
      default: 3000,
    },
  },
  required: ["port"],
};
```

### With static configuration provider:

```ts
import { confconf, staticConfig } from "@confconf/confconf";

// Define a schema using JSON schema
const configSchema = {
  type: "object",
  properties: {
    port: { type: "number" },
  },
  required: ["port"],
};

const configLoader = confconf({
  schema: configSchema,
  providers: [
    // Static config is loaded first, later defined providers can override its values
    staticConfig({
      port: 3000,
    }),
    // Other providers
  ],
});
```

## Configuration loading and merging

The partial configurations are loaded from all the defined configuration providers when `loadAndValidate` is called. After the partial configurations have been loaded, they are merged into a single JS object. The order is such that later defined configuration providers can override the configuration from earlier providers.

## Validation

After the configuration is loaded and merged, it is validated against the provided schema. This is done using [ajv](https://ajv.js.org/):

- Any additional properties that have not been defined in the schema are removed
- Values are coerced into their corresponding types whenever possible. This is because certain providers (such as environment variables) can only provide string values. See [Coercion section](#coercion) for more details.
- The returned configuration is frozen, so it can't be mutated. This can change by instantiating `confconf` with `{ freezeConfig: false }`.

## Coercion

See [Ajv's type coercion rules](https://ajv.js.org/coercion.html) for more details how the type coercion works.

## Providers

confconf is bundled with the following providers:

- envConfig : Load configuration from the environment variables
- staticConfig : Provide configuration using static value
- devOnlyConfig : Provide a static value configuration that is loaded only when NODE_ENV=development

In addition these are coming available soon:

- [@confconf/json]() : Load configuration from JSON files
- [@confconf/dotenv]() : Load configuration from `.env` files
