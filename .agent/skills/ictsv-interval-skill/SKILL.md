---
name: ictsv-internal-skill
description: >-
  Quy ước, sơ đồ kiến trúc và quy trình từng bước để làm việc với web nội bộ iCTSV (repo "ictsv-internal", SvelteKit 2 + Svelte 5 + Tailwind/daisyUI + Drizzle ORM trên Neon Postgres, deploy Cloudflare Pages). Dùng skill này mỗi khi người dùng muốn xem, giải thích, sửa, cập nhật, mở rộng hoặc review bất cứ thứ gì trong project này, gồm trang/route, menu sidebar, phân quyền, API (+server.ts), bảng/cột/truy vấn database, migration Drizzle, đăng nhập/token, điểm danh, quản lý thành viên (tiểu ban), kiểm duyệt KD. Kích hoạt cả khi người dùng chỉ nói "sửa web", "update web iCTSV", "thêm trang", "thêm cột", "sửa form" hoặc dán file từ src/routes, src/lib mà không nêu tên framework. Mặc định chỉ đọc và đề xuất, không thay đổi code gốc nếu người dùng chưa cho phép rõ ràng.
---

# ictsv-internal

Web công cụ nội bộ của iCTSV. Skill này mô tả cách project được tổ chức và cách làm việc với nó mà không phá vỡ quy ước hiện có.

**Ngôn ngữ:** luôn trả lời bằng **tiếng Việt** (trừ khi người dùng viết tiếng Anh). Giải thích, tiêu đề, danh sách kiểm tra đều bằng tiếng Việt. Tên biến, tên hàm, tên file và comment trong code giữ nguyên tiếng Anh như project đang dùng. Chữ hiển thị trên giao diện web là tiếng Việt (ví dụ "Điểm danh", "Đăng xuất", "Bạn không có quyền truy cập"), nên chữ mới thêm vào giao diện cũng viết tiếng Việt.

## Nguyên tắc số 1: không thay đổi code gốc nếu chưa được hỏi

Đây là quy tắc ưu tiên cao nhất, cao hơn mọi quy trình bên dưới.

1. **Mặc định là chế độ chỉ đọc.** Khi người dùng hỏi, nhờ xem, giải thích, review hay "tìm hiểu", Claude chỉ đọc và trả lời. Không đưa code đã sửa, không tạo file mới, không đề xuất refactor nếu chưa được nhờ.
2. **Chỉ sửa khi có yêu cầu rõ ràng.** Những câu như "sửa", "thêm", "cập nhật", "đổi" kèm mô tả cụ thể mới được tính là cho phép. Câu mơ hồ như "xem giúp cái này", "có vấn đề gì không" thì chỉ phân tích, rồi hỏi lại xem người dùng có muốn sửa không.
3. **Trước khi đưa bản sửa, tóm tắt kế hoạch và xin xác nhận** nếu thay đổi chạm đến: database/schema/migration, đăng nhập và token, phân quyền, xóa dữ liệu, hoặc từ 3 file trở lên. Với thay đổi nhỏ, rõ ràng, người dùng đã yêu cầu trực tiếp thì làm luôn.
4. **Không bao giờ ghi đè hay sửa file gốc.** Claude không dùng `update_file`, `trash_file`, `share_file` hay bất kỳ công cụ nào để thay đổi, di chuyển, đổi tên hay xóa file trong Google Drive của người dùng. Bản sửa luôn được đưa ra dưới dạng đoạn code hoặc file mới (đặt tên rõ như `<tên>.proposed.ts`) để người dùng tự so sánh và áp dụng.
5. **Sửa tối thiểu.** Chỉ đổi đúng phần được yêu cầu. Không đổi định dạng, không đổi tên biến, không dọn dẹp code, không nâng cấp thư viện, không sửa lỗi khác "tiện tay". Nếu phát hiện vấn đề khác, chỉ **nêu ra** ở cuối câu trả lời và để người dùng quyết định.
6. **Luôn cho biết chính xác cái gì thay đổi:** file nào, dòng/khối nào, trước và sau ra sao, để người dùng có thể từ chối từng phần.
7. **Không chạm vào** `passwordHash`, logic JWT và refresh token trong `lib/server/auth`, file `.env*`, các file đã chạy trong `drizzle/`, `pnpm-lock.yaml`, trừ khi người dùng nói đích danh. Không in ra hay hỏi giá trị bí mật thật.

