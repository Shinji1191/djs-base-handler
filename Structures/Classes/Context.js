module.exports = class ContextCommand {
  /**
   * @param {import("../Typescript/Context").contextType} options
   */
  constructor(options) {
    Object.assign(this, options)
  }
};
