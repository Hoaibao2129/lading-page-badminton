# 🏸 Vợt Cầu Lông

Landing page tĩnh giới thiệu một số dòng vợt cầu lông. HTML/CSS thuần, không cần cài đặt hay build.

## Chạy thử

Double-click `index.html` là xong.

## Cấu trúc

```
index.html        # toàn bộ nội dung
css/style.css     # giao diện; đổi màu ở các biến trong :root
js/gallery.js     # nút ◀ ▶ của gallery (không có cũng chạy)
images/           # hero.webp + mỗi vợt một folder vot-N/
tests/            # test tự động + script chụp màn hình
```

## Thêm một cây vợt

1. Trong `index.html`, copy khối từ `VỢT 1: copy từ dòng này` tới `VỢT 1: copy tới dòng này`, dán ngay sau section cuối.
2. Đổi `vot-1` thành `vot-N` (N là số tiếp theo) ở 4 chỗ: `id`, `aria-labelledby`, `id` của thẻ `h2`, đường dẫn ảnh.
3. Thêm `<a href="#vot-N">Tên vợt</a>` vào menu `site-nav` ở đầu trang.
4. Tạo folder `images/vot-N/` rồi bỏ ảnh vào.
5. Sửa tên, mô tả, giá, thông số, ưu/nhược, link mua, link video; nhớ đổi cả tên vợt trong `aria-label` của gallery và 5 thẻ `alt` của ảnh.

Xoá vợt: xoá section và dòng menu tương ứng.

## Quy ước ảnh

- Tên file và folder **viết thường, không dấu, nối bằng gạch ngang**. Vercel phân biệt hoa/thường, macOS thì không: `Anh1.webp` chạy trên máy nhưng mất trên web.
- Mỗi vợt 3–5 ảnh, đặt tên `1.webp` … `5.webp`. Ít ảnh hơn thì xoá bớt thẻ `<figure>`.
- Ưu tiên `.webp` (hoặc `.jpg`), rộng khoảng 1200px, tỉ lệ 4:3, dưới 300KB mỗi ảnh. Có thể nén tại https://squoosh.app
- Ảnh bìa: `images/hero.webp`.
- Chưa có ảnh thì trang hiện khung xám ghi "Ảnh 1", "Ảnh 2"…

## Kiểm tra

```bash
node --test "tests/*.test.mjs"   # test cấu trúc HTML/CSS/JS (cần Node 18+)
bash tests/screenshot.sh         # chụp vào ./screenshots: page-375, page-768, page-1280 và page-1280-nojs (tắt JS)
```

## Deploy lên Vercel

1. Đẩy project lên một repo GitHub.
2. Trên https://vercel.com → **Add New… → Project** → chọn repo.
3. **Framework Preset: Other**. Để trống Build Command, Output Directory là thư mục gốc.
4. **Deploy**. Mỗi lần push lên GitHub, Vercel tự deploy lại.
5. Sau khi có tên miền, sửa `og:image` trong `index.html` thành URL đầy đủ (ví dụ `https://ten-mien.vercel.app/images/hero.webp`) để ảnh hiện khi chia sẻ link.
