const fs = require("fs");
const path = require("path");

const inputPath = path.resolve(process.cwd(), process.argv[2] || ".env.local");
const outputPath = path.resolve(process.cwd(), process.argv[3] || "public/js/env.js");
const REQUIRED_KEYS = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];

function parseEnv(content) {
  return content.split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return env;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return env;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (value.endsWith(";")) {
      value = value.slice(0, -1).trim();
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
    return env;
  }, {});
}

if (!fs.existsSync(inputPath)) {
  throw new Error(`Missing env file: ${path.relative(process.cwd(), inputPath)}`);
}

const env = parseEnv(fs.readFileSync(inputPath, "utf8"));
const missingKeys = REQUIRED_KEYS.filter((key) => !env[key]);

if (missingKeys.length) {
  throw new Error(`Missing required keys: ${missingKeys.join(", ")}`);
}

const publicEnv = {
  SUPABASE_URL: env.SUPABASE_URL,
  SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `window.__ENV__ = ${JSON.stringify(publicEnv, null, 2)};\n`,
  "utf8",
);

console.log(
  `Generated ${path.relative(process.cwd(), outputPath)} from ${path.relative(process.cwd(), inputPath)}`,
);