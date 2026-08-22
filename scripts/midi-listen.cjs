const midi = require("@julusian/midi");

const input = new midi.Input();

const ports = [];

for (let i = 0; i < input.getPortCount(); i++) {
  ports.push(input.getPortName(i));
}

console.log("Entrées MIDI disponibles :");
console.log(ports);

const montageIndex = ports.findIndex(
  (name) => name === "MONTAGE M"
);

if (montageIndex === -1) {
  console.log("MONTAGE M introuvable.");
  process.exit(1);
}

input.openPort(montageIndex);

console.log("");
console.log("Écoute de MONTAGE M...");
console.log("Appuie sur ASSIGN 1.");

input.on("message", (deltaTime, message) => {
  console.log("MIDI :", message);
});