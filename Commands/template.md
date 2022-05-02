## Command Template

```js
const Command = require("../../Structures/Classes/Command");

module.exports = new Command({
  name: "", // Needed
  description: "", // Needed
  category: "", // Needed
  aliases: [""], // Optional
  examples: "", // Optional
  developer: false, // Optional
  nsfw: false, // optional
  botPermissions: [], // Optional
  userPermissions: [], // Optional
  run: async ({}) => {}, // Needed
});
```

## Options and Description

| Command Options | Description                              | Type                     | Required |
| --------------- | ---------------------------------------- | ------------------------ | -------- |
| name            | Name of the command                      | `string`                 | `Yes`    |
| description     | Description of the command               | `string`                 | `Yes`    |
| category        | Category of the command                  | `string`                 | `Yes`    |
| aliases         | Aliases for the command                  | `string[]`               | `No`     |
| examples        | Examples for the command                 | `string[]`               | `No`     |
| developer       | If the command is only for the developer | `boolean`                | `No`     |
| nsfw            | if the command is NSFW                   | `boolean`                | `No`     |
| userPermissions | Required User Permission                 | `PermissionResolvable[]` | `No`     |
| myPermissions   | My Required Permissions                  | `PermissionResolvable[]` | `No`     |
| run             | Running The Command                      | `any`                    | `Yes`    |

## Run Options

| Options   | Parameter        |
| --------- | ---------------- |
| `client`  | ExtendedClient   |
| `message` | Message<boolean> |
| `args`    | string[]         |
