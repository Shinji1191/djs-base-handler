## Command Template

```js
const Command = require("../../Structures/Classes/Command");

module.exports = new Command({
  name: "", // Needed
  description: "", // Needed
  category: "", // Needed
  aliases: [""], // Optional
  examples: [""], // Optional
  permissions: {}, // Optional
  config: {}, // Optional
  run: async ({}) => {}, // Needed
});
```  
## How to use the run option
```diff
- run: async (client, message, args) => {}
+ run: async ({ client, message, args }) => {}
```
