# ANALISIS PROJECT — CRUD MASTER DATA + USER

**Project:** Frontend React — CRUD Department, Role, Vehicle, User
**Stack:** React 19 + Vite 8 + TanStack Query + Axios + Zod + Directus API
**Penulis Analisis:** AI Code Reviewer
**Tanggal:** 14 Juli 2026

---

# 1. RINGKASAN EKSEKUTIF

Project ini adalah aplikasi **Single Page Application (SPA)** untuk mengelola data master internal: Department, Role, Vehicle, dan User. Aplikasi terhubung ke backend **Datacore (Directus-like CMS)** melalui REST API.

## Statistik

| Metrik | Nilai |
|--------|-------|
| Total file | 33 (termasuk CSS) |
| Total baris kode | ~1.900 |
| Entitas CRUD | 4 (Department, Role, Vehicle, User) |
| Auth | JWT via login otomatis |
| State management | TanStack Query (server state) + React useState (UI state) |
| Validasi | Zod (4 skema) |
| Linter | Oxlint — 0 error, 0 warning |
| Dependencies | react 19, @tanstack/react-query ^5, axios, zod, vite |

## Fitur Utama

1. Login otomatis dengan JWT (hardcoded credential)
2. CRUD Department dengan kode unik
3. CRUD Role dengan deskripsi
4. CRUD Vehicle dengan spesifikasi alat
5. CRUD User dengan relasi Department (FK)
6. Validasi form dengan Zod
7. Search/filter client-side di semua list
8. Modal untuk form create/edit
9. Confirm dialog untuk delete (bukan `confirm()` native)
10. Loading state, error state, empty state di semua komponen

---

# 2. STRUKTUR FOLDER

```
src/
├── api/                    # Lapisan komunikasi HTTP
│   ├── axios.js            # Axios instance + interceptor
│   └── auth.js             # login/logout function
│
├── common/                 # Komponen reusable (presentational)
│   ├── ConfirmDialog.jsx   # Dialog konfirmasi delete
│   ├── DataTable.jsx       # Tabel generik
│   ├── Modal.jsx           # Modal generik
│   └── StatusBadge.jsx     # Badge warna status
│
├── hooks/                  # Custom hooks (logic + state)
│   ├── useAuth.js          # Auth lifecycle (login otomatis)
│   ├── useCrud.js          # Factory pattern — generic CRUD
│   ├── useDepartments.js   # CRUD Department
│   ├── useRoles.js         # CRUD Role
│   ├── useUsers.js         # CRUD User + field expansion
│   └── useVehicles.js      # CRUD Vehicle
│
├── pages/                  # Halaman per entitas (container components)
│   ├── Department/
│   │   ├── index.jsx               # Page wrapper + state
│   │   ├── DepartmentList.jsx      # Tabel + search + delete
│   │   ├── AddDepartmentForm.jsx   # Form create/edit
│   │   └── DepartmentModal.jsx     # Modal wrapper
│   ├── Role/               # Struktur identik dengan Department
│   │   ├── index.jsx
│   │   ├── RoleList.jsx
│   │   ├── AddRoleForm.jsx
│   │   └── RoleModal.jsx
│   ├── Vehicle/            # Struktur identik
│   │   ├── index.jsx
│   │   ├── VehicleList.jsx
│   │   ├── AddVehicleForm.jsx
│   │   └── VehicleModal.jsx
│   └── User/               # Struktur identik + relation dropdown
│       ├── index.jsx
│       ├── UserList.jsx
│       ├── UserForm.jsx
│       └── UserModal.jsx
│
├── validation/
│   ├── schemas.js          # Zod schemas untuk 4 entitas
│   └── validate.js         # Helper fungsi validasi
│
├── App.jsx                 # Root component — render 4 halaman
├── App.css                 # Styling global (dark theme)
├── index.css               # Reset + CSS variables
└── main.jsx                # Entry point + QueryClientProvider
```

## Fungsi Masing-masing Folder

