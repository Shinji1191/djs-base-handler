## Slash Command Template

```js
const SlashCommand = require("../../Structures/Classes/SlashCommand");

module.exports = new SlashCommand({
  name: "", // Needed
  description: "", // Needed
  type: "CHAT_INPUT", // Optional
  botPermissions: [], // Optional
  userPermissions: [], // Optional
  defaultPermission: false, // Optional
  options: [], // Optional
  devOnly: false, // Optional
  run: async ({}) => {}, // Needed
});
```

## Options and Description

| Command Options   | Description                                        | Type                                 | Required |
| ----------------- | -------------------------------------------------- | ------------------------------------ | -------- |
| name              | Name of the command                                | `string`                             | `Yes`    |
| description       | Description of the command                         | `string`                             | `Yes`    |
| category          | Category of the command                            | `string`                             | `Yes`    |
| developerCommand  | If the command is only for the developer           | `boolean`                            | `No`     |
| nsfwCommand       | if the command is NSFW                             | `boolean`                            | `No`     |
| adminCommand      | If the command is only for the admin of the server | `boolean`                            | `No`     |
| guildCommand      | if the command can only be used in some guilds     | `boolean`                            | `No`     |
| userPermissions   | Required User Permission                           | `PermissionResolvable[]`             | `No`     |
| myPermissions     | My Required Permissions                            | `PermissionResolvable[]`             | `No`     |
| options           | Options for the command                            | `ApplicationCommandOptionData[]`     | `No`     |
| type              | Type of the command                                | `ApplicationCommandTypes.CHAT_INPUT` | `No`     |
| defaultPermission | Role Permission Checking                           | `BaseApplicationCommandData`         | `No`     |
| run               | Running The Command                                | `any`                                | `Yes`    |

## Run Options

| Options       | Parameter                        |
| ------------- | -------------------------------- |
| `client`      | ExtendedClient                   |
| `interaction` | ExtendedInteraction              |
| `args`        | CommandInteractionOptionResolver |

## Extras

- Do not use `interaction.followUp`
