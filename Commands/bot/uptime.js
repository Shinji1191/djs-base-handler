const Command = require("../../Structures/Classes/Command");
const os = require("os");
const ms = require("parse-ms");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  name: "uptime",
  description: "Shows the bots uptime",
  category: "Bot",
  aliases: ["up"],
  permissions: {
    me: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
  },
  async run({ client, message }) {
    const systemUptime = ms(os.uptime() * 1000)
    const botUptime = ms(client.uptime)

    const embed = new MessageEmbed()
      .setTitle("Uptime")
      .setDescription(`
      **Bot Uptime:** \`${botUptime.days} days, ${botUptime.hours} hours, ${botUptime.minutes} minutes, ${botUptime.seconds} seconds\`
      **System Uptime:** \`${systemUptime.days} days, ${systemUptime.hours} hours, ${systemUptime.minutes} minutes, ${systemUptime.seconds} seconds\`
      `)
      .setColor("RANDOM")
      .setThumbnail("https://i.pinimg.com/originals/be/65/92/be659217688a62f8800ffc5df8e893b6.gif")
    message.reply({ embeds: [embed] })
  }
})