| Folder | Tanggung Jawab | Kenapa Dipisah |
|--------|---------------|----------------|
| `api/` | Semua kode yang berhubungan dengan HTTP | **Separation of concerns** — UI tidak boleh tahu detail HTTP. Jika baseURL berubah, hanya 1 file yang diedit. |
| `common/` | Komponen yang dipakai oleh banyak halaman | **DRY (Don't Repeat Yourself)** — DataTable, Modal, ConfirmDialog, StatusBadge dipakai ulang di 4 halaman |
| `hooks/` | Logic + state yang reusable di banyak komponen | **Logic separation** — memisahkan data fetching logic dari UI rendering |
| `pages/` | Container components — menggabungkan hook + komponen | **Feature grouping** — setiap entitas punya folder sendiri, mudah dicari, mudah di-scale |
| `validation/` | Semua validasi logic | **Single source of truth** — skema validasi reusable, bisa dipanggil dari mana saja |

## Pola Struktur per Halaman

Setiap folder page mengikuti pola **4 file**:

```
index.jsx        → State parent: search, showModal, editItem
[List].jsx       → DataTable + search + delete flow
[Form].jsx       → Form create/edit dengan validasi
[Modal].jsx      → Modal wrapper (presentational tipis)
```

**Keuntungan:**
- Konsisten — developer baru bisa tebak file mana yang berisi apa
- Testable — setiap komponen kecil, mudah di-unit-test
- Scalable — tambah entitas baru tinggal copy folder + ganti nama

---

# 3. FLOW APLIKASI

```
User buka aplikasi
       │
       ▼
main.jsx — mount React + QueryClientProvider
       │
       ▼
App.jsx — panggil useAuth()
       │
       ▼
useAuth() — cek localStorage access_token
       │
       ├── token ada → setReady(true)
       │
       └── token tidak ada → panggil auth.login()
                │
                ├── sukses → simpan token → setReady(true)
                │
                └── gagal → setAuthError("Gagal login: ...")
       │
       ▼
App return:
       ├── authError  → tampilkan <p className="error-msg">
       ├── !ready     → tampilkan "Menghubungkan ke server..."
       └── ready      → render 4 halaman (stack vertikal)
                │
                ▼
        DepartmentPage — inisialisasi state (search, showModal, editItem)
                │
                ├── DepartmentList — panggil useDepartments()
                │       │
                │       ├── useDepartments → useList() → GET /items/mt_department
                │       │       │
                │       │       └── Axios interceptor → inject Bearer token
                │       │               │
                │       │               └── Response → data ditampilkan di DataTable
                │       │
                │       ├── search — client-side filter via useMemo
                │       │
                │       └── delete — klik Hapus → ConfirmDialog → DELETE /items/mt_department/:id
                │
                ├── DepartmentModal — jika showModal=true
                │       │
                │       └── AddDepartmentForm
                │               ├── form diisi → validasi Zod
                │               ├── submit → POST (create) atau PATCH (edit)
                │               ├── sukses → invalidateQueries → list reload otomatis
                │               └── gagal  → tampilkan server error
                │
                ├── divider <hr>
                ├── RolePage — pola identik dengan Department
                ├── VehiclePage — pola identik
                └── UserPage — pola identik + dropdown relation
```

## Diagram Aliran Data

```
BACKEND (Datacore)               FRONTEND (React)
─────────────────                ─────────────────
                                  App.jsx
mt_department                        │
mt_role                         DepartmentPage
mt_vehicle                          │
mt_user_profile                 DepartmentList ←── useDepartments()
                                  │                   │
                              DataTable            useQuery → GET
                                  │               useMutation → POST/PATCH/DELETE
                              AddDepartmentForm       │
                                  │               invalidateQueries → refetch
                              Zod validation
```

## Pola State

```
┌─────────────────────────────────────┐
│         Page index.jsx              │
│  ┌─────────────┐ ┌───────────────┐  │
│  │  useState   │ │  useQuery     │  │
│  │  search     │ │  data (cache) │  │
│  │  showModal  │ │  isLoading    │  │
│  │  editItem   │ │  isError      │  │
│  └──────┬──────┘ └──────┬────────┘  │
│         │               │           │
│         ▼               ▼           │
│   DepartmentList ── useMemo ── filtered
│         │               │           │
│         ▼               ▼           │
│   DepartmentModal ── AddDepartmentForm
│         │               │           │
│         ▼               ▼           │
│   ConfirmDialog ── useMutation ── PATCH/DELETE
└─────────────────────────────────────┘
```

---

# 4. ANALISIS PER FILE

## 4.1 Root Files

### `main.jsx`
**Tujuan:** Entry point aplikasi. 
**Kenapa dibuat:** Semua React app butuh root.
**Hubungan:** Membungkus `<App>` dengan `<QueryClientProvider>` (TanStack Query context).
**Apa yang terjadi:**
1. `QueryClient` dibuat dengan konfigurasi: `retry: 1`, `refetchOnWindowFocus: false`
2. Aplikasi di-render ke DOM (`#root`)
3. StrictMode aktif (detect side effect)

### `App.jsx`
**Tujuan:** Root component — orchestrator.
**Kenapa dibuat:** Entry point UI setelah provider.
**Hubungan:** Panggil `useAuth()` → jika ready, render 4 Page.
**Apa yang terjadi:**
1. `useAuth()` jalan → cek token → login otomatis jika perlu
2. Selama loading, tampilkan "Menghubungkan ke server..."
3. Jika error auth, tampilkan pesan error
4. Jika siap, render 4 halaman dengan `<hr>` divider

**Catatan penting:** App.jsx render **vertical stack** — tidak ada routing. Semua page tampil sekaligus. Cocok untuk admin panel sederhana, tidak scalable untuk 10+ halaman.

---

## 4.2 API Layer

### `api/axios.js`
**Tujuan:** Axios instance pre-configured.
**Kenapa dibuat:** Single point of configuration untuk semua HTTP call.
**Isi:**
- `baseURL` → `https://product.backend.machinevision.global`
- `Content-Type: application/json`
- **Request interceptor:** Inject `Bearer` token dari localStorage
- **Response interceptor:** Jika 401, hapus token + reload halaman

**Mengapa interceptor dipisah:**
- Semua request otomatis punya token — tidak perlu manual di setiap file
- 401 handling global — tidak perlu try-catch 401 di setiap mutation
- Jika cara auth berubah (misal ke cookie), hanya 1 file diubah

### `api/auth.js`
**Tujuan:** Fungsi login dan logout.
**Kenapa dibuat:** Memisahkan auth logic dari komponen UI.
**Isi:**
- `login()` → POST `/auth/login` dengan hardcoded credential → simpan token
- `logout()` → hapus token dari localStorage

**Kelemahan:** Credential hardcoded. Jika password berubah, harus rebuild. Solusi: pindah ke `.env`.

---

## 4.3 Common Components

### `Modal.jsx`
**Tujuan:** Overlay dialog reusable.
**Props:** `open` (boolean), `onClose` (callback), `children`.
**Lifecycle:** `useEffect` — jika `open=true`, register event listener `Escape` → `onClose`.
**Event:** Klik overlay → close. Klik tombol X → close.
**Hubungan:** Dipanggil oleh setiap `[Entity]Modal` dan `ConfirmDialog`.

### `ConfirmDialog.jsx`
**Tujuan:** Dialog konfirmasi untuk delete.
**Props:** `message`, `onConfirm`, `onCancel`, `isPending`.
**Hubungan:** Memakai `Modal` di dalamnya (composition).
**Apa yang terjadi:** Ketika delete diklik, komponen ini muncul. Tombol "Ya, Hapus" trigger `onConfirm`. Tombol "Batal" trigger `onCancel`.

### `DataTable.jsx`
**Tujuan:** Tabel generik yang bisa dipakai oleh entitas apa pun.
**Props:**
- `columns` — array `{ key, label, render? }`
- `data` — array of objects
- `loading`, `error` — state handling
- `onEdit`, `onDeleteClick` — event handler
- `searchQuery`, `emptyMessage` — display text

**State handling (priority order):**
1. `loading` → "Memuat data..."
2. `error` → "Gagal memuat: {message}"
3. `!data?.length` + `searchQuery` → "Data tidak ditemukan."
4. `!data?.length` → `emptyMessage`
5. Ada data → render tabel

**Keunikan:** Baris `col.render ? col.render(row) : col.value ? col.value(row) : row[col.key] ?? '-'` — prioritas render: custom function > value accessor > direct property.

### `StatusBadge.jsx`
**Tujuan:** Badge warna untuk status.
**Mapping:** `published` → hijau, `active` → biru, `draft` → kuning, lainnya → abu-abu.
**Props:** `status` (string).

---

## 4.4 Hooks

### `useAuth.js`
**Tujuan:** Auth lifecycle — memastikan user terautentikasi sebelum render.
**Mechanism:**
```
useEffect [] → mount sekali
    │
    ├── token ada → setReady(true)
    └── token tidak ada → login() → setReady / setAuthError
```
**Return:** `{ ready, authError }`

### `useCrud.js` (Factory)
**Tujuan:** Factory function untuk generate 4 hooks CRUD dari 1 konfigurasi.
**Input:** `{ key, endpoint }`
**Output:** `{ useList, useCreate, useUpdate, useRemove }`

**Mengapa dibuat:**
- Department, Role, Vehicle, User semua punya pola CRUD identik
- Tanpa factory, setiap entitas butuh ~50 baris kode yang sama
- Dengan factory, setiap entitas cukup 7 baris

### `useDepartments.js`
```
import { createCrudHooks } from './useCrud';
const dept = createCrudHooks({ key: 'departments', endpoint: '/items/mt_department' });
export { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment };
```

### `useUsers.js` (Special Case)
**Kenapa berbeda:** User butuh `fields: '*.*'` untuk menampilkan relasi Department name (bukan UUID).
**Solusi:** Override `useList` — custom `useQuery` dengan params expansion.

**Kelemahan:** QueryKey antara factory `useList` dan custom `useQuery` harus sama (`['users']`) agar cache invalidation bekerja. Ini rawan bug jika tidak sinkron.

---

## 4.5 Validation

### `validation/schemas.js`
**Tujuan:** Zod schema untuk setiap entitas.
**Aturan umum:**
- `name` → `.trim().min(1).min(3)`
- `status` → `.min(1)` (required)
- `code` (Department) → regex uppercase + dash
- Field opsional → `.optional().default('')`
- Foreign key → `.uuid().nullable().optional()`

### `validation/validate.js`
**Tujuan:** Helper function agar validasi tidak ditulis berulang.
**Input:** `schema`, `data`
**Output:** `{ success: boolean, errors: { [field]: message } }`

**Mengapa dibuat helper:**
- Pola `safeParse` + loop `issues` → `fieldErrors` sama di 4 form
- Tanpa helper, setiap form punya 12 baris kode identik
- Dengan helper, cukup 3 baris: `validateWithZod(schema, form)`

---

## 4.6 Pages — Pola Folder

Setiap page folder mengikuti pola yang sama. Saya analisis satu (Department) sebagai representasi.

### `pages/Department/index.jsx`
**Tujuan:** Page wrapper — local state owner.
**State:** `editItem`, `showModal`, `search` (semua useState).
**Kenapa dibuat:** Memisahkan state management dari list dan form. Jika state di list maka form tidak bisa akses; jika di form maka list tidak bisa akses. Ditaruh di parent (index) agar keduanya bisa akses.

### `pages/Department/DepartmentList.jsx`
**Tujuan:** Menampilkan tabel, search bar, dan handle delete.
**Proses:**
1. Terima props: `search`, `onSearchChange`, `onAdd`, `onEdit`
2. Fetch data via `useDepartments()` — TanStack Query
3. Filter data via `useMemo` — client-side search
4. Render: `DataTable` + `ConfirmDialog`
5. Delete: set `deleteTarget` → tampilkan `ConfirmDialog` → handle confirm → `deleteMutation.mutate`

**Penting:** `deleteMutation` adalah `useMutation` yang otomatis invalidate cache `['departments']` setelah sukses.

### `pages/Department/AddDepartmentForm.jsx`
**Tujuan:** Form untuk create/edit Department.
**State:** `form`, `errors`, `serverError`, `successMsg` (semua useState).
**Validation:** Zod `departmentSchema` via `validateWithZod`.
**Submit flow:**
1. `validate()` → Zod safeParse
2. Build payload
3. `mutateAsync` → POST (create) / PATCH (edit)
4. Sukses → `setSuccessMsg` + `setTimeout(onSuccess, 1500)` — delay close biar user lihat pesan
5. Gagal → extract error dari `err.response.data.errors[0].message`

**Mengapa `editItem` tidak perlu API fetch?** Karena `onEdit` mengirim object user dari row tabel yang sudah di-fetch. Tidak perlu GET detail — ini efisien tapi asumsi data di tabel sudah lengkap.

### `pages/Department/DepartmentModal.jsx`
**Tujuan:** Lapisan tipis — wrapper.
**Isi:** Hanya render `<Modal>` + `<AddDepartmentForm>`.
**Kenapa dibuat:** Memisahkan tanggung jawab. Jika modal butuh custom styling atau behavior, tidak mengotori form atau list.

---

# 5. HOOK ANALYSIS

## Factory Pattern: `createCrudHooks`

### Mechanism

```javascript
createCrudHooks({ key: 'departments', endpoint: '/items/mt_department' })
```

| Hook | HTTP | Query Key | Behavior |
|------|------|-----------|----------|
| `useList` | GET `/items/mt_department` | `['departments']` | Cache sampai invalidate |
| `useCreate` | POST | `['departments']` | Auto invalidate on success |
| `useUpdate` | PATCH `/:id` | `['departments']` | Auto invalidate on success |
| `useRemove` | DELETE `/:id` | `['departments']` | Auto invalidate on success |

### Kenapa Factory?

1. **DRY** — 4 entitas × 4 hooks = 16 hooks manual. Dengan factory: 1 factory + 4 file 7 baris.
2. **Konsisten** — Semua hook menggunakan queryKey yang sama, invalidate behavior yang sama.
3. **Maintainable** — Jika pattern CRUD berubah (misal perlu headers tambahan), cukup edit 1 file.

### Lifecycle

```
Component mount → useList() → useQuery
    │
    ├── cache['departments'] ada → return cache
    │
    └── tidak ada → GET /items/mt_department
            │
            ├── sukses → simpan cache → re-render
            │
            └── gagal  → retry (1x) → isError=true → error state
    │
    ├── User create → useCreate() → POST → onSuccess → invalidate['departments']
    │                    │
    │                    └── refetch → UI update otomatis
    │
    ├── User edit → useUpdate() → PATCH → invalidate → refetch
    │
    └── User delete → useRemove() → DELETE → invalidate → refetch
```

---

# 6. API ANALYSIS

## Axios Instance

```javascript
const api = axios.create({
  baseURL: 'https://product.backend.machinevision.global',
  headers: { 'Content-Type': 'application/json' },
});
```

## Interceptor Request

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Fungsi:** Token dari localStorage otomatis disisipkan ke setiap request. Tanpa ini, setiap panggil API harus manual: `{ headers: { Authorization: 'Bearer ...' } }`.

## Interceptor Response

```javascript
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);
```

**Fungsi:** Jika server mengembalikan 401 (token expired / invalid), hapus token dan reload. Ini akan trigger `useAuth()` → login ulang.

**Catatan:** `window.location.reload()` keras — tapi untuk admin panel sederhana ini acceptable. Alternatif: refresh token mechanism.

---

# 7. CRUD FLOW

## CREATE

```
User klik "+ Tambah"
       │
       ▼
Page index: openAdd() → setEditItem(null), setShowModal(true)
       │
       ▼
Modal muncul → Form kosong
       │
User isi form → klik "Tambah"
       │
       ▼
validate() → Zod safeParse
       │
       ├── gagal → setErrors() → tampilkan error per field
       │
       └── sukses
              │
              ▼
       handleSubmit()
              │
              ├── POST /items/mt_department { name, code, status }
              │       │
              │       ├── sukses (201) → invalidateQueries(['departments'])
              │       │       │
              │       │       ├── setSuccessMsg("berhasil ditambahkan!")
              │       │       ├── setTimeout(1500) → onSuccess() → close modal
              │       │       └── DataTable refetch → list terbaru
              │       │
              │       └── gagal (400/500) → setServerError() → tampilkan pesan
              │
              └── (nilai role_id, vehicle_id tidak dikirim karena tidak ada FK di backend)
```

## READ

```
Page mount → useList() → useQuery(['departments'])
       │
       ├── cache hit → return data → render table
       │
       ├── cache miss → GET /items/mt_department
       │       │
       │       └── responden → cache → render
       │
       └── useMemo(search) → filter client-side
               │
               └── DataTable → columns config → render td/th
```

## UPDATE

```
User klik "Edit" di row tabel
       │
       ▼
Page index: openEdit(row) → setEditItem(row), setShowModal(true)
       │
       ▼
Modal muncul → Form terisi dari editItem (pre-populated)
       │
User ubah data → klik "Simpan Perubahan"
       │
       ▼
validate() → Zod safeParse
       │
       ├── gagal → tampilkan error
       │
       └── sukses
              │
              ▼
       handleSubmit() — isEditing=true
              │
              ├── PATCH /items/mt_department/:id { ...payload }
              │       ├── sukses → invalidateQueries → refetch
              │       └── gagal → server error
              │
              └── setTimeout → close modal
```

## DELETE

```
User klik "Hapus" di row tabel
       │
       ▼
DepartmentList: onDeleteClick(id) → setDeleteTarget(id)
       │
       ▼
ConfirmDialog muncul: "Yakin hapus department ini?"
       │
       ├── Klik "Batal"
       │      └── setDeleteTarget(null) → dialog hilang
       │
       └── Klik "Ya, Hapus"
              │
              ▼
       handleConfirmDelete()
              │
              ├── deleteMutation.mutate(id)
              │       │
              │       ├── DELETE /items/mt_department/:id
              │       │       │
              │       │       ├── sukses (204) → invalidateQueries(['departments'])
              │       │       │       → setDeleteSuccess("berhasil dihapus!")
              │       │       │       → setTimeout(3000) → hilang
              │       │       │       → setDeleteTarget(null) → dialog hilang
              │       │       │       → DataTable refetch → list terbaru
              │       │       │
              │       │       └── gagal → setDeleteError(pesan error)
              │       │                 (misal: foreign key constraint — user masih
              │       │                  memakai department ini)
              │       │
              │       └── isPending=true → tombol disable "Menghapus..."
```

---

# 8. FLOW RELATION

## Arsitektur Relation Saat Ini

```
mt_user_profile
├── department_id (FK → mt_department) ✅ Existing — dropdown work
├── role_id       (FK → mt_role)        ❌ No column in backend
└── vehicle_id    (FK → mt_vehicle)     ❌ No column in backend
```

## Yang Bisa Dilakukan:

| Field di Form | Kirim ke API? | Tersimpan di DB? |
|--------------|--------------|-----------------|
| Department | ✅ `department_id` dikirim | ✅ Tersimpan |
| Role | ❌ Tidak dikirim | ❌ Tidak ada kolom |
| Vehicle | ❌ Tidak dikirim | ❌ Tidak ada kolom |

## Kenapa Relation (Bukan String Langsung)?

**Contoh:**
- User punya field `department_id` → berelasi ke tabel `mt_department`
- Di UI, nama Department ditampilkan: "IT", "Marketing"

**Jika pakai string langsung:**
```
mt_user_profile.department = "IT"
# Admin rename "IT" → "Information Technology"
# Harus update SETIAP user yang pakai "IT"
```

**Jika pakai relation:**
```
mt_user_profile.department_id = "uuid-IT"
mt_department: { id: "uuid-IT", name: "IT" }
# Admin rename → otomatis semua user melihat nama baru
# Tidak perlu update massal
```

**Keuntungan relation:**
1. **Data consistency** — satu sumber kebenaran
2. **Cascade update** — rename sekali, semua berubah
3. **History integrity** — data master bisa punya versi
4. **Query lanjutan** — bisa hitung "berapa user di department X?"

**Kekurangan relation:**
1. Butuh JOIN query (impact performance pada data besar)
2. UI lebih kompleks (dropdown, loading state)
3. Dependency — tidak bisa hapus department jika masih ada user

---

# 9. STATE MANAGEMENT

## Arsitektur State

Ada 3 jenis state dalam aplikasi ini:

| Jenis State | Dimana | Contoh | Kenapa |
|-------------|--------|--------|--------|
| **Server state** | TanStack Query cache | data department, loading, error | Data dari API, butuh cache + sync |
| **UI state (form)** | React useState via `useState` | `form`, `errors`, `serverError` | Ephemeral — tidak perlu global |
| **UI state (page)** | React useState via page index | `search`, `showModal`, `editItem` | Scope halaman — tidak perlu global |

## Kenapa TanStack Query (bukan Redux/Context)?

| | TanStack Query | Redux | Context |
|--|---------------|-------|---------|
| API call management | ✅ Built-in | ❌ Manual | ❌ Manual |
| Caching | ✅ Otomatis | Manual | Manual |
| Cache invalidation | ✅ `invalidateQueries` | Dispatch action | State update |
| Loading state | ✅ `isLoading` | Manual | Manual |
| Error state | ✅ `isError` | Manual | Manual |
| Retry | ✅ Configurable | Manual | Manual |
| Refetch on focus | ✅ Configurable | Manual | Manual |
| Boilerplate | Minimal | Banyak | Sedang |

**Kesimpulan:** Untuk aplikasi yang didominasi server state (CRUD), TanStack Query adalah pilihan tepat. Redux overkill. Context cukup untuk global state ringan (auth), tapi TanStack Query menangani server state lebih baik.

---

# 10. VALIDASI

## Mengapa Zod?

| Kriteria | Zod | Yup | Joi | Validasi Manual |
|----------|-----|-----|-----|-----------------|
| Type inference | ✅ | ✅ | ❌ | ❌ |
| Bundle size | ~8KB | ~22KB | ~50KB | 0KB |
| TypeScript support | ✅ Born with TS | ✅ | ⚠️ | ❌ |
| `safeParse` | ✅ | ✅ | ✅ | ❌ |
| Error messages | ✅ Kustom | ✅ | ✅ | Manual |
| Chaining API | ✅ `.min().max().regex()` | ✅ | ✅ | if-else nested |

**Zod terpilih karena:**
1. **Size** — paling kecil (8KB) dibanding Yup (22KB)
2. **Paling modern** — React 19 + Vite 8 ecosystem friendly
3. **Composable** — schema bisa dipetakan ke field error dengan mudah

## Perbandingan: Manual vs Zod

**Manual:**
```javascript
function validate() {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Nama wajib diisi';
  else if (form.name.trim().length < 3) errs.name = 'Min 3 karakter';
  if (!form.code.trim()) errs.code = 'Kode wajib diisi';
  else if (!/^[A-Z0-9]+$/.test(form.code))
    errs.code = 'Format salah';
  setErrors(errs);
  return Object.keys(errs).length === 0;
}
```

**Zod:**
```javascript
const schema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi').min(3, 'Min 3 karakter'),
  code: z.string().trim().min(1, 'Kode wajib diisi').regex(/^[A-Z0-9]+$/, 'Format salah'),
  status: z.string().min(1, 'Pilih Status'),
});
```

**Keuntungan Zod:**
1. **Schema = documentation** — lihat schema langsung tahu aturan bisnis
2. **Reusable** — schema bisa dipakai di frontend & backend (jika isomorphic)
3. **Type inference** — bisa generate TypeScript type dari schema
4. **Consistent error format** — semua error punya struktur `{ field: message }`

---

# 11. ERROR HANDLING

## Error Categories

| Kategori | Dimana | Tampilan |
|----------|--------|----------|
| **Auth error** (401) | Axios response interceptor | Reload → login ulang |
| **Network error** | `catch` di handleSubmit | "Gagal menyimpan data" |
| **Server error** (400/500) | `catch` di handleSubmit | `err.response.data.errors[0].message` |
| **Validation error** | `validateWithZod` | `<span className="field-err">` per field |
| **Delete error** | `onError` callback mutation | `<p className="error-msg">` di atas tabel |

## Diagram Error Flow

```
Setiap mutation (create/update/delete)
       │
       ├── sukses → successMsg + invalidateQueries + timeout redirect
       │
       └── gagal
              │
              ├── 401 → interceptor → reload
              │
              ├── 400/500 → serverError = errors[0].message
              │       → tampilkan di form
              │
              └── network error → "Gagal menyimpan data"
```

## Loading State

| Komponen | Loading State | Element |
|----------|--------------|---------|
| DataTable (list) | `useQuery.isLoading` | `<p>Memuat data...</p>` |
| DataTable (error) | `useQuery.isError` | `<p>Gagal memuat: {message}</p>` |
| Form submit | `useMutation.isPending` | Button disabled "Menyimpan..." |
| Delete confirm | `useMutation.isPending` | Button disabled "Menghapus..." |
| Auth | `useAuth().ready` | "Menghubungkan ke server..." |

---

# 12. UI FLOW

## Ketika User Klik "Tambah"

```
Klik "+ Tambah"
       │
       ▼
Page index.openAdd()
  → setEditItem(null)    (tidak ada data edit)
  → setShowModal(true)   (tampilkan modal)
       │
       ▼
DepartmentModal render
  → Modal open=true
       │
       ▼
AddDepartmentForm render
  → form diisi dari INITIAL (kosong)
  → tombol submit: "Tambah"
```

## Ketika User Klik "Edit"

```
Klik "Edit" di row [IT]
       │
       ▼
Page index.openEdit(row)
  → setEditItem(row)     ({ id, name: "IT", code: "DPT-IT", status: "published" })
  → setShowModal(true)
       │
       ▼
DepartmentModal
  → Modal open=true
       │
       ▼
AddDepartmentForm
  → form diisi dari editItem (pre-populated)
  → tombol submit: "Simpan Perubahan"
```

## Ketika User Klik "Delete"

```
Klik "Hapus" di row [IT]
       │
       ▼
DepartmentList.onDeleteClick("uuid-IT")
  → setDeleteTarget("uuid-IT")
       │
       ▼
ConfirmDialog render
  → Modal open=true
  → "Yakin hapus department ini?"
  → Dua tombol: "Batal", "Ya, Hapus"
```

## Ketika User Klik "Simpan" (di Form)

```
Klik "Tambah" / "Simpan Perubahan"
       │
       ▼
validate() → Zod safeParse
       │
       ├── gagal → errors per field
       │       → input border merah
       │       → span field-err di bawah input
       │
       └── sukses
              │
              ▼
       handleSubmit()
              │
              ├── POST/PATCH → API
              │       │
              │       ├── sukses → successMsg → 1.5s delay → close modal
              │       │             → invalidate cache → list refetch
              │       │
              │       └── gagal → serverError → teks merah di form
              │
              └── isPending=true → button disabled "Menyimpan..."
```

## Ketika User Klik "Batal"

**Di Modal:** Klik overlay / tombol X / tekan Escape
```
→ Modal onClose()
  → Page index.closeModal()
    → setShowModal(false)
    → setEditItem(null)
```

**Di ConfirmDialog:** Klik "Batal"
```
→ ConfirmDialog onCancel()
  → setDeleteTarget(null)
  → dialog hilang (Modal close karena open=false dari conditional render)
```

---

# 13. BAGIAN PALING PENTING (Top 10)

| # | Bagian | Alasan |
|---|--------|--------|
| 1 | **`useCrud.js` — Factory Pattern** | Ini adalah fondasi semua CRUD. Tanpa ini, 4 entitas × 4 hooks = 16 hooks manual. Dengan ini, 1 factory + 4 file pendek. Semua bug fix di CRUD logic cukup di 1 file. |
| 2 | **`api/axios.js` — Axios Interceptor** | Security backbone. Setiap request dapat token otomatis. 401 handling global. Jika ada vulnerability auth, ini garis pertahanan pertama. |
| 3 | **`validation/schemas.js` — Zod Schemas** | Single source of truth untuk validasi. Jika validasi longgar → data kotor masuk DB. Jika validasi terlalu ketat → user frustrasi. Keseimbangan ada di file ini. |
| 4 | **`DataTable.jsx` — Reusable Table** | Komponen ini dipakai 4 kali. Jika ada bug di sini, 4 halaman error. Jika ada improvement, 4 halaman dapat sekaligus. |
| 5 | **`Modal.jsx` — Modal Component** | Modal adalah komponen dengan side effect (Escape listener). Jika ada memory leak di sini (addEventListener tanpa cleanup), akumulasi listener bisa degrade performance. |
| 6 | **`AddDepartmentForm.jsx` — Form Pattern** | Ini adalah template untuk semua form lain. Struktur state, validasi, submit, error handling di sini menjadi standar. Jika di sini ada bug, kemungkinan besar sama di 3 form lain. |
| 7 | **`App.jsx` — Orchestrator** | Entry point UI. Auth flow di sini. Jika `useAuth()` gagal, seluruh app error. Jika logic `ready` vs `authError` salah, infinite loading atau error loop. |
| 8 | **`useAuth.js` — Auth Hook** | Menentukan kapan user bisa akses app. Jika login gagal, tidak ada yang bisa diakses. Token management di sini kritikal. |
| 9 | **`UserForm.jsx` — Relation Implementation** | Paling kompleks dari semua form karena melibatkan 3 dropdown relasi + data fetching paralel. Ini blueprint untuk fitur relation ke depan. |
| 10 | **TanStack Query `invalidateQueries` pattern** | Mekanisme yang membuat CRUD terasa real-time. Setiap mutation success → invalidate → refetch. Jika ini salah (queryKey mismatch), data tidak akan sinkron. |

---

# 14. BAGIAN PALING SULIT

## 1. Generic Factory Pattern (`useCrud.js`)

**Kenapa sulit:** Factory harus cukup generic untuk mencakup semua entitas, tapi cukup specific untuk berguna. Keseimbangan abstraksi itu sulit. Terlalu generic → tidak berguna. Terlalu specific → tidak reusable.

**Contoh tantangan:**
- `useUsers.js` butuh `fields: '*.*'` sementara entitas lain tidak
- Factory harus `return` fungsi, bukan state — closure harus benar
- QueryKey harus sinkron antara factory dan custom override (untuk useUsers)

## 2. User Relation (UserForm.jsx)

**Kenapa sulit:** User form menggabungkan 3 data fetching paralel (departments, roles, vehicles). Harus handle:
- Loading state masing-masing
- Jika 1 gagal, form tetap bisa jalan dengan dropdown lainnya
- Value mapping: dropdown value = UUID, display = name
- Form state: `role_id` dan `vehicle_id` tidak punya FK di backend — field ada di UI tapi tidak dikirim ke API

**Keputusan desain:** Dropdown tetap ditampilkan meskipun data tidak tersimpan di backend. Kenapa? Karena form di-frontend sudah siap secara arsitektur. Tinggal backend yang perlu menambah kolom FK.

## 3. Error Message Extraction

```javascript
err.response?.data?.errors?.[0]?.message ?? 'Gagal menyimpan data'
```
**Kenapa sulit:** Error response dari Datacore tidak konsisten. Kadang array, kadang object. Kadang `message`, kadang `error`. Chaining optional chaining panjang ini adalah defensive programming yang diperlukan karena ketidakpastian API.

---

# 15. PERTANYAAN ATASAN + JAWABAN IDEAL

## Q1: Kenapa memakai custom hook? Kenapa tidak langsung fetch di komponen?

**Jawaban:** Custom hook memisahkan **logic** dari **UI**.
- Komponen hanya render — tidak perlu tahu detail HTTP
- Hook reusable — `useDepartments`, `useRoles`, `useVehicles` semua pakai factory yang sama
- Testable — hook bisa di-test terpisah dari komponen
- Jika API endpoint berubah, cukup edit 1 file (hook), bukan setiap komponen yang panggil API

## Q2: Kenapa axios dipisah ke file sendiri?

**Jawaban:** Single Responsibility Principle dan DRY.
- **Base URL** dan **headers** cukup dikonfigurasi sekali
- **Interceptor request** — Bearer token otomatis di semua request. Tanpa ini, setiap panggil API harus manual `{ headers: { Authorization: 'Bearer ...' } }`
- **Interceptor response** — 401 handling global. Jika token expired, semua request yang gagal 401 akan trigger logout otomatis
- Jika migrasi ke fetch API atau graphql, cukup 1 file diubah

## Q3: Kenapa modal dipisah dari form?

**Jawaban:** Separation of concerns.
- **Modal** = concern presentational (show/hide, animasi, Escape key)
- **Form** = concern fungsional (data, validasi, submit)
- Jika suatu saat form dipakai di halaman penuh (bukan modal), tinggal panggil form tanpa modal — tidak perlu rewrite
- Modal bisa di-reuse oleh ConfirmDialog tanpa duplikasi

## Q4: Kenapa memakai relation? Kenapa tidak simpan string langsung?

**Jawaban:** Data integrity dan maintainability.
- **String langsung:** Ubah nama department → harus update setiap baris user yang memakai nama itu
- **Relation:** Ubah nama di tabel master → otomatis semua referensi mengikuti
- **Consistency:** Tidak mungkin ada typo "IT" vs "I.T" vs "IT " (spasi)
- **Query capability:** Bisa join, hitung aggregate, filter berdasarkan atribut relation

## Q5: Kenapa tidak memakai Redux?

**Jawaban:** Karena state dominan adalah **server state** (data dari API), bukan **global UI state**. TanStack Query sudah handle:
- Caching
- Loading/error state
- Cache invalidation
- Refetch on focus
- Retry

Redux akan menambah boilerplate (actions, reducers, middleware, selectors) untuk fungsionalitas yang sudah disediakan TanStack Query. **Redux cocok untuk global UI state yang kompleks** (misal: multi-step form, real-time collaboration). Aplikasi ini belum butuh itu.

## Q6: Kenapa tidak memakai Context?

**Jawaban:** Context bagus untuk global state yang jarang berubah (misal: theme, locale). Untuk server state yang sering berubah, Context akan menyebabkan **re-render tidak perlu** di seluruh subtree setiap kali data berubah. TanStack Query handle ini dengan lebih efisien — hanya komponen yang subscribe ke query tertentu yang re-render.

## Q7: Kenapa menggunakan Zod? Kenapa bukan Yup atau validasi manual?

**Jawaban:**
- **Lebih kecil** — Zod ~8KB vs Yup ~22KB
- **TypeScript native** — schema bisa infer type
- **Error format konsisten** — `safeParse` return structured error, mudah dipetakan ke field
- **Reusable** — schema bisa dipakai di frontend dan backend (jika isomorphic)
- **Lebih aman** — validasi manual rawan typo, edge case terlewat, atau logic error

## Q8: Kenapa membuat reusable component seperti DataTable, Modal, StatusBadge?

**Jawaban:** DRY dan consistency.
- **4 halaman** menggunakan DataTable dengan struktur identik. Jika setiap halaman punya implementasi tabel sendiri, ada 4× kemungkinan bug
- **Styling konsisten** — semua tabel pakai class yang sama
- **Fitur baru** — jika mau tambah sorting, cukup edit DataTable, semua halaman dapat
- **Testing** — 1 komponen di-test, 4 halaman ter-cover

## Q9: Kenapa memisahkan file API dari UI?

**Jawaban:** Separation of concerns.
- **UI layer** hanya tahu data (array of objects) — tidak tahu HTTP method, endpoint, headers
- **API layer** hanya urus HTTP — tidak tahu JSX, CSS, event handler
- Jika API backend berubah (misal dari Directus ke REST custom), cukup edit `api/` folder
- Memudahkan mocking di test — cukup mock `api/`, tidak perlu mock HTTP

## Q10: Kenapa membuat ConfirmDialog? Kenapa tidak pakai confirm() native?

**Jawaban:**
- `confirm()` native adalah **blocking** — menghentikan semua JavaScript sampai user klik OK/Cancel. Ini UX buruk.
- `confirm()` tidak bisa di-custom style
- `confirm()` tidak bisa menampilkan loading state
- `ConfirmDialog` kita bisa disable tombol selama proses delete berjalan, mencegah double-click

## Q11: Kenapa setiap halaman punya state search, showModal, editItem sendiri?

**Jawaban:** Encapsulation. Setiap halaman independen — state halaman A tidak mempengaruhi halaman B. Ini membuat komponen lebih mudah diprediksi dan di-test. Jika di masa depan salah satu halaman perlu di-refactor, perubahan tidak akan merembet ke halaman lain.

## Q12: Kenapa menggunakan TanStack Query?

**Jawaban:** Karena aplikasi ini didominasi **CRUD operasi** — membaca data dari API, memanipulasi, lalu memperbarui UI. TanStack Query handle:
- **Caching** — tidak perlu fetch ulang jika data belum stale
- **Auto refetch** — invalidate cache setelah mutation → UI otomatis up-to-date
- **Loading/error state** — tanpa boilerplate
- **Retry mechanism** — network glitch tidak langsung error UI

## Q13: Bagaimana cara aplikasi handle error dari server?

**Jawaban:** Ada 3 lapis:
1. **Axios response interceptor** — handle 401 global (token expired → reload)
2. **Mutation `catch`** — extract pesan error dari response body
3. **Zod validation** — cegah data invalid sebelum dikirim ke server

Kombinasi ini memastikan user selalu mendapat feedback yang jelas: validasi error → merah di form, server error → teks merah, network error → "Gagal menyimpan data".

## Q14: Kenapa file di pages/ dipisah jadi 4 (index, list, form, modal)?

**Jawaban:** Modularity dan reusability.
- **index.jsx** — state owner (search, modal state) — bisa diganti dengan routing nanti
- **List.jsx** — hanya menampilkan tabel + search — bisa dipakai di dashboard
- **Form.jsx** — hanya form — bisa dipakai di halaman full-width (bukan modal)
- **Modal.jsx** — wrapper tipis — bisa di-custom stylingnya

Pemisahan ini mengikuti pola **Container-Presentational**. index dan list adalah container (punya state/logic), form dan modal adalah presentational (terima props, render UI).

## Q15: Bagaimana security aplikasi ini?

**Jawaban:**
- ✅ **JWT authentication** — Bearer token di setiap request via interceptor
- ✅ **401 auto-handling** — jika token expired, redirect ke login
- ✅ **Input validation** — Zod mencegah data invalid
- ❌ **Hardcoded credentials** — password ada di source code
- ❌ **No environment variables** — baseURL hardcoded
- ❌ **No CSRF protection** — tidak ada token CSRF (tapi SPA + JWT reduce risk)

**Rekomendasi:** Pindahkan credential ke `.env`, tambahkan refresh token logic, implementasikan rate limiting di frontend untuk form submit.

## Q16: Kenapa ada file schemas.js terpisah dari validate.js?

**Jawaban:** Separation of concerns.
- `schemas.js` = **definisi** (apa yang valid)
- `validate.js` = **eksekusi** (bagaimana menjalankan validasi)

Schema bersifat deklaratif — mendefinisikan aturan bisnis. Helper bersifat imperatif — menjalankan schema dan memformat output. Jika suatu saat mau ganti Zod ke Yup, cukup edit `validate.js`, schema tetap.

## Q17: Bagaimana aplikasi ini scale jika ada 100 entitas?

**Jawaban:** Dengan arsitektur saat ini:
- Tambah 1 entitas: buat folder `pages/NewEntity/` (copy pattern 4 file) + 1 hook file (7 baris) + 1 Zod schema
- Factory pattern sudah handle CRUD
- DataTable, Modal, ConfirmDialog sudah reusable
- **Bottleneck:** Tidak ada pagination — jika data 1000+ baris, render jadi lambat. Juga tidak ada routing — 100 halaman di-stack vertikal tidak feasible.
- **Solusi:** Tambah react-router-dom untuk routing, implementasi server-side pagination di `useList`.

## Q18: Kenapa UserForm punya dropdown Role dan Vehicle padahal tidak ada FK di backend?

**Jawaban:** **Forward compatibility.** Arsitektur frontend sudah siap untuk relasi Role dan Vehicle — form sudah punya dropdown, data fetching sudah jalan. Yang kurang adalah kolom FK di tabel `mt_user_profile` di backend. Dengan begini, ketika backend update, frontend sudah langsung bisa pakai tanpa perubahan kode.

**Resiko:** User bisa memilih Role/Vehicle di dropdown dan tidak ada error, tapi data tidak tersimpan. Ini bisa membingungkan. Sebaiknya tambahkan label "*(coming soon)*" atau disable dropdown dengan tooltip.

## Q19: Bagaimana handle jika 2 user mengedit data yang sama?

**Jawaban:** Saat ini **tidak ada optimistic concurrency control**. Data yang tampil adalah data saat fetch. Jika User A dan User B sama-sama edit Department IT:
1. A fetch → dapat `{ name: "IT" }`
2. B fetch → dapat `{ name: "IT" }`
3. A submit → **PATCH** → berhasil → `{ name: "Information Technology" }`
4. B submit → **PATCH** → **timpa** dengan data B (tanpa tahu A sudah update)

**Solusi:** Implementasi `updated_at` atau version field. Kirim timestamp/version saat update, server cek apakah data sudah berubah sejak fetch.

## Q20: Kenapa ada folder validation/ terpisah?

**Jawaban:** Agar validation logic tidak tersebar di 4 form berbeda. Dengan centralized validation:
- Satu tempat edit aturan bisnis
- Schema bisa direuse oleh komponen lain (misal: admin panel berbeda)
- Jika di masa depan kita migrate ke TypeScript, Zod bisa auto-generate type

## Q21: Kenapa menggunakan `useMemo` untuk search filter?

**Jawaban:** Performance optimization. Tanpa `useMemo`, setiap kali komponen re-render (karena state lain berubah), filter akan dijalankan ulang. `useMemo` memastikan filter hanya dijalankan jika `data` atau `search` berubah.

Ini adalah **micro-optimization** — untuk data kecil (<1000 row) tidak terasa, tapi best practice untuk mencegah future performance issue.

## Q22: Kenapa form pakai `mutateAsync` bukan `mutate`?

**Jawaban:** Karena kita perlu `try/catch` untuk handle error. `mutate` adalah fire-and-forget — tidak mengembalikan Promise. `mutateAsync` return Promise, sehingga kita bisa:
```javascript
try {
  await mutateAsync(payload);  // bisa catch error
  setSuccessMsg('...');
  setTimeout(onSuccess, 1500);
} catch (err) {
  setServerError(err.response?.data?.errors?.[0]?.message);
}
```
Pattern ini memberikan feedback yang lebih baik ke user.

## Q23: Kenapa ada `setTimeout` untuk close modal?

**Jawaban:** UX consideration. Setelah submit sukses, user perlu melihat pesan "berhasil ditambahkan!" sebelum modal tertutup. `setTimeout(onSuccess, 1500)` memberi waktu 1.5 detik untuk membaca pesan. Tanpa ini, modal langsung tertutup dan user mungkin bertanya "apa sudah berhasil?"

## Q24: Kenapa App.jsx tidak menggunakan react-router-dom?

**Jawaban:** Saat ini hanya ada 4 halaman yang semuanya selalu tampil (vertical stack). routing belum diperlukan. Namun, jika ada halaman detail atau dashboard terpisah, react-router-dom harus ditambahkan. Ini adalah **technical debt** yang sadar diambil untuk meminimalkan kompleksitas di awal.

## Q25: Bagaimana process login bekerja?

**Jawaban:**
1. `useAuth()` dipanggil di `App.jsx`
2. Cek localStorage `access_token`
3. Jika ada → set `ready = true` (anggap masih valid)
4. Jika tidak ada → panggil `auth.login()` → POST `/auth/login` dengan credential hardcoded
5. Response → simpan `access_token` di localStorage → set `ready = true`
6. Semua request berikutnya → Axios interceptor inject token ke header Authorization

**Kelemahan:** Tidak ada refresh token. Jika token expired, tidak bisa dapat token baru tanpa relog (yang otomatis direload).

## Q26: Kenapa menggunakan Vite bukan CRA?

**Jawaban:** CRA (Create React App) sudah deprecated dan tidak disarankan untuk project baru. Vite menawarkan:
- **Faster dev server** — hot module replacement instan (esbuild)
- **Faster build** — Rollup-based production build
- **Modern defaults** — ESM by default, TypeScript out of box
- **Smaller config** — minimal boilerplate

## Q27: Bagaimana data flow dari button click sampai UI update?

**Jawaban (Create example):**
1. User klik "Tambah" → `openAdd()` → set `showModal=true`
2. Modal render → Form muncul
3. User isi form → `setField()` update state
4. User klik submit → `handleSubmit()`
5. `validate()` → Zod safeParse
6. `mutateAsync(payload)` → POST API
7. Sukses → `invalidateQueries(['departments'])` → TanStack Query hapus cache
8. List component re-render karena cache invalid → fetch ulang
9. Data baru tampil di tabel → UI update

## Q28: Kenapa menggunakan CSS biasa bukan Tailwind?

**Jawaban:** Project dimulai dari template Vite default (CSS biasa). Migrasi ke Tailwind akan memakan waktu refactor yang signifikan. Untuk ukuran project saat ini (~1900 baris), CSS biasa sudah maintainable. Jika project membesar (>10 halaman), Tailwind akan membantu konsistensi styling.

## Q29: Bagaimana jika ada field baru di tabel Department?

**Jawaban:** Hanya perlu 3 perubahan:
1. `schemas.js` — tambah validasi field baru
2. `AddDepartmentForm.jsx` — tambah input field
3. **Tidak perlu edit hook** — factory sudah generic, mengirim semua field di payload

Ini contoh keuntungan factory pattern: perubahan schema tidak membutuhkan perubahan di lapisan data fetching.

## Q30: Apa yang terjadi jika baseURL backend berubah?

**Jawaban:** Edit 1 file: `src/api/axios.js` baris `baseURL`. Tidak perlu edit komponen, hook, atau file lain. Ini contoh keuntungan separation of concerns — API configuration terpusat.

---

# 16. BEST PRACTICE REVIEW

| Dimensi | Skor | Alasan |
|---------|------|--------|
| **Folder Structure** | 85/100 | Terorganisir per domain, tapi belum ada folder `utils/` atau `constants/` |
| **Naming** | 80/100 | Konsisten, tapi ada variasi `AddDepartmentForm` vs `UserForm` (tidak konsisten prefix) |
| **Reusability** | 90/100 | Factory hook + 4 reusable components. Skor tinggi. |
| **Maintainability** | 85/100 | Kode bersih, 0 lint error. Tapi `STATUS_OPTIONS` duplikasi 4x |
| **Scalability** | 65/100 | Tidak ada pagination, tidak ada routing, tidak ada performance optimization untuk data besar |
| **Performance** | 70/100 | Client-side search OK untuk data kecil. Tidak ada lazy loading, virtual scroll, pagination. |
| **Readability** | 85/100 | Code jelas, nama fungsi deskriptif. Beberapa file (DataTable) padat tapi readable. |
| **Security** | 55/100 | Hardcoded credentials di source code. Tidak ada environment variables. |
| **Validation** | 90/100 | Zod + centralized schemas + reusable helper. Hampir sempurna. |
| **Error Handling** | 80/100 | Server error, validasi, 401 ter-cover. Missing: retry button, global error boundary, toast system. |

**Skor Rata-rata: 78.5/100**

## Area Improvement Prioritas

| Prioritas | Dimensi | Skor | Target |
|-----------|---------|------|--------|
| 🔴 | Security | 55 | 90 — pindah credential ke .env |
| 🔴 | Scalability | 65 | 85 — tambah pagination + routing |
| 🟡 | Performance | 70 | 85 — lazy loading, debounce search |
| 🟡 | Error Handling | 80 | 90 — error boundary + retry button |
| 🟢 | Maintainability | 85 | 95 — shared constants |

---

# 17. KELEBIHAN PROYEK (20 Poin)

1. **Factory pattern** — CRUD hooks generic, kurangi duplikasi 75%
2. **Separation of concerns** — API layer, UI layer, validation layer terpisah rapi
3. **TanStack Query** — caching, invalidate, refetch otomatis — tanpa Redux boilerplate
4. **Zod validation** — schema reusable, error format konsisten, bundle kecil
5. **Reusable components** — DataTable, Modal, StatusBadge, ConfirmDialog dipakai di 4 halaman
6. **0 lint error** — kode bersih, tidak ada dead code setelah final audit
7. **Consistent pattern** — setiap entitas mengikuti struktur 4 file yang sama
8. **Dark theme premium** — glassmorphism, gradient, smooth animation
9. **Loading states everywhere** — auth loading, query loading, mutation pending
10. **Error feedback** — server error, validation error, delete error — semua ada feedback
11. **Empty states** — "Belum ada data" vs "Data tidak ditemukan" (search)
12. **Delete confirmation** — custom modal, bukan `confirm()` native
13. **Success messages** — user dapat konfirmasi setelah create/update/delete
14. **Keyboard accessibility** — Escape tutup modal
15. **Client-side search** — instant filter tanpa request tambahan
16. **Axios interceptor** — token injection otomatis, 401 global handler
17. **Safe error extraction** — chaining optional di `err.response?.data?.errors?.[0]?.message`
18. **Forward compatibility** — UserForm sudah siap untuk Role/Vehicle relation meskipun backend belum
19. **Minimal dependencies** — hanya react, tanstack query, axios, zod — 4 production deps
20. **Feature isolation** — setiap halaman punya state sendiri, tidak ada leak antar komponen

---

# 18. KEKURANGAN PROYEK + SARAN (20 Poin)

| # | Kekurangan | Dampak | Saran Perbaikan |
|---|-----------|--------|-----------------|
| 1 | **Hardcoded credentials** | Security risk — password bocor jika source code di-commit ke publik | Pindah ke `.env` + `.env.example` |
| 2 | **Tidak ada environment variables** | BaseURL, credential hardcoded — tidak bisa bedakan dev/staging/prod | Semua konfigurasi pindah ke `import.meta.env.VITE_*` |
| 3 | **Tidak ada routing** | Semua halaman stack vertikal — tidak scalable untuk >5 halaman | Tambah react-router-dom + layout |
| 4 | **Tidak ada pagination** | Jika data >1000 baris, render lambat + network payload besar | Implementasi server-side pagination via `offset`/`limit` params |
| 5 | **STATUS_OPTIONS duplikasi** | Diulang di 4 file — jika ada perubahan, harus edit 4 file | Pindah ke `validation/constants.js` |
| 6 | **Tidak ada error boundary** | Jika 1 komponen crash, seluruh app bisa blank | Implementasi React Error Boundary di App |
| 7 | **Tidak ada toast system** | Feedback hanya muncul inline — bisa terlewat jika user scroll | Tambah library react-hot-toast atau buat custom toast |
| 8 | **Tidak responsive** | Tampilan rusak di mobile atau layar kecil | Tambah media queries min-width/max-width |
| 9 | **Token tidak di-refresh** | Setelah token expired, force reload — user bisa kehilangan input | Implementasi refresh token flow |
| 10 | **Tidak ada debounce di search** | Setiap ketukan trigger useMemo recompute (minor, untuk data kecil tidak masalah) | Tambah `useDebounce` hook |
| 11 | **No automatic focus** | Saat modal terbuka, kursor tidak otomatis ke input pertama | Tambah `autoFocus` di input pertama + `useEffect` focus trap |
| 12 | **UserForm relation tidak functional** | Role & Vehicle dropdown tampil tapi data tidak tersimpan | Tambah label "*(segara hadir)*" atau disable sementara |
| 13 | **Tidak ada skeleton loading** | Loading hanya teks "Memuat data..." — UX bisa ditingkatkan | Ganti dengan skeleton component (CSS shimmer) |
| 14 | **No TypeScript** | Tidak ada type safety — runtime error lebih mungkin terjadi | Migrasi ke TypeScript, manfaatkan Zod type inference |
| 15 | **No testing** | Tidak ada unit test / integration test | Tambah Vitest + React Testing Library |
| 16 | **No CI/CD** | Tidak ada lint/build otomatis | Tambah GitHub Actions — lint on push, build on PR |
| 17 | **No Docker** | Environment tidak reproducible | Tambah Dockerfile + docker-compose.yml |
| 18 | **`useUsers.js` queryKey mismatch risk** | factory dan custom override harus pakai key sama — rawan bug | Dokumentasi dependency atau refactor factory untuk support custom fetch |
| 19 | **Tidak ada sort/filter server-side** | Semua filter client-side — tidak efisien untuk data besar | Tambah query params `sort`, `filter` |
| 20 | **No accessibility audit** | Skip-link, focus visible, aria-label belum optimal | Gunakan axe-core atau Lighthouse untuk audit aksesibilitas |

---

# 19. REKOMENDASI

## Immediate (High Priority)
1. Pindahkan credential ke `.env`
2. Tambah error boundary
3. Fix `STATUS_OPTIONS` jadi shared constant

## Short Term (Next Sprint)
4. Tambah react-router-dom + layout
5. Implementasi server-side pagination di TanStack Query
6. Responsive design (media queries)
7. Debounce search

## Medium Term (Next Month)
8. Migrasi ke TypeScript
9. Tambah unit test (Vitest + RTL)
10. Refresh token mechanism
11. Skeleton loading components

## Long Term
12. CI/CD pipeline
13. Docker
14. Accessibility audit + fix
15. Migrasi CSS ke Tailwind (opsional, jika project membesar)

---

# 20. SCRIPT PRESENTASI 10 MENIT

> *"Selamat pagi. Saya akan mempresentasikan project frontend CRUD Master Data yang sudah saya kerjakan. Project ini adalah Single Page Application berbasis React 19 untuk mengelola data master — Department, Role, Vehicle, dan User — yang terhubung ke Datacore backend."*

---

## Menit 1-2: Arsitektur

> *"Arsitektur project ini dibagi menjadi 4 lapisan utama:
>
> **Lapisan API** — file `axios.js` dan `auth.js` mengatur semua komunikasi HTTP. Ada interceptor untuk inject token JWT otomatis ke setiap request, dan 401 handler global.
>
> **Lapisan Hooks** — menggunakan TanStack Query untuk manajemen server state. Saya buat factory pattern `useCrud.js` yang menghasilkan 4 CRUD hooks dari 1 konfigurasi. Ini mengurangi duplikasi hingga 75%.
>
> **Lapisan Validasi** — Zod dengan 4 schema terpusat di `validation/schemas.js`. Data divalidasi sebelum dikirim ke server.
>
> **Lapisan UI** — komponen reusable: DataTable, Modal, StatusBadge, ConfirmDialog. Setiap entitas mengikuti pola 4 file yang konsisten."*

---

## Menit 3-4: Data Flow

> *"Flow aplikasi sederhana. User buka halaman → useAuth() memastikan token JWT valid → 4 halaman dirender secara vertikal.
>
> Setiap halaman: fetch data via TanStack Query → cache → tampilkan di DataTable. User bisa search client-side untuk filter data.
>
> CRUD flow: form → validasi Zod → Axios (dengan Bearer token) → API → sukses → invalidate cache → list refetch otomatis. User mendapat feedback di setiap tahap."*

---

## Menit 5-6: Component & Reusability

> *"Saya membuat 4 reusable component yang dipakai di semua halaman:
>
> 1. **DataTable** — menerima array columns sebagai konfigurasi. Setiap kolom punya key, label, dan render function optional. Handle loading, error, empty state secara built-in.
>
> 2. **Modal** — generic overlay dengan Escape listener dan overlay click-to-close.
>
> 3. **ConfirmDialog** — komposisi dari Modal + tombol konfirmasi. Menggantikan `confirm()` native yang blocking.
>
> 4. **StatusBadge** — badge berwarna berdasarkan status.
>
> Setiap entitas mengikuti pola yang sama: index.jsx (state owner), List.jsx (tabel), Form.jsx (form dengan validasi), Modal.jsx (wrapper)."*

---

## Menit 7-8: Key Technical Decisions

> *"Beberapa keputusan teknis yang saya ambil:
>
> **TanStack Query vs Redux** — Karena 90% state adalah server state, TanStack Query lebih tepat. Caching, invalidate, retry — built-in. Tidak perlu boilerplate Redux.
>
> **Zod vs Yup vs Manual** — Zod paling kecil (8KB), TypeScript-native, error format konsisten. Schema menjadi single source of truth validasi.
>
> **Factory Pattern untuk CRUD** — 4 entitas dengan CRUD identik. Tanpa factory, 16 hooks manual. Dengan factory, 1 file + 4 file pendek. Bug fix cukup di 1 tempat.
>
> **Relation vs String** — Data master menggunakan foreign key, bukan string. Rename department cukup sekali, semua user otomatis mengikuti."*

---

## Menit 9: Security & Error Handling

> *"Untuk security: JWT dikirim via header Authorization otomatis. Jika 401, sistem force reload untuk login ulang.
>
> Untuk error handling: ada 3 lapis. Validasi Zod mencegah data invalid. Catch di mutation menampilkan server error. Axios interceptor handle 401 global.
>
> Setiap komponen punya loading state, error state, dan empty state. User tidak akan melihat layar kosong tanpa feedback."*
> 
> *(Catat: credential masih hardcoded — ini sudah saya catat sebagai technical debt untuk diperbaiki di sprint berikutnya.)*

---

## Menit 10: Review & Next Steps

> *"Project size: 33 file, ~1900 baris, 0 lint error. Skor maturity 78.5/100.
>
> **Kelebihan utama:** Kode bersih, reusable component, factory pattern, validasi terpusat.
>
> **Yang perlu diperbaiki:** Credential ke .env, pagination, responsive design, error boundary, testing.
>
> **Kesimpulan:** Project ini adalah fondasi solid yang siap dikembangkan. Arsitekturnya sudah benar — separation of concerns, DRY, reusable. Fokus ke depan adalah security hardening, performance optimization, dan testing.
>
> Terima kasih. Saya siap menjawab pertanyaan."
>

---

# LAMPIRAN: Diagram Flow Keseluruhan

```
┌──────────────────────────────────────────────────────────┐
│                     BROWSER (SPA)                         │
│                                                          │
│  ┌──────────┐    ┌────────────────────────────────────┐  │
│  │ main.jsx │    │         QueryClientProvider         │  │
│  └────┬─────┘    │         TanStack Query              │  │
│       │          └──────────────────┬─────────────────┘  │
│       ▼                             │                    │
│  ┌──────────┐                       │                    │
│  │ App.jsx  │──useAuth()──►ready?   │                    │
│  └────┬─────┘                       │                    │
│       │                            │                    │
│  ┌────┴────────────────────────┐   │                    │
│  │ 4 Pages (stack vertikal)    │   │                    │
│  │                             │   │                    │
│  │ ┌─────────────────────┐     │   │                    │
│  │ │ DepartmentPage      │     │   │                    │
│  │ │ ├─ DepartmentList ──┼─────┼───┼──useList()─────────┤
│  │ │ │  DataTable        │     │   │    │               │
│  │ │ │  ConfirmDialog    │     │   │    ▼               │
│  │ │ ├─ DepartmentModal  │     │   │  Axios + Bearer    │
│  │ │ │  AddDeptForm      │     │   │    │               │
│  │ │ │   Zod validation  │     │   │    ▼               │
│  │ └─────────────────────┘     │   │  REST API          │
│  │                             │   │    │               │
│  │ ┌─────────────────────┐     │   │    ▼               │
│  │ │ RolePage            │     │   │  Directus/Datacore │
│  │ │ ─── (identik) ───   │     │   │    │               │
│  │ └─────────────────────┘     │   │    ▼               │
│  │                             │   │  JSON Response     │
│  │ ┌─────────────────────┐     │   │    │               │
│  │ │ VehiclePage         │     │   │    ▼               │
│  │ │ ─── (identik) ───   │     │   │  TanStack Cache    │
│  │ └─────────────────────┘     │   │    │               │
│  │                             │   │    ▼               │
│  │ ┌─────────────────────┐     │   │  UI Re-render      │
│  │ │ UserPage            │     │   │                    │
│  │ │ ├─ UserList         │     │   │                    │
│  │ │ ├─ UserForm         │     │   │                    │
│  │ │ │  + Dept dropdown  │     │   │                    │
│  │ │ │  + Role dropdown  │     │   │                    │
│  │ │ │  + Vehicle dropdown│    │   │                    │
│  │ └─────────────────────┘     │   │                    │
│  └─────────────────────────────┘   │                    │
│                                    │                    │
│  ┌─────────────────────────────────┴──────┐             │
│  │         Zod Validation Layer            │             │
│  │  schemas.js  +  validate.js             │             │
│  └─────────────────────────────────────────┘             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```
