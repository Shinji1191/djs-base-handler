const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const Command = require("../Classes/Command");
const ExtendedClient = require("../Client");
const { default: chalk } = require("chalk");

module.exports = class requireCommands {
  /**
   * Requires all the legacy commands
   * @param {ExtendedClient} client
   */
  constructor(client) {
    this.client = client;
  }

  async getCommands() {
    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Commands ]`));
    let commandFiles = await globPromise(`${__dirname}/../../Commands/**/*.js`);
    commandFiles.map(async (filePath) => {
      /**
       * @type {Command}
       */
      let file = await require(filePath);
      let splitted = filePath.split("/");
      let directory = splitted[splitted.length - 2];

      if (file.name) {
        const properties = { directory, ...file };
        this.client.commands.set(file.name, properties);

        console.log(`[ ${chalk.green.bold("COMMANDS")} ] Loaded: ${file.name}`);
      } else
        console.log(`[ ${chalk.red.bold("COMMANDS")} ] Failed: ${file.name}`);

      if (file.aliases && Array.isArray(file.aliases))
        file.aliases.forEach((alias) => {
          this.client.aliases.set(alias, file.name);
        });
    });
  }
};
