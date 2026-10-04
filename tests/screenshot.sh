#!/usr/bin/env bash
# Chụp trang ở 3 kích thước màn hình (và một bản tắt JS) để kiểm tra responsive bằng mắt.
# Chrome headless có bề rộng cửa sổ tối thiểu (~500px) và bỏ qua cờ tắt JS, nên mỗi ảnh
# được render qua một trang bọc (wrapper) chứa iframe đúng kích thước; bản nojs dùng
# iframe sandbox="allow-same-origin" (không có allow-scripts nên JS bị tắt).
# Ảnh nào không tạo ra thì báo "FAILED" ra stderr và script thoát với mã khác 0.
# Dùng: bash tests/screenshot.sh [thư-mục-xuất]   (mặc định ./screenshots, đã gitignore)
# Kết quả: page-375, page-768, page-1280, page-1280-nojs (.png)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/screenshots}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
URL="file://${ROOT// /%20}/index.html"

mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"
FAILED=0

wrap() { # $1 = tên, $2 = rộng iframe, $3 = cao iframe, $4 = thuộc tính iframe thêm (tuỳ chọn); in ra URL file://
  local file="$OUT/.wrap-$1.html"
  printf '<!doctype html><body style="margin:0"><iframe %s src="%s" style="border:0;width:%spx;height:%spx;display:block"></iframe>\n' \
    "${4:-}" "$URL" "$2" "$3" > "$file"
  echo "file://${file// /%20}"
}

shoot() { # $1 = tên, $2 = cửa sổ rộng,cao, $3 = URL cần chụp
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="$2" --screenshot="$OUT/$1.png" "$3" >/dev/null 2>&1 || true
  if [ -s "$OUT/$1.png" ]; then echo "$OUT/$1.png"; else echo "FAILED: $1" >&2; FAILED=1; fi
}

rm -f "$OUT/page-375.png" "$OUT/page-768.png" "$OUT/page-1280.png" "$OUT/page-1280-nojs.png"
shoot page-375 600,6000 "$(wrap page-375 375 6000)"
shoot page-768 768,5000 "$(wrap page-768 768 5000)"
shoot page-1280 1280,3600 "$(wrap page-1280 1280 3600)"
shoot page-1280-nojs 1280,3600 "$(wrap page-1280-nojs 1280 3600 'sandbox="allow-same-origin"')"

rm -f "$OUT"/.wrap-*.html
exit "$FAILED"
