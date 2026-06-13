# Website Thiệp Mời Tốt Nghiệp

## Mục tiêu

Tạo một website tĩnh (frontend only) dạng thiệp mời dự lễ tốt nghiệp.

Phong cách:
- Trang trọng
- Hiện đại
- Tông màu xanh navy + vàng ánh kim
- Hiệu ứng lật trang như một cuốn sách
- Responsive trên điện thoại và desktop
- Không cần backend

---

# Thông tin cá nhân

Tên:
Nguyễn Anh Tài

Chuyên ngành:
Công nghệ Thông tin

Đơn vị:
Khoa CNTT - Trường Đại Học Sư Phạm Hà Nội

---

# Cấu trúc website

Website gồm 6 trang sách.

## Trang 1 - Bìa

Tiêu đề lớn:

LỄ TỐT NGHIỆP

Tên:

NGUYỄN ANH TÀI

Dòng phụ:

Khoa Công Nghệ Thông Tin
Trường Đại Học Sư Phạm Hà Nội

Hiệu ứng:
- Tên xuất hiện bằng fade-in
- Các hạt ánh sáng vàng di chuyển nhẹ
- Nút mở thiệp

Background:
- Đại học
- Mũ cử nhân
- Tông xanh đậm sang trọng

---

## Trang 2 - Lời cảm ơn

Tiêu đề:

Lời Tri Ân

Nội dung:

Hành trình đại học là một chặng đường đầy thử thách và trưởng thành.

Em xin gửi lời cảm ơn chân thành đến gia đình, thầy cô và bạn bè đã luôn đồng hành, động viên và hỗ trợ em trong suốt những năm học vừa qua.

Ngày tốt nghiệp không chỉ là cột mốc kết thúc một hành trình mà còn là sự khởi đầu cho những mục tiêu mới trong tương lai.

---

## Trang 3 - Hành trình

Tiêu đề:

Hành Trình Sinh Viên CNTT

Hiển thị timeline:

Năm nhất
→ Làm quen với lập trình

Năm hai
→ Cấu trúc dữ liệu & giải thuật

Năm ba
→ Cơ sở dữ liệu, Web Development

Năm tư
→ Đồ án tốt nghiệp và định hướng nghề nghiệp

Hiệu ứng:
- Timeline xuất hiện khi lật tới trang

---

## Trang 4 - Thông tin buổi lễ

Tiêu đề:

Trân Trọng Kính Mời

Nội dung:

Kính mời Quý Thầy Cô, Gia Đình và Bạn Bè
đến tham dự Lễ Tốt Nghiệp của

NGUYỄN ANH TÀI

Khoa Công Nghệ Thông Tin
Trường Đại Học Sư Phạm Hà Nội

Thông tin buổi lễ:

Thời gian:
[Để người dùng tự chỉnh sửa]

Địa điểm:
[Để người dùng tự chỉnh sửa]

Dress Code:
Lịch sự - Trang trọng

---

## Trang 5 - Gallery

Tiêu đề:

Khoảnh Khắc Đáng Nhớ

Hiển thị:

- 4 đến 6 ảnh
- Grid responsive
- Hover zoom nhẹ

Placeholder:

gallery-1.jpg
gallery-2.jpg
gallery-3.jpg
gallery-4.jpg

---

## Trang 6 - Kết thúc

Thông điệp:

Thank You

"Every ending is a new beginning."

Nguyễn Anh Tài

Nút:

Xem lại từ đầu

Hiệu ứng:
- Pháo giấy (confetti)
- Sparkle animation

---

# Hiệu ứng

## Hiệu ứng lật sách

Sử dụng:

turn.js

hoặc

StPageFlip

Yêu cầu:

- Lật trang bằng kéo chuột
- Click góc trang để lật
- Hiệu ứng bóng đổ khi lật

---

# Thiết kế

## Màu sắc

Primary:
#0f172a

Secondary:
#1e293b

Gold:
#d4af37

Text:
#ffffff

---

## Font

Tiêu đề:
Playfair Display

Nội dung:
Poppins

---

# Hiệu ứng nền

- Floating particles
- Light rays
- Glass morphism card
- Gold sparkle

---

# Responsive

Desktop:
Hiển thị dạng sách mở đôi

Tablet:
Sách thu nhỏ

Mobile:
Hiển thị từng trang riêng biệt

---

# Cấu trúc thư mục

project/

index.html

css/
style.css

js/
main.js

assets/

images/

cover-bg.jpg
gallery-1.jpg
gallery-2.jpg
gallery-3.jpg
gallery-4.jpg

backgrounds/

page-bg.jpg

---

# Yêu cầu kỹ thuật

Không sử dụng React.

Sử dụng:
- HTML5
- CSS3
- Vanilla JavaScript

Toàn bộ nội dung lấy từ file cấu hình JSON để dễ chỉnh sửa.

Ví dụ:

{
  "name": "Nguyễn Anh Tài",
  "faculty": "Khoa Công nghệ thông tin",
  "university": "Trường Đại Học Sư Phạm Hà Nội",
  "event_time": "",
  "event_location": ""
}
