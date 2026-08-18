#!/usr/bin/env python3
"""Point the claude-seo plugin's Playwright install at this container's
pre-installed Chromium instead of downloading one.

Only needed in sandboxed environments where outbound access to
cdn.playwright.dev is blocked by network policy but a Chromium build
already exists on disk (e.g. Claude Code on the web) under
PW_SRC (default /opt/pw-browsers). Safe to run repeatedly.
"""
import json
import os
import sys
from pathlib import Path

VENV = Path(os.environ["CLAUDE_SEO_VENV"])
PW_SRC = Path(os.environ.get("PW_SRC", "/opt/pw-browsers"))
MS = Path(os.environ["CLAUDE_SEO_MS_PLAYWRIGHT"])


def folder_name(name: str, revision: str) -> str:
    return f"{name.replace('-', '_')}-{revision}"


def find_local_dir(prefix: str) -> Path | None:
    candidates = sorted(
        (p for p in PW_SRC.glob(f"{prefix}-*") if p.is_dir()),
        key=lambda p: p.name,
    )
    return candidates[-1] if candidates else None


def wire_full_chromium(target: Path, source: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    linux64 = target / "chrome-linux64"
    linux_flat = source / "chrome-linux"
    src_dir = linux_flat if linux_flat.is_dir() else source
    if linux64.is_symlink() or linux64.exists():
        linux64.unlink()
    linux64.symlink_to(src_dir)
    (target / "INSTALLATION_COMPLETE").touch()
    (target / "DEPENDENCIES_VALIDATED").touch()


def wire_headless_shell(target: Path, source: Path) -> None:
    inner = target / "chrome-headless-shell-linux64"
    inner.mkdir(parents=True, exist_ok=True)
    src_dir = source / "chrome-linux" if (source / "chrome-linux").is_dir() else source
    for item in src_dir.iterdir():
        dest = inner / item.name
        if dest.is_symlink() or dest.exists():
            dest.unlink()
        dest.symlink_to(item)
    exe = inner / "chrome-headless-shell"
    if not exe.exists() and not exe.is_symlink():
        legacy = src_dir / "headless_shell"
        if legacy.exists():
            exe.symlink_to(legacy)
    (target / "INSTALLATION_COMPLETE").touch()
    (target / "DEPENDENCIES_VALIDATED").touch()


def wire_ffmpeg(target: Path, source: Path) -> None:
    if target.is_symlink() or target.exists():
        return
    target.symlink_to(source)


def main() -> int:
    browsers_json = VENV / "lib" / "python3.11" / "site-packages" / "playwright" / "driver" / "package" / "browsers.json"
    if not browsers_json.is_file():
        print(f"wire-seo-chromium: {browsers_json} not found; skipping", file=sys.stderr)
        return 0

    data = json.loads(browsers_json.read_text())
    wanted = {b["name"]: b["revision"] for b in data["browsers"]}
    MS.mkdir(parents=True, exist_ok=True)

    ok = True
    for name, local_prefix, wire_fn in (
        ("chromium", "chromium", wire_full_chromium),
        ("chromium-headless-shell", "chromium_headless_shell", wire_headless_shell),
        ("ffmpeg", "ffmpeg", wire_ffmpeg),
    ):
        revision = wanted.get(name)
        if not revision:
            continue
        target = MS / folder_name(name, revision)
        if target.exists() or target.is_symlink():
            continue  # already wired for this revision
        source = find_local_dir(local_prefix)
        if source is None:
            print(f"wire-seo-chromium: no local build for {name} under {PW_SRC}; skipping", file=sys.stderr)
            ok = False
            continue
        wire_fn(target, source)
        print(f"wire-seo-chromium: wired {name} ({revision}) -> {source}")

    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
