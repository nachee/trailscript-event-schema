"""Post-process datamodel-codegen output.

datamodel-codegen emits ``model_config = ConfigDict(extra="forbid")`` on
every model — including ``RootModel`` subclasses. Pydantic v2 forbids
``extra`` config on ``RootModel`` (it has only one field, ``root``), so
the generated module fails to import without this fix-up.

We strip the ``model_config = ConfigDict(...)`` block from any class that
inherits from ``RootModel[...]`` and leave ``BaseModel`` subclasses
untouched.

Usage::

    python fix_rootmodel_config.py path/to/event.py path/to/checkpoint.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# Match: `class Foo(RootModel[...]):\n    model_config = ConfigDict(\n …\n    )\n`
# Inner brackets (e.g. `Optional[TargetModel]`) require a non-greedy match
# anchored on the closing `]):` of the class header.
ROOTMODEL_CONFIG = re.compile(
    r"(class\s+\w+\(RootModel\[.+?\]\):\s*\n)"
    r"\s*model_config\s*=\s*ConfigDict\(\s*\n"
    r"(?:[^)]*\n)*?"
    r"\s*\)\s*\n",
    re.MULTILINE,
)


def fix_file(path: Path) -> bool:
    src = path.read_text()
    fixed = ROOTMODEL_CONFIG.sub(r"\1", src)
    if fixed != src:
        path.write_text(fixed)
        return True
    return False


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: fix_rootmodel_config.py FILE [FILE …]", file=sys.stderr)
        return 2
    changed = 0
    for arg in argv:
        if fix_file(Path(arg)):
            changed += 1
    print(f"fix_rootmodel_config: cleaned {changed}/{len(argv)} file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
