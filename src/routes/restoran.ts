export interface MenuItem {
    id: number;
    name: string;
    price: number;
    prepTime: number;
}

export type OrderStatus = 'Pending' | 'Cooking' | 'Ready' | 'Delivered';

export interface Order {
    orderId: string;
    items: MenuItem[];
    totalPrice: number;
    status: OrderStatus;
}

//perhitungan total harga semua pesanan
export function calculateTotal(items: MenuItem[]): number {
    return items.reduce((total, item) => total + item.price, 0);
}

//pemeriksaan apakah semua menu yang dipesan memang tersedia di daftar menu
export function validateOrder(items: MenuItem[], menuList: MenuItem[]): boolean {
    if (items.length === 0) return false;
    return items.every((item) => menuList.some((menuItem) => menuItem.id === item.id));
}

//masak pesanan, durasi = total prepTime item
export function cookFood(order: Order): Promise<Order> {
    return new Promise((resolve, reject) => {
        const totalPrepTime = order.items.reduce((total, item) => total + item.prepTime, 0);

        setTimeout(() => {
           const isFailed = Math.random() < 0.1;
           if (isFailed) {
            reject(new Error('[${order.orderId}] Gagal memasak: Bahan habis!'));
           } else {
            order.status = 'Ready';
            resolve(order);
           }
        }, totalPrepTime);
    });
}

//pengiriman pesanan
export function deliverOrder(orderId: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Pesanan ${orderId} berhasil diantar ke alamat tujuan :)`);
        }, 2000);
    });
}

export async function processOrder(
    orderId: string,
    orderedItems: MenuItem[],
    menuList: MenuItem[]
): Promise<Order | null> {
    console.log(`\n--- Memproses Pesanan ${orderId} ---`);

//validasi pesanan secara sinkron
const isValid = validateOrder(orderedItems, menuList);
if (!isValid) {
    console.error('Error: Pesanan ${orderId} tidak valid! Item tidak tersedia di menu :(');
    return null;
}

//hitung total harga secara sinkron
const totalPrice = calculateTotal(orderedItems);

//mengambil nama items
const itemNames = orderedItems.map((item) => item.name).join(',');

//buat objek order sama cetak status awal
const order: Order = {
    orderId,
    items: orderedItems,
    totalPrice,
    status: 'Pending',
};

console.log(`Item dipesan : ${itemNames}`);
console.log(`Status [${order.orderId}]: ${order.status} | Total: Rp${order.totalPrice}`);

try {
    //masak secara asinkron
    order.status = 'Cooking';
    console.log(`Status [${order.orderId}]: ${order.status}...`);

    const cookedOrder = await cookFood(order);
    console.log(`Status [${cookedOrder.orderId}]: ${cookedOrder.status}`);

    //kirim makanan secara asinkron
    const deliveryMessage = await deliverOrder(cookedOrder.orderId);

    //cetak pesan akhir kalau udah selesai dikirim
    cookedOrder.status = 'Delivered';
    console.log(deliveryMessage);
    console.log(`Status Akhir [${cookedOrder.orderId}]: ${cookedOrder.status}`);

    return cookedOrder;
  } catch (error) {
    if (error instanceof Error) {
        console.error(`Status [${order.orderId}]: Gagal - ${error.message}`);
    }else {
        console.error(`Status [${order.orderId}]: Oops! Terjadi kesalahan yang tidak diketahui`);
    }
    return null;
  }
}

//concurrent processing
export async function processMultipleOrdersConcurrently(
    ordersData: { orderId: string; items: MenuItem[] }[],
    menuList: MenuItem[]
): Promise<void> {
    console.log('\n===============================');
    console.log('   MEMPROSES 3 PESANAN SEKALIGUS   ');
    console.log('\n===============================');

    const startTime = Date.now();

//mulai semua proses bersamaan
    const orderPromises = ordersData.map((data) => 
        processOrder(data.orderId, data.items, menuList).then((result) => {
            const duration = Date.now() - startTime;
            return {result, duration, orderId: data.orderId};
        })
    );

    //proses pakai Promise.all
    const results = await Promise.all(orderPromises);

    //tentuin pesanan mana yang selesai lebih cepat
    const successfulOrders = results.filter(
        (item): item is { result: Order; duration: number; orderId: string } => item.result !== null
    );

    if (successfulOrders.length > 0) {
        successfulOrders.sort((a, b) => a.duration - b.duration);
        const fastest = successfulOrders[0];
        if (fastest) {
            console.log(`\n HASIL EKSEKUSI TERCEPAT:`);
            console.log(`Pesanan ${fastest.orderId} selesai paling cepat dalam waktu ${fastest.duration} ms.`);
        }
    }
}

//data dummy
const menu: MenuItem[] = [
    { id: 1, name: `Nasi Goreng`, price: 25000, prepTime: 3000 },
    { id: 2, name: `Nasi Goreng Seafood`, price: 35000, prepTime: 3500 },
    { id: 3, name: `Nasi Goreng Campur`, price: 30000, prepTime: 4000 },
];

//pengujian tunggal
async function runSingleTest(): Promise<void> {
    const item1 = menu[0];
    const item2 = menu[1];

    if (item1 && item2) {
        await processOrder('ORD-001', [item1, item2], menu);
    }
}

//pengujian concurrent
async function runConcurrentTest(): Promise<void> {
    const item1 = menu[0];
    const item2 = menu[1];
    const item3 = menu[2];

    if (item1 && item2 && item3) {
        const multipleOrders = [
            { orderId: 'ORD-101', items: [item2]},
            { orderId: 'ORD-102', items: [item1, item2]},
            { orderId: 'ORD-103', items: [item3]},
        ];

        await processMultipleOrdersConcurrently(multipleOrders, menu);
    }
}

//pengujian
async function main(): Promise<void> {
    await runSingleTest();
    await runConcurrentTest();
}

main();