## Stack (đã xác nhận từ package.json)

- SvelteKit 2, **Svelte 5 runes** (`$props()`, `$state`, `{@render children()}`), TypeScript, Vite 5
- Tailwind 3 + **daisyUI 4** (dùng class daisyUI như `bg-base-200`, `btn`, `bg-primary`), icon từ `lucide-svelte` (import từng icon: `lucide-svelte/icons/user`), thông báo toast bằng `svelte-french-toast`
- Database: **Neon Postgres qua Drizzle ORM** (`drizzle-orm`, `@neondatabase/serverless`). Migration: `pnpm db:generate` rồi `pnpm db:migrate`
- Xác thực: `jose` (JWT) + `bcryptjs`; kiểm tra dữ liệu vào bằng `zod`
- Hosting: Cloudflare Pages (`@sveltejs/adapter-cloudflare`, `wrangler.toml`)
- Trình quản lý gói: **chỉ dùng pnpm** (`preinstall` đã chặn npm). Không bao giờ gợi ý `npm install`.
- Lệnh hay dùng: `pnpm dev`, `pnpm check` (svelte-check, chạy sau khi sửa TS/Svelte), `pnpm build`, `pnpm deploy`

> README của repo còn ghi PocketBase và `pb_migrations/`. Phần đó **đã cũ**, project hiện dùng Neon + Drizzle. Không làm theo các bước PocketBase trong README.

## Các thứ nằm ở đâu

```
src/
  hooks.server.ts            cổng xác thực: cookie access_token -> refresh -> kiểm tra đường dẫn công khai
  app.html, app.css
  lib/
    types.ts                 enum RoleLevel, roleMap, các type dùng chung
    utils.ts                 hàm tiện ích, gồm failMessageURL(path, message)
    server/
      auth/                  jwt.ts (verifyAccessToken), authService.ts (refreshAccessToken, ...)
      db/
        db.ts                client drizzle
        schema.ts            TẤT CẢ bảng và quan hệ (Drizzle)
        migrate.ts           chạy migration
        queries/             mỗi bảng một file: members.ts, attendances.ts, departments.ts, refreshTokens.ts
  routes/
    login/ logout/ test/
    api/attendance/ , api/member/     endpoint JSON (+server.ts)
    app/                     khu vực cần đăng nhập
      +layout.server.ts      navList + quyền theo từng route + chuyển hướng
      +layout.svelte         sidebar (daisyUI), bảng icon theo route
      (members)/tieu-ban/            quản lý thành viên
      (members)/attendance-check/    giao diện điểm danh (+ attendance.svelte.ts giữ state)
      kd/                            kiểm duyệt KD
      profile/
drizzle/                     file SQL migration được sinh ra (không sửa tay file đã áp dụng)
static/
```

Đọc `references/architecture.md` để xem tóm tắt schema DB và luồng đăng nhập/phân quyền. Đọc `references/recipes.md` trước khi làm một trong các việc: thêm trang, thêm bảng hoặc cột, thêm API endpoint, đổi phân quyền. Chỉ đọc khi người dùng đã cho phép sửa theo Nguyên tắc số 1.

## Quy tắc khi đã được phép sửa

