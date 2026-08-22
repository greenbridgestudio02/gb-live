const easymidi = require("easymidi");

try {
  const outputs = easymidi.getOutputs();

  process.stdout.write(
    JSON.stringify({
      ok: true,
      outputs,
    })
  );
} catch (error) {
  process.stdout.write(
    JSON.stringify({
      ok: false,
      outputs: [],
      error:
        error instanceof Error
          ? error.message
          : String(error),
    })
  );

  process.exitCode = 1;
}