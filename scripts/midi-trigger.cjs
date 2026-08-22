const easymidi = require("easymidi");
const fs = require("node:fs");
const path = require("node:path");

const inputName = "MONTAGE M";

const triggerFile = path.join(
  process.cwd(),
  "data",
  "midi-trigger.json"
);

const inputs = easymidi.getInputs();

if (!inputs.includes(inputName)) {
  console.error(
    `Entrée MIDI introuvable : ${inputName}`
  );
  process.exit(1);
}

const input = new easymidi.Input(inputName);

console.log("Écoute MIDI active :", inputName);
console.log("ASSIGN 1 = CC 86");

input.on("cc", (message) => {
    console.log("CC reçu :", message);
  if (
    message.channel === 0 &&
    message.controller === 86 &&
    message.value === 127
  ) {
    const event = {
      type: "toggle-playback",
      controller: 86,
      value: 127,
      timestamp: Date.now(),
    };

    fs.writeFileSync(
      triggerFile,
      JSON.stringify(event, null, 2),
      "utf8"
    );

    console.log(
      "ASSIGN 1 → GB Live",
      event.timestamp
    );
  }
});

process.on("SIGINT", () => {
  input.close();
  process.exit(0);
});