# Landing page review vợt cầu lông — Design Spec

- **Ngày:** 2026-10-04
- **Trạng thái:** Chờ duyệt

## 1. Mục tiêu

Một landing page tĩnh, giọng blog review cá nhân, giới thiệu một số vợt cầu lông (dự kiến 3–6 cây) để chia sẻ cho bạn bè/cộng đồng. Link mua có thể là link affiliate. Deploy lên Vercel.

**Tiêu chí thành công**

- Mở `index.html` trực tiếp (double-click) là chạy, không cần build/npm/server.
- Thêm hoặc sửa một vợt chỉ cần copy/sửa một khối HTML, không phải đụng tới CSS.
- Hiển thị tốt ở mobile (375px), tablet (768px), desktop (1280px).
- Trang vẫn dùng được đầy đủ khi tắt JavaScript (chỉ mất nút ◀ ▶).

**Ngoài phạm vi (YAGNI)**

Bộ lọc/phân loại, tìm kiếm, so sánh vợt, nhúng video player, dark mode, CMS hoặc file dữ liệu riêng, build tool.

## 2. Cách tiếp cận

**HTML thuần.** Mỗi vợt là một khối `<section class="racket">` trong `index.html`, có comment đánh dấu rõ chỗ cần sửa. Muốn thêm vợt thì copy nguyên khối.

Đã cân nhắc và loại:

- `data.js` + JS render: dễ lỗi cú pháp với người sửa, nội dung không có trong HTML nên preview link/SEO kém hơn.
- `data.json` + `fetch`: không chạy khi mở file trực tiếp (`file://`).

## 3. Cấu trúc thư mục

```
Just For Fun/
├── index.html          # toàn bộ nội dung trang
├── css/
│   └── style.css       # biến màu, typography, layout, responsive
├── js/
│   └── gallery.js      # nút ◀ ▶ cho gallery (progressive enhancement)
├── images/
│   ├── hero.webp       # ảnh bìa (+ dùng làm og:image)
│   ├── vot-1/          # 1.webp … 5.webp
│   ├── vot-2/
│   └── vot-3/
├── README.md           # hướng dẫn thêm vợt, quy ước ảnh, deploy Vercel
└── .gitignore
```

**Quy ước ảnh** (ghi trong README):

- Tên file và folder viết thường, không dấu, nối bằng gạch ngang. Vercel phân biệt hoa/thường, macOS thì không.
- Mỗi vợt một folder con, ảnh đánh số `1.webp` … `5.webp`.
- Ưu tiên `.webp` hoặc `.jpg`, rộng khoảng 1200px, dưới 300KB mỗi ảnh, tỉ lệ 4:3.
- Đường dẫn tương đối, ví dụ `images/vot-1/1.webp`.

Ban đầu chưa có ảnh thật. Các folder ảnh được giữ trong git bằng file `.gitkeep`.

## 4. Bố cục trang

1. **Header dính (sticky):** tên trang bên trái, menu anchor tới từng vợt (`#vot-1`, …). Trên mobile, menu xuống dòng dưới logo thành một dải cuộn ngang (không dùng hamburger, không cần JS).
2. **Hero:** tiêu đề lớn, 1–2 câu giới thiệu, ảnh `images/hero.webp`.
3. **Các section vợt:** 3 section mẫu với nội dung placeholder, nền xen kẽ trắng và xám nhạt.
4. **Footer:** ghi chú "giá tham khảo tại thời điểm viết", dòng công khai link affiliate, năm.

## 5. Section vợt

Thứ tự nội dung:

1. **Tên vợt** (`h2`) + một dòng mô tả ngắn.
2. **Gallery:** 3–5 ảnh trong một hàng cuộn ngang, dùng `scroll-snap-type: x mandatory`. Mỗi ảnh có `aspect-ratio: 4/3`, `object-fit: cover`, `loading="lazy"`, `alt` mô tả.
3. **Giá:** số to, màu chính, kèm chữ nhỏ "giá tham khảo".
4. **Thông số:** các ô cho trọng lượng (3U/4U), điểm cân bằng, độ cứng thân, sức căng tối đa. Thông số nào không dùng thì xoá ô đó.
5. **Ưu điểm** (✓ xanh) và **Nhược điểm** (✕ cam đỏ), mỗi bên là một danh sách `ul`.
6. **Hai nút:**
   - "🛒 Xem giá / Mua": nút chính, `target="_blank" rel="sponsored noopener"`.
   - "▶ Xem video review": nút phụ, `target="_blank" rel="noopener"`.

