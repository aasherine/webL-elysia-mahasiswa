import { resolve } from "bun";

function proses(waktu: number, kegiatan: string): void{
    const start = Date.now();

    while (Date.now() - start < waktu){
    }
    console.log(`${kegiatan} selesai`);
}
const waktuMulai = Date.now();
console.log("Mulai Proses")
console.log("=========================")
proses(2, "Jus Jambu");
proses(15, "Nasi Goreng");
//proses(30, "Sate Kambing");
console.log(`Total Waktu Proses: ${(Date.now() - waktuMulai) / 1000} detik`);

//ASYNCRONUS
function prosesAsync(waktu: number, kegiatan: string) Promise<void> {
    return ner Promise((resolve) => {
        console.log(`Mulai proses ${kegiatan}`);
        setTimeout(() => {
            console.log(`${kegiatan} selesai`);
            resolve();
        }, waktu * 1000);
    })
}

const waktuMulai = Date.now();
await Promise.all([
    prosesAsync(2, "Jus Jambu");
    prosesAsync(15, "Nasi Goreng");
    prosesAsync(30, "Sate Kambing");
])
console.log(`Total Waktu Proses: ${(Date.now() waktuMulai) / 1000} detik`);