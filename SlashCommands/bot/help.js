const SlashCommand = require("../../Structures/Classes/SlashCommand");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  Message,
} = require("discord.js");
const {
  nicerPermissions,
} = require("../../Structures/Functions/nicerPermissions");

module.exports = new SlashCommand({
  name: "help",
  description: "Shows all the commands.",
  category: "Bot",
  options: [
    {
      name: "command",
      description: "Get this commands information.",
      type: "STRING",
      required: false,
      autocomplete: true
    },
  ],
  run: async ({ client, interaction }) => {
    const cmd = interaction.options.getString("command");

    if (!cmd) {
      const emojis = {
        bot: "🤖",
        information: "❔",
        fun: "🎈",
      }; // Command Directory Emojis

      const ignored = []; //The categories you want to ignore.
      const directories = [
        ...new Set(
          client.slashCommands
            .filter((cmd) => !ignored?.includes(cmd.directory))
            .map((cmd) => cmd.directory)
        ),
      ];

      const formattedString = (string) =>
        `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;

      const categories = directories.map((dir) => {
        const getCommands = client.slashCommands
          .filter((cmd) => cmd.directory === dir)
          .map((cmd) => {
            return {
              name: cmd.name || "No Command Name.",
              description: cmd.description || "No Command Description.",
            };
          });

        return {
          directory: formattedString(dir),
          commands: getCommands,
        };
      });

      const initEmbed = new MessageEmbed()
        .setTitle("Help Command")
        .setDescription("```Please Choose a Command Category Below.```")
        .setColor("RANDOM");

      const homePanel = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("home")
          .setDisabled(true)
          .setEmoji("📄")
          .setLabel("Home")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("all-commands")
          .setDisabled(false)
          .setEmoji("📜")
          .setLabel("All Commands")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      );

      const allCommandsPanel = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("home")
          .setDisabled(false)
          .setEmoji("📄")
          .setLabel("Home")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("all-commands")
          .setDisabled(true)
          .setEmoji("📜")
          .setLabel("All Commands")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      );

      const allEnabledPanel = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("home")
          .setDisabled(false)
          .setEmoji("📄")
          .setLabel("Home")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("all-commands")
          .setDisabled(false)
          .setEmoji("📜")
          .setLabel("All Commands")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      );

      const selectPanel = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setDisabled(false)
          .setPlaceholder("📬 Choose a category here")
          .setOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands From ${cmd.directory}`,
                emoji: emojis[cmd.directory.toLowerCase()] || null,
              };
            })
          )
      );

      const filter = (i) => {
        if (i.user.id === interaction.user.id) return true;
        else
          return void i.reply({
            content: "This help menu is not for you.",
            ephemeral: true,
          });
      };

      /**
       * @type {Message}
       */
      let initMessage = await interaction.reply({
        embeds: [initEmbed],
        components: [homePanel, selectPanel],
        fetchReply: true,
      });

      const collector = initMessage.createMessageComponentCollector({
        filter,
      });

      collector.on("collect", (i) => {
        if (i.isSelectMenu()) {
          if (i.customId === "help-menu") {
            const [directory] = i.values;
            const category = categories.find(
              (x) => x.directory.toLowerCase() === directory
            );

            const updateEmbed = new MessageEmbed()
              .setTitle(`Commands from ${category.directory}`)
              .addFields(
                category.commands.map((cmd) => {
                  return {
                    name: `\`${cmd.name}\``,
                    value: `${cmd.description}`,
                    inline: true,
                  };
                })
              )
              .setColor("RANDOM")
              .setTimestamp();

            i.update({
              embeds: [updateEmbed],
              components: [allEnabledPanel, selectPanel],
            });
          }
        }

        if (i.isButton()) {
          if (i.customId === "delete") {
            interaction.deleteReply();
          }

          if (i.customId === "all-commands") {
            const commands = categories.map((cmd) => {
              const dirEmojis = emojis[cmd.directory.toLowerCase()] || "";
              return {
                name: `${dirEmojis} ${cmd.directory}`,
                value: `${cmd.commands
                  .map((cmd) => `\`${cmd.name}\``)
                  .join(", ")}`,
                inline: false,
              };
            });

            const all = new MessageEmbed()
              .setDescription(
                `Need Help?, use \`/help\` and select from the dropdown menu, for more command information use \`/help <command>\``
              )
              .addFields(commands)
              .setColor("RANDOM");
            i.update({
              embeds: [all],
              components: [allCommandsPanel, selectPanel],
            });
          }
        }

        if (i.customId === "home") {
          i.update({
            embeds: [initEmbed],
            components: [homePanel, selectPanel],
          });
        }
      });
    } else {
      const command = client.slashCommands.get(cmd);

      if (!command)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Command")
              .setDescription(
                `That command does not exist, use \`/help\` to get all the valid commands.`
              )
              .setColor("RED"),
          ],
        });

      const deleteButton = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      );

      const commandInformation = new MessageEmbed()
        .setTitle(`${command.name.toUpperCase()} INFORMATION`)
        .addFields(
          {
            name: "Command Name:",
            value: `\`\`\`${command.name ? command.name : "No Name"}\`\`\``,
          },
          {
            name: "Command Description:",
            value: `\`\`\`${
              command.description ? command.description : "No Description"
            }\`\`\``,
          },
          {
            name: "Command Category:",
            value: `\`\`\`${
              command.category ? command.category : "No Category"
            }\`\`\``,
          },
          {
            name: "Command Example:",
            value: `\`\`\`${
              command.examples ? command.examples.join(" / ") : "No Examples"
            }\`\`\``,
          },
          {
            name: "Developer Command",
            value: `\`\`\`${command.developerCommand ? "Yes" : "No"}\`\`\``,
          },
          {
            name: "Guild Only Command",
            value: `\`\`\`${command.guildCommand ? "Yes" : "No"}\`\`\``,
          },
          {
            name: "Nsfw Command",
            value: `\`\`\`${command.nsfwCommand ? "Yes" : "No"}\`\`\``,
            inline: true,
          },
          {
            name: "Owner Command",
            value: `\`\`\`${command.guildOwnerCommand ? "Yes" : "No"}\`\`\``,
            inline: true,
          },
          {
            name: "Admin Command",
            value: `\`\`\`${command.adminCommand ? "Yes" : "No"}\`\`\``,
            inline: true,
          },
          {
            name: "Permissions Needed (User)",
            value: `\`\`\`${
              command.userPermissions
                ? command.userPermissions.map((perm) =>
                    nicerPermissions(perm.toString())
                  )
                : "No permissions needed"
            }\`\`\``,
            inline: true,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: true,
          },
          {
            name: "Permissions Needed (Me)",
            value: `\`\`\`${
              command.myPermissions
                ? command.myPermissions.map((perm) =>
                    nicerPermissions(perm.toString())
                  )
                : "No permissions needed"
            }\`\`\``,
            inline: true,
          }
        )
        .setFooter({
          iconURL: client.user.displayAvatarURL(),
          text: `${client.user.username}`,
        });
      /**
       * @type {Message}
       */
      const msg = await interaction.reply({
        embeds: [commandInformation],
        components: [deleteButton],
        fetchReply: true,
      });

      const filter = (i) => {
        if (i.user.id === interaction.user.id) return true;
        else
          return void i.reply({
            content: "This help menu is not for you.",
            ephemeral: true,
          });
      };
      const collector = msg.createMessageComponentCollector({
        filter,
        componentType: "BUTTON",
      });

      collector.on("collect", (i) => {
        if (i.customId === "delete") {
          interaction.deleteReply();
        }
      });
    }
  },
});
