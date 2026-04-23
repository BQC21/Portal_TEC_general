
const BASE_URL = "https://api.frankfurter.dev";

export async function exchange_rate(price_base: string, price_quote: string): Promise<number> {
    const path = `/v2/rates?base=${price_base}&quotes=${price_quote}`;
    const response = await fetch(BASE_URL + path);
    const data = await response.json();
    const exchange_rate = (data[0].rate).toFixed(2);
    return parseFloat(exchange_rate);
}