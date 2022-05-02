module.exports = class Command {
  /**
   * @param {import("../Typescript/Command").CommandType} options
   */
  constructor(options) {
    Object.assign(this, options)
  }
}

