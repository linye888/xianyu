#!/usr/bin/env python3
"""自动下载 ReelShort 预告片：Caged by His Twisted Love Trailer"""

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.request import Request, urlopen

EPISODE_URL = (
    "https://www.reelshort.com/episodes/"
    "trailer-caged-by-his-twisted-love-6a18bf73a88aedd7ff0e368b-07bham7wqh"
    "?play_time=1"
)
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "downloads"
OUTPUT_FILE = "Trailer - Caged by His Twisted Love.mp4"


def fetch_page(url: str) -> str:
    request = Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def extract_m3u8_url(html: str) -> str:
    next_data_match = re.search(
        r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>',
        html,
        re.DOTALL,
    )
    if next_data_match:
        data = json.loads(next_data_match.group(1))
        video_url = data["props"]["pageProps"]["data"]["video_url"]
        if video_url:
            return video_url

    content_url_match = re.search(r'"contentUrl":"([^"]+\.m3u8)"', html)
    if content_url_match:
        return content_url_match.group(1)

    raise RuntimeError("未在页面中找到 .m3u8 视频地址")


def download_with_ffmpeg(m3u8_url: str, output_path: Path) -> None:
    if shutil.which("ffmpeg") is None:
        raise RuntimeError("未找到 ffmpeg，请先安装：https://ffmpeg.org/download.html")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg",
        "-y",
        "-headers",
        "Referer: https://www.reelshort.com/\r\nUser-Agent: Mozilla/5.0\r\n",
        "-i",
        m3u8_url,
        "-c",
        "copy",
        "-bsf:a",
        "aac_adtstoasc",
        str(output_path),
    ]
    subprocess.run(command, check=True)


def main() -> int:
    print("ReelShort 预告片自动下载")
    print(f"页面: {EPISODE_URL}")

    try:
        html = fetch_page(EPISODE_URL)
        m3u8_url = extract_m3u8_url(html)
        output_path = OUTPUT_DIR / OUTPUT_FILE

        print(f"视频流: {m3u8_url}")
        print(f"保存到: {output_path}")
        print("正在下载...")

        download_with_ffmpeg(m3u8_url, output_path)

        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"下载完成: {output_path}")
        print(f"文件大小: {size_mb:.1f} MB")
        return 0
    except Exception as error:
        print(f"下载失败: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
