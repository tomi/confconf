# confconf `.env` file configuration provider

## Features

## Install

```bash
npm i --save @confconf/dotenv
```

## Usage

```ts
import { confconf } from "@confconf/confconf";
import { dotenv } from "@confconf/dotenv";

// Define a schema
const configSchema = {
  // ...
};
type Config = {
  // ...
};

// Create the configuration loader
const configLoader = confconf<Config>({
  schema: configSchema,
  providers: [
    // Load all variables from .env file
    dotenv(),
    // or specify a path to the custom file with passing options:
    // dotenv({ path: ".env.my.vars" })
  ],
});

// Load configuration and validate it against the schema
const config = await configLoader.loadAndValidate();
```

## API reference

### `dotenv(opts: DotenvProviderOpts)`

Creates a new instance of the dotenv configuration provider

#### `opts` [DotenvProviderOpts]

```ts
interface DotenvProviderOpts {
  /**
   * Optional path to the environment variables file. Defaults to
   * path.resolve(process.cwd(), '.env')
   */
  path: string;
}
```
