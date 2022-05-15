const { Client, Collection } = require("discord.js");
const { colors } = require("./Config/colors");
const { config } = require("./Config/config");
const { GatewayIntentBits } = require("discord-api-types/gateway/v9");

const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { default: chalk } = require("chalk");
const Event = require("./Classes/Event");

module.exports = class ExtendedClient extends Client {
  /** @type {Collection<string, import("./Typescript/Command").CommandType>} */
  commands = new Collection();
  /** @type {Collection<string, string>} */
  aliases = new Collection();
  /** @type {Collection<string, import("./Typescript/SlashCommand").SlashCommandType | import("./Typescript/Context").contextType>} */
  slashCommands = new Collection();
  config = config;
  colors = colors;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
      ],
      allowedMentions: {
        repliedUser: false,
      },
    });
  }

  async start() {
    this.login(this.config.token);
    await this.loadFiles()
    require("./Utils/ErrorHandler")(this)
  }

    /**
   * @param {{ commands: import("discord.js").ApplicationCommandDataResolvable[], guildId: string }}
   */
     async registerCommands({ commands, guildId }) {
      if (guildId) {
        this.guilds.cache.get(guildId)?.commands.set(commands);
        console.log(
          `[ ${chalk.green.bold("CLIENT")} ] Loaded Slash Commands To: ${
            this.guilds.cache.get(guildId).name
          }`
        );
      } else {
        this.application?.commands.set(commands);
        console.log(
          `[ ${chalk.green.bold("CLIENT")} ] Loaded Slash Commands Globally`
        );
      }
    }

  async loadFiles() {
    let commandFiles = await globPromise(`${__dirname}/../Commands/**/*.js`);
    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Commands ]`));
    commandFiles.map(async (filePath) => {
      /**
       * @type {import("./Typescript/Command").CommandType}
       */
      let file = await require(filePath);
      let splitted = filePath.split("/");
      let directory = splitted[splitted.length - 2];

      if (file.name) {
        const properties = { directory, ...file };
        this.commands.set(file.name, properties);

        console.log(`[ ${chalk.green.bold("COMMANDS")} ] Loaded: ${file.name}`);
      } else
        console.log(`[ ${chalk.red.bold("COMMANDS")} ] Failed: ${file.name}`);

      if (file.aliases && Array.isArray(file.aliases))
        file.aliases.forEach((alias) => {
          this.aliases.set(alias, file.name);
        });
    });

    /**
     * @type {import("discord.js").ApplicationCommandDataResolvable[]}
     */
    let slashCommands = [];
    let slashCommandFiles = await globPromise(
      `${__dirname}/../SlashCommands/**/*.js`
      );
      console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Slash Commands ]`));
    slashCommandFiles.map(async (filePath) => {
      /**
       * @type {import("./Typescript/SlashCommand").SlashCommandType}
       */
      let file = await require(filePath);
      let splitted = filePath.split("/")
      let directory = splitted[splitted.length - 2]

      if (!file?.name)
        console.log(`[ ${chalk.green.bold("COMMANDS")} ] Failed: Missing`);
      if (file.name) {
        let properties = { directory, ...file }
        this.slashCommands.set(file.name, properties);
        console.log(`[ ${chalk.green.bold("COMMANDS")} ] Loaded: ${file.name}`);
        slashCommands.push(file);
      }
    });

    this.on("ready", async () => {
      console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ CLient ]`));
      await this.registerCommands({
        commands: slashCommands,
        // guildId: " Replace this with your server ID"
      });
    });

    let eventFile = await globPromise(`${__dirname}/../Events/**/*.js`);
    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Events ]`));
    eventFile.map(async (filePath) => {
      /**
       * @type {Event<keyof import("discord.js").ClientEvents>}
       */
      let file = require(filePath);

      if (file.event) {
        this.on(file.event, file.run.bind(null, this));

        console.log(`[ ${chalk.green.bold("EVENTS")} ] Loaded: ${file.event}`);
      } else
        console.log(`[ ${chalk.red.bold("EVENTS")} ] Failed: ${file.event}`);
    });
  }
}