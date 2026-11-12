# Scripts List

> List all scripts in your `package.json`, with descriptions

```
┌────────┬───────────────────────┬────────────────────────────────────────┐
│ Script │ Description           │ Command                                │
├────────┼───────────────────────┼────────────────────────────────────────┤
│ dev    │ Start the dev server  │ vite --host 0.0.0.0 --port 3000 --open │
│ build  │ Type-check and bundle │ tsc -b && vite build --mode production │
│ lint   │ (No description)      │ eslint .                               │
└────────┴───────────────────────┴────────────────────────────────────────┘
```

Requires Node 22.12+. Zero runtime dependencies.

## Install

```shell
pnpm add -D scripts-list
# or
npm install -D scripts-list
```

Add it as a script in your `package.json`:

```json
"scripts": {
    "tasks": "scripts-list",
    "dev": "vite"
}
```

Add descriptions under `scriptsList`:

```json
"scriptsList": {
    "dev": "Start the development server"
}
```

The script that runs `scripts-list` is hidden from the output (use `--include-self` to show it).

## CLI

```shell
scripts-list [options]
```

| Option           | Default | Description                                                              |
| ---------------- | ------- | ------------------------------------------------------------------------ |
| `-f, --format`   | `table` | `table`, `list` or `json`                                                |
| `--[no-]color`   | auto    | Force colors on or off. Auto = on in a TTY, off if `NO_COLOR` is set     |
| `--indent`       | `\t`    | `list` format only. A string, or a number of spaces                      |
| `--include-self` | `false` | Include scripts that run `scripts-list`                                  |
| `-v, --version`  |         | Print version                                                            |
| `-h, --help`     |         | Print help                                                               |

```shell
pnpm tasks                                  # table
pnpm tasks --format list --indent 4         # list, 4 space indent
pnpm tasks --format json                    # machine readable
```

The `table` format truncates the Command column (then Description) to fit your terminal width.

## Library

```ts
import { readFile } from 'node:fs/promises'

import { parseTasks, scriptsList } from 'scripts-list'

const pkg = JSON.parse(await readFile('package.json', 'utf8'))

scriptsList(pkg, { format: 'table', color: true })
// => string

parseTasks(pkg)
// => [{ name: 'dev', command: 'vite', description: 'Start the development server' }]
```

Exports: `scriptsList`, `parseTasks`, `readDescriptions`, `formatters`, `FORMAT_NAMES`, `DEFAULT_FORMAT`, and the types `Task`, `FormatName`, `FormatOptions`, `Formatter`, `PackageJson`.

## Development

```shell
pnpm install
pnpm dev            # run the CLI from source (Node strips the types)
pnpm test           # node:test
pnpm typecheck
pnpm lint           # eslint --fix
pnpm build          # emits dist/ (JS + .d.ts)
```

Source is `src/`, tests are `test/`. Only `dist/` is published.

## Publishing to npm

One-time setup:

1. Create an npm account and enable 2FA
2. `npm login`

Each release:

1. Make sure the working tree is clean and `main` is up to date
2. Bump the version. This also creates a git commit and tag:
   ```shell
   npm version patch   # or minor / major
   ```
3. Dry run. Check that only `dist/`, `package.json`, `README.md` and `LICENSE` are listed:
   ```shell
   npm pack --dry-run
   ```
4. Publish. `prepublishOnly` runs typecheck, lint, tests and a fresh build first:
   ```shell
   npm publish
   ```
   Enter your 2FA code when prompted
5. Push the commit and tag:
   ```shell
   git push --follow-tags
   ```
6. Verify: `npx scripts-list@latest --version`

Notes:

- A published version can never be overwritten. If you botch a release, bump and publish again (or `npm deprecate`)
- Version 2.0.0 is the right bump for the first release of this rewrite: ESM only, Node 22.12+, and the default format changed from `json` to `table`
- For CI publishing with provenance, publish from GitHub Actions with `npm publish --provenance` and `id-token: write` permission

## License

MIT
