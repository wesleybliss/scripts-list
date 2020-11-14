# Scripts List

> Easily list all scripts in your `package.json`

## Install

**Locally:**

```console
$ npm install scripts-list
```

**Globally:**

```console
$ npm install -g scripts-list
```

Update your `package.json` to include it as a script:

```json
{
    ...,
    "scripts": {
        "tasks": "npx scripts-list",
        "dev": "nodemon src/index.js",
        ...
    }
}
```

Optionally add descriptions for your scripts:

```json
{
    ...,
    "scriptsList": {
        "dev": "Start the development server",
        ...
    }
}
```

## CLI Options

| Argument | Type    | Default | Options | Description |
| -------- | ------- | ------- | ------- | ----------- |
| --format | String  | `json`    | `json, list` | Control the output format |
| --color  | Boolean | `false`   | `true, false` | Use colors in output |
| --indent | Boolean|String | `\t` | `true, false` or custom string, e.g. `'  '` | Indent output below each command (applies to formats: `list`) |

## Examples

**Default JSON**

```console
scripts-list
```

**List format with colors & custom indent**

```console
scripts-list --format list --color --indent='  '
```
