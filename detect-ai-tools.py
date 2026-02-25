#!/usr/bin/env python3
"""
Detect AI tools used in each repository by checking file/dependency indicators.

Outputs: public/data/ai-signals.json

Detection rules (no commit message parsing, no AI inference):
  File existence          → IDE / Agent
  Dep in package.json     → LLM API (Node.js)
  Dep in requirements.txt → LLM API (Python)
"""

import base64
import json
import os
import subprocess

GH_USER = "WoojinAhn"
DATA_DIR = "./public/data"

# (file_path, tool_id) — checks file or directory existence via GitHub Contents API
FILE_INDICATORS = [
    ("CLAUDE.md",                        "claude-code"),
    (".cursor",                          "cursor"),
    (".cursorignore",                    "cursor"),
    (".windsurfai",                      "windsurf"),
    (".windsurfignore",                  "windsurf"),
    (".github/copilot-instructions.md", "copilot"),
]

# (dep_file, [(package_list, tool_id), ...])
DEP_INDICATORS = {
    "package.json": [
        (["@anthropic-ai/sdk", "anthropic"], "claude-api"),
        (["openai"],                          "openai"),
        (["@google/generative-ai"],           "gemini"),
    ],
    "requirements.txt": [
        (["anthropic"],                       "claude-api"),
        (["openai"],                          "openai"),
        (["google-generativeai"],             "gemini"),
    ],
}


def gh_api(path: str):
    """Call gh CLI and return parsed JSON, or None on error (e.g. 404)."""
    result = subprocess.run(
        ["gh", "api", path],
        capture_output=True, text=True, timeout=15,
    )
    if result.returncode != 0:
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return None


def file_exists(repo: str, filepath: str) -> bool:
    return gh_api(f"repos/{GH_USER}/{repo}/contents/{filepath}") is not None


def get_file_text(repo: str, filepath: str) -> str | None:
    data = gh_api(f"repos/{GH_USER}/{repo}/contents/{filepath}")
    if not isinstance(data, dict) or "content" not in data:
        return None
    try:
        return base64.b64decode(data["content"]).decode("utf-8")
    except Exception:
        return None


def detect_tools(repo_name: str) -> list[str]:
    found: set[str] = set()

    # File existence checks (skip if tool already found)
    for filepath, tool_id in FILE_INDICATORS:
        if tool_id not in found and file_exists(repo_name, filepath):
            found.add(tool_id)

    # Dependency checks
    for dep_file, rules in DEP_INDICATORS.items():
        content = get_file_text(repo_name, dep_file)
        if content:
            for packages, tool_id in rules:
                if tool_id not in found:
                    if any(pkg in content for pkg in packages):
                        found.add(tool_id)

    return sorted(found)


def main():
    repo_names: set[str] = set()
    for filename in ("repos.json", "pinned.json"):
        path = os.path.join(DATA_DIR, filename)
        if os.path.exists(path):
            with open(path) as f:
                for r in json.load(f):
                    if not r.get("isPrivate"):
                        repo_names.add(r["name"])

    print(f"🔍 Scanning {len(repo_names)} repos for AI tool indicators...")
    signals: dict[str, list[str]] = {}
    for name in sorted(repo_names):
        print(f"  → {name}", end="", flush=True)
        tools = detect_tools(name)
        signals[name] = tools
        print(f": {', '.join(tools) if tools else '(none)'}")

    out = os.path.join(DATA_DIR, "ai-signals.json")
    with open(out, "w") as f:
        json.dump(signals, f, indent=2)
    print(f"✅ Saved {out}")


if __name__ == "__main__":
    main()
