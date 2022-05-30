const Command = require("../../Structures/Classes/Command");
const { MessageEmbed } = require("discord.js");
const parse = require("parse-ms");
const os = require("os");

module.exports = new Command({
  name: "ping",
  description: "Shows the bots websocket ping, message edit ping, and uptime.",
  category: "Bot",
  permissions: {
    me: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
  },
  run: async ({ client, message }) => {
    let circles = {
      good: "🟢",
      okay: "🟡",
      bad: "🔴",
    };

    const pinging = await message.channel.send({ content: "Pinging" });

    const ws = client.ws.ping;
    const msgEdit = Date.now() - pinging.createdTimestamp;

    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    let systemUptime = parse(os.uptime() * 1000)

    const wsEmoji =
      ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
    const msgEmoji =
      msgEdit <= 100
        ? circles.good
        : msgEdit <= 200
        ? circles.okay
        : circles.bad;

    const pingEmbed = new MessageEmbed()
      .setTitle("Pong 🏓")
      .addFields(
        {
          name: "Websocket Ping",
          value: `${wsEmoji}\`${ws}ms\``,
        },
        {
          name: "Message Edit Ping",
          value: `${msgEmoji}\`${msgEdit}ms\``,
        },
        {
          name: "Bot Uptime",
          value: `⌚\`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``,
        },
        {
          name: "System Uptime",
          value: `⌚\`${systemUptime.days} days, ${systemUptime.hours} hours, ${systemUptime.minutes} minutes, ${systemUptime.seconds} seconds\``,
        }
      )
      .setColor("RANDOM");
    pinging.edit({ embeds: [pingEmbed], content: "\u200b" });
  }
})