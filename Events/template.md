## Event Template

```js
const Event = require("../Structures/Classes/Event");

module.exports = new Event({
  event: "<event here>",
  async run (client, <event params>) {}
});
```

## Options and Description

| Command Options | Description                     | Type                | Required |
| --------------- | ------------------------------- | ------------------- | -------- |
| event           | The event you are trying to run | `ClientEvents`      | `yes`    |
| run             | The event parameters            | `ClientEvents[Key]` | `Yes`    |
