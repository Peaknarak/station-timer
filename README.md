# Station Timer

เว็บ Station Timer สำหรับ Central / Station จับเวลาร่วมกันแบบเรียลไทม์ (Socket.IO)  
ฟีเจอร์ครบ: Ready Lobby → เริ่มรอบอัตโนมัติ → แจ้งเตือน 30 วิ → หมดเวลารีเซ็ต → เริ่มรอบใหม่อัตโนมัติ  
มีเสียง start / 30s / timeup พร้อม visual fallback

## สแต็ก
- Backend: Node.js ≥ 20, TypeScript, Express, Socket.IO 4.x (+ zod validate, rate-limit, cookie session HMAC)
- Frontend: React + Vite + TypeScript + Tailwind, Zustand
- Tests: Vitest (backend), Cypress (frontend)
- Optional: Redis (socket.io-redis adapter + room/binding TTL 2 ชม.)

---

## ติดตั้ง & รัน (Windows / VSCode / PowerShell)

```powershell
# ตรวจเวอร์ชัน
node -v

# โคลน
git clone <repo-url> station-timer
cd station-timer

# ติดตั้ง
cd backend; npm ci; cd ..
cd frontend; npm ci; cd ..

# ตั้งค่าแวดล้อม dev ชั่วคราว
$env:SIGNING_SECRET = "dev-secret"
$env:PORT = "4000"

# เปิด 2 เทอร์มินัล
# เทอร์มินัล 1
cd backend; npm run dev
# เทอร์มินัล 2
cd frontend; npm run dev
