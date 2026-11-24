import { spawn } from "node:child_process";

const [mode = "dev", ...args] = process.argv.slice(2);
const nextCommand = mode === "start" ? "start" : "dev";

let port = process.env.PORT || "3000";
let host = "0.0.0.0";

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith("--port=")) {
    port = arg.split("=")[1] || port;
  } else if ((arg === "-p" || arg === "--port") && args[i + 1]) {
    port = args[i + 1];
    i++;
  } else if (arg.startsWith("--host=")) {
    host = arg.split("=")[1] || host;
  } else if (arg.startsWith("--hostname=")) {
    host = arg.split("=")[1] || host;
  } else if (
    (arg === "-H" || arg === "--host" || arg === "--hostname") &&
    args[i + 1]
  ) {
    host = args[i + 1];
    i++;
  }
}

const nextBin = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(nextBin, ["next", nextCommand, "-p", port, "-H", host], {
  stdio: "inherit",
  env: process.env,
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
