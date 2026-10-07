import { Elysia } from "elysia";

const mahasiswa = [
    {
        id: 1,
        nama: "Hyunjin",
        email: "hyunjin@example.com",
        jurusan: "Teknik Informatika"
    },
    {
        id: 2,
        nama: "Han",
        email: "han@example.com",
        jurusan: "Manajemen Informatika"
    },
    {
        id: 3,
        nama: "Lino",
        email: "lino@example.com",
        jurusan: "Teknik Informatika"
    }
];

export const mahasiswaRoute = new Elysia({
    prefix: "/mahasiswa"
})
    // GET BY ID
    .get("/:id", ({ params }) => {
        const data = mahasiswa.find(m => m.id === parseInt(params.id));
        if (data) return data;
        return { error: "Mahasiswa tidak ditemukan!" };
    })

    // POST
    .post("/", ({ body }) => {
        if (body) {
            return { message: "Data berhasil ditambahkan!", data: body };
        }
        return { error: "Tidak ada data yang masuk.." };
    })

    // PUT (Update keseluruhan data)
    .put("/:id", ({ params, body }) => {
        const id = parseInt(params.id);
        const index = mahasiswa.findIndex(m => m.id === id);
        if (index !== -1) {
            return { message: `Data mahasiswa ID ${id} berhasil diperbarui (PUT)`, data: body };
        }
        return { error: "Mahasiswa tidak ditemukan.." };
    })

    // PATCH (Update sebagian data)
    .patch("/:id", ({ params, body }) => {
        const id = parseInt(params.id);
        const index = mahasiswa.findIndex(m => m.id === id);
        if (index !== -1) {
            return { message: `Data mahasiswa ID ${id} berhasil diperbarui sebagian (PATCH)`, data: body };
        }
        return { error: "Mahasiswa tidak ditemukan.." };
    })

    // DELETE (Hapus data)
    .delete("/:id", ({ params }) => {
        const id = parseInt(params.id);
        const index = mahasiswa.findIndex(m => m.id === id);
        if (index !== -1) {
            return { message: `Mahasiswa dengan ID ${id} berhasil dihapus` };
        }
        return { error: "Mahasiswa tidak ditemukan.." };
    })

    // CONNECT (Metode HTTP CONNECT)
    .connect("/", () => {
        return { message: "Koneksi CONNECT berhasil dibangun" };
    });