**Ảnh placeholder:** khi chưa có ảnh, mỗi slide hiển thị khung xám có chữ "Ảnh 1", "Ảnh 2"… Khung này là một `div.slide` chứa `<img>`. Nền xám và nhãn chữ nằm ở chính khung (CSS `::before` hoặc `data-label`), ảnh thật nằm đè lên trên. Ảnh lỗi hoặc chưa có thì vẫn thấy khung có nhãn.

## 6. Gallery JS (`js/gallery.js`)

- Với mỗi `.gallery`, chèn nút ◀ ▶. Bấm nút thì cuộn track đúng bằng chiều rộng một slide (`scrollBy` với `behavior: smooth`).
- Nút ◀ bị disable khi đang ở đầu, nút ▶ bị disable khi ở cuối (cập nhật theo sự kiện `scroll`).
- Chỉ hiện nút ở ≥1024px (ẩn bằng CSS). Script nạp bằng `defer`.
- Không có JS thì gallery vẫn cuộn/vuốt bình thường.

## 7. Responsive (mobile-first)

| Breakpoint | Bố cục |
|---|---|
| < 640px | Xếp dọc. Slide rộng 85% để ló ảnh kế tiếp. Nút rộng 100%, cao ≥44px. Thông số 2 ô/hàng. Ưu/nhược xếp dọc. |
| 640–1023px | Xếp dọc. Ưu/nhược 2 cột cạnh nhau. Thông số 4 ô/hàng. |
| ≥ 1024px | Section 2 cột: gallery khoảng 55% + thông tin. Section chẵn đảo chiều (so le). Slide rộng 100% track. Hiện nút ◀ ▶. |

Container rộng tối đa 1200px, căn giữa. Cỡ chữ co giãn bằng `clamp()`.

## 8. Phong cách

Biến CSS đặt tại `:root`:

| Biến | Giá trị | Dùng cho |
|---|---|---|
| `--bg` | `#FAFAF7` | nền trang |
| `--bg-alt` | `#F0F2EF` | nền section xen kẽ |
| `--primary` | `#0F6B4F` | tiêu đề, giá, nút chính |
| `--accent` | `#D4F04A` | highlight, gạch chân, nút ◀ ▶ |
| `--text` | `#1C1F1E` | chữ |
| `--pro` | `#1E8E5A` | ưu điểm |
| `--con` | `#D9534F` | nhược điểm |
| `--radius` | `12px` | bo góc |

- Font: **Be Vietnam Pro** (Google Fonts), weight 400/600/700, có `preconnect`.
- Card thông số và hộp ưu/nhược có bóng nhẹ. Nút hover thì nổi lên nhẹ (`translateY(-2px)`).
- `scroll-behavior: smooth` và `scroll-margin-top` bằng chiều cao header. Cả hai tắt khi `prefers-reduced-motion: reduce`.
- Có style `:focus-visible` rõ ràng.

## 9. SEO & chia sẻ

`<html lang="vi">`, `meta viewport`, `meta description`, Open Graph (`og:title`, `og:description`, `og:image` = `images/hero.webp`, `og:type=website`), favicon emoji 🏸 dạng inline SVG.

## 10. Kiểm tra

Kiểm tra thủ công (trang tĩnh, không có test tự động):

- Xem ở 375px, 768px, 1280px: đúng bố cục theo mục 7, không có thanh cuộn ngang ở cấp trang.
- Vuốt/cuộn gallery dừng đúng từng ảnh. Nút ◀ ▶ hoạt động và disable đúng ở hai đầu.
- Bấm menu thì cuộn tới section, tiêu đề không bị header che.
- Tắt JS thì trang vẫn đủ nội dung, gallery vẫn cuộn được.
- Validate HTML không lỗi (W3C validator).

## 11. Deploy

Push lên GitHub rồi import project vào Vercel (Framework Preset: **Other**, không có build command, output là thư mục gốc). README sẽ ghi các bước này.
