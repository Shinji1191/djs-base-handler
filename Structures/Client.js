const { Client, Collection } = require("discord.js");
const { colors } = require("./Config/colors");
const { config } = require("./Config/config");
const { GatewayIntentBits } = require("discord-api-types/gateway/v9");
const requireCommands = require("./Utils/Command");
const requireSlashCommands = require("./Utils/SlashCommands");
const requireEvents = require("./Utils/Events");

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
    await new requireCommands(this).getCommands();
    await new requireSlashCommands(this).getSlashCommands();
    await new requireEvents(this).getEvents();
    require("./Utils/ErrorHandler")(this)
  }
}