# Kế Hoạch Chia Sẻ Link Công Khai & Chế Độ Quà Tặng Lãng Mạn

## 1. Tổng Quan Trải Nghiệm
- **Tự động tạo Link & Mã QR Công Khai (`ais-pre`)**: Ngay cả khi bạn đang mở ứng dụng trong trình chỉnh sửa (`ais-dev-...`), hệ thống tạo Link và Mã QR sẽ tự động chuyển đổi sang đường dẫn công khai (`https://ais-pre-o3fo2fixhojs3sgtu246no-503923172471.asia-east1.run.app/?gift=...`) để người nhận mở được ngay trên mọi thiết bị mà không bị chặn quyền truy cập.
- **Chế độ Người Nhận Quà (Recipient Gift Mode)**: Khi bạn gái mở từ đường dẫn công khai (`ais-pre-...`) hoặc đường dẫn có tham số quà tặng (`?gift=...`), giao diện sẽ tự động ẩn các nút quản trị (*Thêm Ảnh/Video*, *Tùy chỉnh*, *Mã QR*) để giữ trọn vẹn không gian lãng mạn. Chỉ hiển thị các nút trải nghiệm: **Bật/Tắt Nhạc**, **Xem Thư Tình** và **Xem Lại Từ Đầu** (kèm một nút nhỏ kín đáo ở góc nếu bạn muốn mở lại quyền chỉnh sửa).
- **Thẻ Xem Trước Lãng Mạn (OpenGraph / Zalo / Messenger Preview)**: Tối ưu hóa tiêu đề, mô tả và ảnh đại diện xem trước trong `index.html` để khi bạn dán link vào Zalo, Messenger hoặc iMessage sẽ hiện thẻ thiệp quà tặng 3D "Món Quà Từ Trái Tim — Dành Riêng Cho Em" sang trọng và ấn tượng.

## 2. Các Hạng Mục Triển Khai Chính
1. **Nâng cấp Bộ Tạo Link & Mã QR Công Khai (`src/components/QrShareModal.tsx`)**:
   - Tự động chuyển đổi tên miền từ `ais-dev-` sang `ais-pre-` khi tạo link chia sẻ và mã QR.
   - Đính kèm tham số `?gift=...` chứa thông điệp cá nhân hóa (tên người nhận, tiêu đề thư, nội dung thư) kết hợp dữ liệu ảnh/video và nhạc đã lưu trên máy chủ.
   - Thêm hướng dẫn nhanh 1 bước bật quyền "Public / Anyone with the link" trên thanh công cụ Share của AI Studio hoặc Cloud Run để đảm bảo mọi người đều truy cập được.
2. **Chế Độ Giao Diện Người Nhận Quà (`src/App.tsx`)**:
   - Tự động nhận diện khi người dùng truy cập qua link quà tặng (`?gift=...`) hoặc domain công khai (`ais-pre-...`).
   - Ẩn toàn bộ thanh công cụ chỉnh sửa (*Thêm Ảnh/Video*, *Tùy chỉnh*, *Mã QR*), chỉ giữ lại các nút điều khiển cảm xúc: **Nhạc nền**, **Xem Thư** và **Xem lại**.
3. **Thẻ Xem Trước Mạng Xã Hội (`index.html`)**:
   - Cập nhật bộ thẻ meta OpenGraph (`og:title`, `og:description`, `og:image`, `og:type`) và Twitter Card với hình ảnh kỷ niệm lãng mạn để hiển thị đẹp mắt khi gửi tin nhắn.
