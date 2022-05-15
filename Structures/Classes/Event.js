const ExtendedClient = require("../Client");

/**
 * @template {keyof import("discord.js").ClientEvents} Key
 */
module.exports = class Event {
  /**
   * @param {{ event: Key, run: (client: ExtendedClient, ...args: import("discord.js").ClientEvents[Key]) => any}}
   */
  constructor({ event, run }) {
    this.event = event;
    this.run = run;
  }
};