1. **Đọc trước khi sửa.** Mở file thật (và các file liền kề), không dựa vào bản tóm tắt này để lấy code chính xác. Nếu người dùng chưa gửi file cần thiết, hãy nói rõ cần file nào. Không bịa import, tên hàm hay tên cột.
2. **Theo đúng mẫu hiện có:**
   - Truy cập DB chỉ trong `src/lib/server/db/queries/<bảng>.ts`, dạng các hàm `async` nhỏ được export (`getX`, `createX`, `updateX`, `deleteX`), dùng `db` từ `../db` và toán tử từ `drizzle-orm`, rồi map dòng dữ liệu thành object thuần. Route và endpoint chỉ import các hàm này, không viết truy vấn trực tiếp.
   - API endpoint là `+server.ts` export `GET`/`POST`/... kiểu `RequestHandler` từ `./$types`, trả về `json(...)`, và dùng `error(400, 'Missing ...')` khi dữ liệu vào sai.
   - Dữ liệu trang lấy từ `load` trong `+page.server.ts` và `actions` cho form; kiểm tra dữ liệu bằng `zod`.
   - Chuyển hướng kèm thông báo dùng `failMessageURL(path, message)` từ `$lib/utils`.
3. **Bảng mới phải có chính sách RLS.** Mọi bảng trong `schema.ts` đều khai báo `crudPolicy({ role: editor, read: true, modify: true })` (bảng chỉ đọc dùng `modify: false`). Sao chép đúng mẫu đó.
4. **Phân quyền tập trung** trong `navList` của `src/routes/app/+layout.server.ts`. Cùng một hàm `permission(...)` vừa ẩn mục khỏi sidebar vừa chặn truy cập trực tiếp (kiểm tra `level >= RoleLevel.X`, `departments.includes('...')`, `isActive`). Trang mới cần bảo vệ phải được thêm vào đó, và thêm icon vào `navIcons` trong `+layout.svelte` (khóa = route bỏ tiền tố `/app/`).
5. **Đường dẫn công khai** (không cần đăng nhập) được viết cứng trong `hooks.server.ts`: `/login`, `/register`, `/logout`, `/`. Mọi đường dẫn khác cần có người dùng; `/api/*` trả 401 khi chưa đăng nhập.
6. **Thay đổi schema** = sửa `schema.ts` -> nhắc người dùng chạy `pnpm db:generate` và xem lại SQL -> `pnpm db:migrate`. Cảnh báo rõ các thay đổi gây mất dữ liệu (xóa hoặc đổi tên cột, thêm `notNull` không có default vào bảng đã có dữ liệu).
7. **Phong cách code:** thụt lề bằng tab, dấu nháy đơn, có dấu chấm phẩy (Prettier với `prettier-plugin-svelte`). File trong repo dùng xuống dòng CRLF; giữ nguyên kiểu xuống dòng khi đưa cả file.
8. Claude không chạy được project ở đây (không có mạng, không có `pnpm`). Hãy nói rõ điều này, và kết thúc mỗi thay đổi bằng danh sách ngắn **"Cách kiểm tra"**: lệnh cần chạy (`pnpm check`, `pnpm dev`) và cần bấm/kiểm tra gì.

## Định dạng câu trả lời

**Khi chỉ đọc/giải thích:** trả lời ngắn gọn bằng tiếng Việt, nêu tên file liên quan, và hỏi một câu duy nhất nếu cần biết người dùng có muốn sửa không. Không đính kèm code đề xuất.

**Khi được phép sửa:**
- Nói file nào thay đổi và vì sao (2-4 dòng).
- Với sửa nhỏ, đưa khối code thay đổi kèm vài dòng xung quanh để dễ tìm vị trí; với file mới hoặc sửa nhiều thì đưa cả file.
- Với file mới, ghi rõ đường dẫn đầy đủ dưới `src/`.
- Sau đó là danh sách "Cách kiểm tra", cộng lệnh migration nếu đụng đến schema.
- Cuối cùng, liệt kê (không sửa) những vấn đề khác đã nhìn thấy, nếu có.

## Việc đang làm dở (từ TODO.txt)

Nhóm đang làm: tải zip cho KD, quản lý và sắp xếp email tập trung cho KD, và tăng bảo mật đăng nhập (access token JWT ngắn hạn trong cookie HttpOnly + refresh token dài hạn lưu trong DB, có thể thu hồi). `hooks.server.ts` đã đọc cookie `access_token` và chuyển sang refresh khi hết hạn. Khi được hỏi về các việc này, hãy bám theo thiết kế đó thay vì đề xuất hướng khác.