const easymidi = require("easymidi");
const fs = require("node:fs");
const path = require("node:path");

const inputName = "MONTAGE M";
const outputName = "MONTAGE M";
const triggerFile = path.join(
  process.cwd(),
  "data",
  "midi-trigger.json"
);

const commandFile = path.join(
  process.cwd(),
  "data",
  "midi-command.json"
);

const inputs = easymidi.getInputs();

console.log("Entrées MIDI détectées :", inputs);

if (!inputs.includes(inputName)) {
  console.error(
    `Entrée MIDI introuvable : ${inputName}`
  );
  process.exit(1);
}

const input = new easymidi.Input(inputName);
const outputs = easymidi.getOutputs();

if (!outputs.includes(outputName)) {
  console.error(
    `Sortie MIDI introuvable : ${outputName}`
  );
  input.close();
  process.exit(1);
}

const output = new easymidi.Output(outputName);

console.log("Écoute MIDI active :", inputName);
console.log("Mode diagnostic : tous les CC seront affichés");
console.log("ASSIGN 1 attendu = CC 86 / valeur 127");

input.on("cc", (message) => {
  

  
    if (
  message.channel === 0 &&
  message.controller === 86
) {
    const event = {
      type: "play",
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

  if (
  message.channel === 0 &&
  message.controller === 87
) {
  const event = {
    type: "pause",
    controller: 87,
    value: 127,
    timestamp: Date.now(),
  };

  fs.writeFileSync(
    triggerFile,
    JSON.stringify(event, null, 2),
    "utf8"
  );

  console.log(
    "ASSIGN 2 → PAUSE GB Live",
    event.timestamp
  );
}
});

let lastCommandTimestamp = 0;

setInterval(() => {
  try {
    if (!fs.existsSync(commandFile)) {
      return;
    }

    const command = JSON.parse(
      fs.readFileSync(commandFile, "utf8")
    );

    if (
      command.type !== "program-change" ||
      typeof command.timestamp !== "number" ||
      command.timestamp <= lastCommandTimestamp
    ) {
      return;
    }

    lastCommandTimestamp = command.timestamp;

    const channel = command.channel - 1;

    output.send("cc", {
      controller: 0,
      value: command.msb,
      channel,
    });

    output.send("cc", {
      controller: 32,
      value: command.lsb,
      channel,
    });

    output.send("program", {
      number: command.program,
      channel,
    });

    console.log(
      "GB Live → MONTAGE",
      command.msb,
      command.lsb,
      command.program
    );
  } catch {
    // Le fichier peut être en cours d'écriture.
  }
}, 10);

process.on("SIGINT", () => {
  input.close();
  output.close();
  process.exit(0);
});