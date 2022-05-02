module.exports = class SlashCommand {
  /**
   * @param {import("../Typescript/SlashCommand").SlashCommandType} options
   */
  constructor(options) {
    Object.assign(this, options)
  }
}
