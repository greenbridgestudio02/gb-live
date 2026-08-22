const easymidi = require("easymidi");

function fail(message) {
  process.stdout.write(
    JSON.stringify({
      ok: false,
      error: message,
    })
  );

  process.exitCode = 1;
}

try {
  const [
    outputName,
    channelRaw,
    msbRaw,
    lsbRaw,
    programRaw,
  ] = process.argv.slice(2);

  if (
    !outputName ||
    channelRaw === undefined ||
    msbRaw === undefined ||
    lsbRaw === undefined ||
    programRaw === undefined
  ) {
    fail(
      "Arguments manquants : outputName channel msb lsb program"
    );
    return;
  }

  const channelHuman = Number.parseInt(
    channelRaw,
    10
  );

  const msb = Number.parseInt(
    msbRaw,
    10
  );

  const lsb = Number.parseInt(
    lsbRaw,
    10
  );

  const program = Number.parseInt(
    programRaw,
    10
  );

  if (
    Number.isNaN(channelHuman) ||
    channelHuman < 1 ||
    channelHuman > 16
  ) {
    fail("Canal MIDI invalide.");
    return;
  }

  if (
    Number.isNaN(msb) ||
    msb < 0 ||
    msb > 127 ||
    Number.isNaN(lsb) ||
    lsb < 0 ||
    lsb > 127 ||
    Number.isNaN(program) ||
    program < 0 ||
    program > 127
  ) {
    fail("Valeurs MIDI invalides.");
    return;
  }

  const outputs = easymidi.getOutputs();

  if (!outputs.includes(outputName)) {
    fail(
      `Sortie MIDI introuvable : ${outputName}`
    );
    return;
  }

  const output = new easymidi.Output(
    outputName
  );

  const channel = channelHuman - 1;

  output.send("cc", {
    controller: 0,
    value: msb,
    channel,
  });

  output.send("cc", {
    controller: 32,
    value: lsb,
    channel,
  });

  output.send("program", {
    number: program,
    channel,
  });

  output.close();

  process.stdout.write(
    JSON.stringify({
      ok: true,
      output: outputName,
      channel: channelHuman,
      msb,
      lsb,
      program,
    })
  );
} catch (error) {
  fail(
    error instanceof Error
      ? error.message
      : String(error)
  );
}