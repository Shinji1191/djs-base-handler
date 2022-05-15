[![MasterHead](https://discord.js.org/static/logo.svg)](https://repository-images.githubusercontent.com/40484398/e305e980-cb80-11eb-9bb9-c5d3ec013658)

<h1 align="center">Discord.js V.13 Template This is a advanced djs template</h1>

## Installing packages and run your bot:

- Installing all packages: use `npm i` to install all packages
- Running the bot do `node .` in the terminal

## Setting Up:

- Structures/Config/config.js

```js
module.exports.config = {
  token: "Bot Token Here",
  prefix: "!",
  mongooseConnectionString: "",
  developerIDs: ["Your Id Here"], // You can add more by doing: ["", "", ""]
  guildIDs: ["Server Id Here"], // You can add more by doing: ["", "", ""]
};
```

- Structures/Client: line 118 - Server Only Commands

```js
this.client.on("ready", async () => {
  console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ CLient ]`));
  await this.registerCommands({
    commands: slashCommands,
    // guildId: "Replace this with server ID"
  });
});
```

- Structures/Utils/ErrorHandler - Anti Crash System

```js
const channelID = "Channel ID"; // Channel to send the error
```

## Developers:

| Owner                | recon#8448                                             |
| -------------------- | ------------------------------------------------------ |
| **Modified By**      | Ｔｒａｓｈ#6969 aka Me                                 |
| **Handler Modified** | [Handler](https://github.com/reconlx/djs-base-handler) |
| **Reconlx Server**   | [Server](https://discord.gg/uQAJqGRfpU)                |
| **My Server**        | Coming Soon                                            |

## Tip

- Read the templates before making a command or event

## Errors:

- DM me if there are errors with the handler.
