# Session report — Endurance Toolkit (25/11/2026)

## Tóm tắt

Từ con số 0 lên một site **production-ready**: 10 calculator chạy bộ, 18 trang goal-pace kèm hub, toàn bộ là static (52 trang prerender), có SEO kỹ thuật đầy đủ và tài liệu chiến lược go-to-market (đưa sản phẩm ra thị trường). Toàn bộ đã được kiểm tra: `tsc`, `eslint`, **109/109 test** và `next build` đều pass.

## Đã làm được gì

### Pha 1: MVP

| Hạng mục | Kết quả |
|---|---|
| Kiến trúc | Next.js 16 App Router + React 19 + Tailwind v4. Một registry duy nhất (`src/lib/registry.ts`) điều khiển cả route, sitemap, llms.txt và OG image |
| Calc library | 9 module pure function (`src/lib/calc`): pace, Riegel, VDOT (Daniels–Gilbert), HR zones (Karvonen/%max), splits, fueling, cadence. Hợp đồng API nằm ở `docs/CALC_API.md` |
| 8 tool UI | Pace Calculator, Pace Converter, Race Time Predictor, VDOT + Training Paces, HR Zones, Marathon Splits (có in pace band), Race Fueling, Cadence/Stride |
| Nội dung SEO | 8 guide, mỗi guide khoảng 1.100–1.300 chữ: worked example, bảng số liệu tính bằng code, FAQ |
| SEO kỹ thuật | Title, description và canonical riêng cho từng trang; JSON-LD (WebApplication, Breadcrumb, FAQPage, HowTo); sitemap.xml, robots.txt, **llms.txt** (cho AI crawler); OG image động cho từng tool |
| Monetization | Component `AdSlot` (sponsor + display, tắt mặc định qua env), trang `/sponsor`, `/privacy` sẵn cho AdSense |
| Chiến lược | `docs/STRATEGY.md`: keyword map, backlog 18 tool xếp hạng, kế hoạch kiếm tiền 3 pha, distribution 90 ngày, KPI 12 tuần |

### Pha 2: QA độc lập và mở rộng

- **QA review** do một agent riêng làm, không tham gia build: kiểm lại công thức bằng số tính độc lập, chụp mobile/desktop/dark mode, dùng puppeteer để tương tác thật. Agent này fix 7 bug, ví dụ: tràn ngang trên mobile, nhập "3:30" bị hiểu thành 3 phút 30 giây, halfway lệch 1 giây, pace converter bị trôi số khi đổi đơn vị. Mình fix thêm 6 lỗi ở tầng app: contrast màu cam chưa đạt chuẩn AA, metadata trang 404, canonical bị kế thừa, footer thiếu category, meta description quá dài, header bị tràn ở màn 360px.
- **18 trang goal-pace** + hub `/pace` (sub-3 → sub-5 marathon, half, 10K, 5K). Mọi con số đều tính từ calc lib lúc build: checkpoint 5 km, mile marker, so sánh even và negative split, VDOT cần đạt, thời gian tương đương ở các cự ly khác, pace tập luyện, fueling, pace band in được.
- **2 tool mới:** VO2max Estimator (3 phương pháp: race/VDOT, Cooper, HR ratio) và Running Calories Calculator (phương trình ACSM kèm rule of thumb). Calories được viết theo hướng fueling/recovery, không theo hướng giảm cân.

## Cách làm (multi-agent)

| Agent | Việc |
|---|---|
| Lead (mình) | Kiến trúc, contract API, layout/pages/SEO routes, tích hợp, fix tầng app |
| Calc agent | Calc library + 90 test |
| UI agent | 11 UI primitive + 8 tool component |
| SEO agent | 8 guide + STRATEGY.md (có research thị trường và affiliate) |
| QA agent | Review độc lập, fix 7 bug, chụp screenshots |
| Goal-pace agent | 18 trang + hub |
| New-tools agent | VO2max + Calories |

Phối hợp qua contract (`CALC_API.md`, registry, type `Guide`), mỗi agent sở hữu một thư mục riêng nên không đụng nhau. Pha 2 bị ngắt giữa chừng vì chạm limit 5 giờ, sau đó resume tiếp từ đúng chỗ dừng.

## Con số

- 4 commit, 100 file, khoảng 7.100 dòng code trong `src/`
- 10 tool + 18 goal page + hub + home/about/privacy/sponsor = 52 route static
- 109 unit test

## Những điểm cần bạn quyết định

1. **Domain:** đặt `NEXT_PUBLIC_SITE_URL`. Hiện đang để tạm `endurance-toolkit.vercel.app`.
2. **Deploy:** push lên GitHub rồi import vào Vercel. Mình chưa tự deploy vào tài khoản của bạn.
3. **Số trang goal-pace:** STRATEGY khuyên ra mắt khoảng 12 trang trước, nhưng hiện đang có 18. Muốn cắt thì chỉ cần sửa mảng `RAW` trong `src/lib/goals.ts`.
4. **Bảng VO2max category:** là bảng tham khảo được làm tròn, nên đối chiếu lại nếu cần chính xác.
5. **Trước khi làm affiliate với ngân hàng hay tài chính:** kiểm tra quy định xung đột lợi ích ở VIB. Site chạy bộ thì ít rủi ro hơn.

## Bước tiếp theo đề xuất

1. Deploy, gắn Google Search Console và submit sitemap.
2. Đăng bài build-in-public lần đầu theo kế hoạch distribution trong STRATEGY (Reddit chỉ đăng trong thread được phép).
3. Backlog tiếp theo: age grading (cần check license bảng WMA), marathon pace chart page, treadmill incline.
4. Sau khoảng 4–6 tuần có traffic thì bật `NEXT_PUBLIC_ADS_ENABLED` và bắt đầu chào bán sponsor.
