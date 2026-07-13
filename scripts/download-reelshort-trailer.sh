#!/usr/bin/env bash
# 自动下载 ReelShort 预告片：Caged by His Twisted Love Trailer

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "${SCRIPT_DIR}/download-reelshort-trailer.py" "$@"
