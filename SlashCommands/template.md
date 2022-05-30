## Slash Command Template

```js
const SlashCommand = require("../../Structures/Classes/SlashCommand");

module.exports = new SlashCommand({
  name: "", // Needed
  description: "", // Needed
  category: "", //
  config: {}, // Optional
  permissions: {}, // Optional
  run: async ({}) => {}, // Needed
});
```
## How to use the run option
```diff
- run: async (client, message, args) => {}
+ run: async ({ client, interaction, args }) => {}
```

## Extras

- Do not use `interaction.followUp`
