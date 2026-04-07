import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumeParserScript = path.resolve(
  __dirname,
  "../../../ml_models/resume-parser/parse_cli.py"
);

export const runResumeParser = (resumeSource) => {
  const command = process.env.PYTHON_BIN || "python3";

  const result = spawnSync(command, [resumeParserScript, resumeSource], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  const output = (result.stdout || "").trim();

  if (!output) {
    throw new Error(result.stderr?.trim() || "No output from parser");
  }

  const parsed = JSON.parse(output);

  if (parsed?.error) {
    throw new Error(parsed.error);
  }

  return parsed;
};