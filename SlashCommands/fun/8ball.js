const SlashCommand = require("../../Structures/Classes/SlashCommand");
const { MessageEmbed } = require("discord.js");

module.exports = new SlashCommand({
  name: "8ball",
  description: "Ask the magic 8ball a question.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "question",
      description: "A question for the 8ball.",
      type: "STRING",
      required: true,
    },
  ],
  category: "Fun",
  run: async ({ interaction }) => {
    const question = interaction.options.getString("question");

    const answers = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes definitely.",
      "You may rely on it",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)]

    const embed = new MessageEmbed()
      .setTitle("8BALL")
      .setDescription(`You asked the 8ball a question and it answered:
      >>> **Question:** \`${question}\`
      **Answers:** \`${answer}\`
      `)
      .setColor("RANDOM")
    interaction.reply({ embeds: [embed] })
  },
});
