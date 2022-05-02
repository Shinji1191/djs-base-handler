const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require("../../Structures/Classes/Command");

module.exports = new Command({
  name: "nitro",
  description: "FREE NITROOO!!!",
  category: "fun",

  aliases: ["freenitro"],
  run: async ({ message }) => {
    const nitro = new MessageEmbed()
      .setTitle("You've been gifted a subscription!")
      .setThumbnail(
        "https://static.roundme.com/upload/user/d30750eda6c30bba9295ad629961420555c05496.png"
      ).setDescription(`
      You've been gifted Nitro for **1 Month!**
      Expires in **48 hours**

      [**Disclaimer**](https://www.youtube.com/watch?v=o-YBDTqX_ZU)
      `);

    const row = (state) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("clicked")
          .setDisabled(state)
          .setLabel("Claim")
          .setStyle("SUCCESS")
      ),
    ];

    const msg = await message.reply({
      embeds: [nitro],
      components: row(false),
    });

    const filter = (interaction) => {
      if (interaction.user.id === message.author.id) return true;
      else
        return void interaction.reply({
          content: "This is not for you!",
          ephemeral: true,
        });
    };

    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      filter,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "clicked") {
        msg.edit({ content: "https://imgur.com/NQinKJB", embeds: [], components: [] });
      }
    });
  },
});
