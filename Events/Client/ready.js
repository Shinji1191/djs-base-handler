const Event = require("../../Structures/Classes/Event");
const { default: chalk } = require("chalk");
const mongoose = require("mongoose")

module.exports = new Event({
  event: "ready",
  async run(client) {
    console.log(
      `[ ${chalk.green.bold("CLIENT")} ] Logged in as: ${client.user.tag}`
    );
  
    client.user.setActivity({
      name: `${client.config.prefix}help`,
      type: "WATCHING",
    });
  
    if (!client.config.mongooseConnectionString) return;
    mongoose
      .connect(client.config.mongooseConnectionString)
      .then(() =>
        console.log(`[ ${chalk.green.bold("DATABASE")} ] Connection: Connected`)
      )
      .catch(() =>
        console.log(`[ ${chalk.green.bold("DATABASE")} ] Connection: Error`)
      );
  }
});