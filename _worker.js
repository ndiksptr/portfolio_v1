/**
 * Cloudflare Pages Advanced Mode Worker (_worker.js)
 * Menangani endpoint /api/chat untuk AI Chatbot Gemini 1.5 Flash
 * dan meneruskan aset statis lainnya ke env.ASSETS.
 *
 * Kompatibel dengan:
 * 1. Cloudflare Pages Git deployments
 * 2. Cloudflare Pages Direct Upload (drag & drop / CLI)
 */

const SYSTEM_PROMPT = `
Kamu adalah asisten AI virtual pada website portfolio resmi Andika Saputra (ndiksptr.my.id).

Tugas dan Sikap:
- Jawab pertanyaan pengunjung secara ramah, profesional, ringkas, dan jelas dalam Bahasa Indonesia (atau sesuai bahasa penanya).
- Jangan mengaku sebagai Andika, melainkan sebagai "Asisten Virtual Andika".
- Jangan pernah mengarang informasi yang tidak ada. Jika ditanya hal di luar data profil Andika, sampaikan secara sopan bahwa informasi tersebut belum tercantum dan sarankan untuk menghubungi Andika langsung via email ndiksptr159@gmail.com atau LinkedIn.

Data Profil Lengkap Andika Saputra untuk Rujukan Jawabanmu:
1. Biodata:
   - Nama: Andika Saputra
   - Status: Mahasiswa aktif Manajemen Informatika di Politeknik LP3I Jakarta (2024 - Sekarang, IPK: 3.72 / 4.00).
   - Sekolah Sebelumnya: SMK Negeri 7 Jakarta jurusan Teknik Komputer dan Jaringan (2021 - 2024, nilai rata-rata 86.01).
   - Minat / Keahlian: Web Development, Administrasi Server & Jaringan, Database Administrator, dan Administrasi Dokumen.
   - Kontak: Email ndiksptr159@gmail.com, GitHub https://github.com/ndiksptr, LinkedIn https://www.linkedin.com/in/ndik15.

2. Pengalaman Kerja & PKL:
   - PT IP Network Solusindo (Desember 2022 - April 2023) sebagai Junior System Engineer (PKL):
     • Mengimplementasikan 200 server Hadoop di TTC Telkomsel BSD dan 10 server FTP di TTC Telkomsel Simatupang.
     • Melakukan unboxing, staging, mounting, instalasi OS, dokumentasi QC, serta instalasi dan manajemen iDRAC.
   - Madina Islamic School (September 2022 - Desember 2022) sebagai Staff IT (PKL):
     • Pemeliharaan jaringan LAN/WiFi, backup rutin software/komputer, pembaruan OS staf sekolah, perbaikan hardware printer, dan perakitan kabel UTP straight.

3. Sertifikasi Resmi BNSP:
   - Database Administrator (2026) — BNSP: Operasi CRUD, relasi database, View, Stored Procedure, Trigger, dan optimasi query SQL.
   - Tenaga Operator Komputer (2025) — BNSP: Dokumen resmi massal (Mail Merge MS Word), rumus statistik/IF di Excel, dan presentasi MS PowerPoint.
   - Teknik Komputer dan Jaringan Level II (2024) — BNSP: Konfigurasi MikroTik RouterOS (Internet Gateway, DHCP, NAT, Wireless), instalasi jaringan LAN, dan perawatan PC.

4. Proyek yang Pernah Dikembangkan:
   - ReadOnl1ne (Web App): Website e-commerce buku digital dengan konsep MVC CodeIgniter 4 (PHP, HTML, CSS, Bootstrap). Lengkap dengan katalog, pencarian, dan dashboard admin.
   - E-Warkas (Sistem Informasi): Sistem Point of Sale (kasir) warung sederhana untuk manajemen stok barang dan laporan penjualan.
   - FAMS (Sistem Informasi): Sistem procurement dan Fixed Assets Management untuk pengadaan dan registrasi aset.
   - Apotek Berkat (Desain UI): Desain UI/UX aplikasi apotek dan konsultasi dokter yang dirancang di Figma.
   - Undangan Khitanan (Desain Undangan): Desain grafis undangan digital.

5. Organisasi:
   - LP3I Computer Club (LCC): Bendahara (mengelola dan merekap kas organisasi).
   - Kesatuan Mahasiswa Islam LP3I (KAMIL): Humas (dokumentasi kegiatan dan publikasi informasi).
`;

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

async function handleChat(request, env) {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed. Gunakan POST." }, 405);
    }

    if (!env.GEMINI_API_KEY) {
        return jsonResponse(
            { error: "API key Gemini belum dikonfigurasi di Cloudflare Environment Variables (GEMINI_API_KEY)." },
            500
        );
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: "Format JSON tidak valid." }, 400);
    }

    let message = "";
    if (typeof body.message === "string" && body.message.trim()) {
        message = body.message.trim();
    } else if (Array.isArray(body.messages) && body.messages.length > 0) {
        const lastUserMsg = [...body.messages].reverse().find((m) => m.role === "user");
        if (lastUserMsg && typeof lastUserMsg.content === "string") {
            message = lastUserMsg.content.trim();
        }
    }

    if (!message) {
        return jsonResponse({ error: "Pesan tidak boleh kosong." }, 400);
    }

    if (message.length > 2000) {
        return jsonResponse({ error: "Pesan maksimal 2000 karakter." }, 400);
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": env.GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: message }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 600,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text().catch(() => "");
            console.error("Gemini API error:", response.status, errText);
            return jsonResponse(
                {
                    error:
                        response.status === 429
                            ? "Permintaan sedang ramai. Coba lagi dalam beberapa saat."
                            : "Layanan AI sedang tidak dapat diakses.",
                },
                response.status === 429 ? 429 : 502
            );
        }

        const result = await response.json();
        const reply = result.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("")
            .trim();

        if (!reply) {
            return jsonResponse({ error: "AI tidak menghasilkan balasan." }, 502);
        }

        return jsonResponse({ reply });
    } catch (err) {
        console.error("Fetch Gemini error:", err);
        return jsonResponse({ error: "Gagal memproses jawaban AI." }, 502);
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/chat" || url.pathname === "/api/chat/") {
            return handleChat(request, env);
        }

        // Meneruskan request file statis (HTML, CSS, JS, Gambar, dsb)
        return env.ASSETS.fetch(request);
    },
};
