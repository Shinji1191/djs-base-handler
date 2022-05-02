const { default: chalk } = require("chalk");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const Event = require("../Classes/Event");
const ExtendedClient = require("../Client");

module.exports = class requireEvents {
  /**
   * Requires all the legacy commands
   * @param {ExtendedClient} client
   */
  constructor(client) {
    this.client = client;
  }

  async getEvents() {
    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Events ]`));
    let eventFile = await globPromise(`${__dirname}/../../Events/**/*.js`);
    eventFile.map(async (filePath) => {
      /**
       * @type {Event<keyof import("discord.js").ClientEvents>}
       */
      let file = require(filePath);

      if (file.event) {
        this.client.on(file.event, file.run.bind(null, this.client));

        console.log(`[ ${chalk.green.bold("EVENTS")} ] Loaded: ${file.event}`);
      } else
        console.log(`[ ${chalk.red.bold("EVENTS")} ] Failed: ${file.event}`);
    });
  }
};
