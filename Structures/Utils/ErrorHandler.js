const { default: chalk } = require("chalk");
const { MessageEmbed } = require("discord.js");
const ExtendedClient = require("../Client");

/**
 * Error Handling or Anticrash
 * @param {ExtendedClient} client
 */
module.exports = (client) => {
  const channelID = "Channel ID" // Channel to send the error

  process.on("multipleResolves", (type, promise, value) => {
    const channel = client.channels.cache.get(channelID)

    if (!channel || channel.type !== "GUILD_TEXT") return

    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Error Handling ]`));
    console.log(type, promise, value);

    const multipleResolvesEmbed = new MessageEmbed()
      .setTitle("Multiple Resolves")
      .addFields(
        {
          name: "Type",
          value: `\`\`\`${type}\`\`\``,
        },
        {
          name: "Promise",
          value: `\`\`\`${promise}\`\`\``,
        },
        {
          name: "Value",
          value: `\`\`\`${value}\`\`\``,
        }
      )
      .setColor("RED");
    channel.send({ embeds: [multipleResolvesEmbed] });
  });

  process.on("uncaughtException", (error, origin) => {
    const channel = client.channels.cache.get(channelID)

    if (!channel || channel.type !== "GUILD_TEXT") return

    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Error Handling ]`));
    console.log(error, origin);

    const uncaughtExceptionEmbed = new MessageEmbed()
      .setTitle("Uncaught Exception")
      .addFields(
        {
          name: "Error",
          value: `\`\`\`${error}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`${origin}\`\`\``,
        }
      )
      .setColor("RED");
    channel.send({ embeds: [uncaughtExceptionEmbed] });
  });

  process.on("uncaughtExceptionMonitor", (error, origin) => {
    const channel = client.channels.cache.get(channelID)

    if (!channel || channel.type !== "GUILD_TEXT") return

    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Error Handling ]`));
    console.log(error, origin);

    const uncaughtExceptionEmbed = new MessageEmbed()
      .setTitle("Uncaught Exception Monitor")
      .addFields(
        {
          name: "Error",
          value: `\`\`\`${error}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`${origin}\`\`\``,
        }
      )
      .setColor("RED");
    channel.send({ embeds: [uncaughtExceptionEmbed] });
  });

  process.on("unhandledRejection", (reason, promise) => {
    const channel = client.channels.cache.get(channelID)

    if (!channel || channel.type !== "GUILD_TEXT") return

    console.log(chalk.white.bold(`━━━━━━━━━━━━━━━━━━━━━[ Error Handling ]`));
    console.log(reason, promise);

    const uncaughtExceptionEmbed = new MessageEmbed()
      .setTitle("Unhandled Rejection")
      .addFields(
        {
          name: "Reason",
          value: `\`\`\`${reason}\`\`\``,
        },
        {
          name: "Promise",
          value: `\`\`\`${promise}\`\`\``,
        }
      )
      .setColor("RED");
    channel.send({ embeds: [uncaughtExceptionEmbed] });
  });
};
