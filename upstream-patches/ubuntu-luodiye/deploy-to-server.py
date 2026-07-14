#!/usr/bin/env python3
"""Deploy popup-template patch to live LP Admin (43.160.237.168).

Usage:
  DEPLOY_SSH_PASSWORD='your-ssh-password' python3 deploy-to-server.py
  python3 deploy-to-server.py 43.160.237.168 ubuntu 'your-ssh-password'
"""

from __future__ import annotations

import os
import sys
import tarfile
import tempfile
from pathlib import Path

try:
    import paramiko
except ImportError:
    raise SystemExit("请先安装: pip install paramiko")

HOST = os.environ.get("DEPLOY_HOST", sys.argv[1] if len(sys.argv) > 1 else "43.160.237.168")
USER = os.environ.get("DEPLOY_USER", sys.argv[2] if len(sys.argv) > 2 else "ubuntu")
PASSWORD = os.environ.get("DEPLOY_SSH_PASSWORD", sys.argv[3] if len(sys.argv) > 3 else "")

if not PASSWORD:
    raise SystemExit(
        "请提供 SSH 密码：\n"
        "  DEPLOY_SSH_PASSWORD='xxx' python3 upstream-patches/ubuntu-luodiye/deploy-to-server.py"
    )

PATCH_DIR = Path(__file__).resolve().parent
FILES = [
    "apps/admin/src/App.tsx",
    "apps/admin/src/components/Layout.tsx",
    "apps/admin/src/pages/PopupTemplatesPage.tsx",
    "apps/admin/src/styles.css",
    "apps/server/src/api/app.ts",
    "apps/server/src/api/routes/admin/popup-templates.ts",
    "packages/templates/src/index.ts",
    "packages/templates/src/popup/dana-pin.ts",
    "packages/templates/src/popup/index.ts",
    "packages/templates/src/popup/registry.ts",
    "apps/admin/public/popup-templates/dana/index.html",
    "apps/admin/public/popup-templates/dana/logo.svg",
    "apps/admin/public/popup-templates/dana/logo-white.svg",
    "README.md",
]


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tarball = Path(tmp) / "popup-patch.tgz"
        with tarfile.open(tarball, "w:gz") as tar:
            for rel in FILES:
                path = PATCH_DIR / rel
                if not path.exists():
                    raise SystemExit(f"missing {path}")
                tar.add(path, arcname=rel)

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print(f"connecting {USER}@{HOST} ...")
        ssh.connect(
            HOST,
            username=USER,
            password=PASSWORD,
            timeout=30,
            banner_timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )
        sftp = ssh.open_sftp()
        sftp.put(str(tarball), "/tmp/popup-patch.tgz")
        sftp.close()

        remote = f"""
set -euo pipefail
SRC=/opt/ubuntu-luodiye/src
test -d "$SRC"
cd "$SRC"
sudo tar -xzf /tmp/popup-patch.tgz -C "$SRC"
sudo chown -R lpadmin:lpadmin "$SRC"
PNPM=$(command -v pnpm || echo /usr/bin/pnpm)
sudo -u lpadmin bash -lc "cd $SRC && $PNPM --filter @luodiye/shared build && $PNPM --filter @luodiye/templates build"
sudo -u lpadmin bash -lc "cd $SRC/apps/admin && VITE_BASE_PATH=/admin/ VITE_API_BASE=http://{HOST} VITE_DEPLOY_TARGET=self-hosted $PNPM build:ubuntu"
sudo -u lpadmin bash -lc "cd $SRC && $PNPM --filter @luodiye/server build" || true
sudo rsync -a "$SRC/apps/admin/dist/" /opt/ubuntu-luodiye/admin/
sudo systemctl restart ubuntu-luodiye || true
sudo systemctl status ubuntu-luodiye --no-pager -l | head -25 || true
rm -f /tmp/popup-patch.tgz
echo DEPLOY_OK
""".format(HOST=HOST)

        stdin, stdout, stderr = ssh.exec_command("bash -s", timeout=900)
        stdin.write(remote)
        stdin.channel.shutdown_write()
        out = stdout.read().decode()
        err = stderr.read().decode()
        print(out)
        if err.strip():
            print(err)
        ssh.close()
        if "DEPLOY_OK" not in out:
            raise SystemExit("deploy failed")
        print(f"已更新: http://{HOST}/admin/  → 侧栏「弹窗模板管理」")


if __name__ == "__main__":
    main()
