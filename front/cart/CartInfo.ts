
interface CartRow {
    id: string,
    price: number
    quantity: number
}

export default interface CartInfo {
    rows: CartRow[],
    totalDiscount: number,
    total: number
}
