import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

if (API_KEY) {
    console.log(`[currencyService] API Key Found. Starts with: ${API_KEY.substring(0, 5)}...`);
} else {
    console.log('[currencyService] API Key Not Found. Using public access.');
}

/**
 * Appends the API key to the request parameters if it exists.
 * @param params The original URLSearchParams object.
 * @returns The updated URLSearchParams object.
 */
function withApiKey(params: URLSearchParams): URLSearchParams {
    if (API_KEY) {
        params.append('x_cg_demo_api_key', API_KEY);
    }
    return params;
}

interface MarketChartRangeResponse {
    prices: [number, number][]; // [timestamp, price]
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export async function pingApi(): Promise<boolean> {
    try {
        let url = `${COINGECKO_API_BASE_URL}/ping`;
        if (API_KEY) {
            url += `?x_cg_demo_api_key=${API_KEY}`;
        }
        const response = await axios.get(url);
        return response.status === 200;
    } catch (error) {
        console.error('Error pinging CoinGecko API:', error);
        return false;
    }
}

export async function getHistoricalCryptoPrices(
    coinId: string,
    vsCurrency: string,
    fromTimestamp: number,
    toTimestamp: number
): Promise<[number, number][]> {
    try {
        const params = withApiKey(new URLSearchParams({
            vs_currency: vsCurrency,
            from: fromTimestamp.toString(),
            to: toTimestamp.toString(),
        }));

        const response = await axios.get<MarketChartRangeResponse>(
            `${COINGECKO_API_BASE_URL}/coins/${coinId}/market_chart/range?${params}`
        );
        return response.data.prices;
    } catch (error) {
        console.error('Error fetching historical crypto prices:', error);
        throw new Error('Could not fetch historical crypto prices.');
    }
}

// Helper to get timestamp for N days ago
export function getTimestampNDaysAgo(days: number): number {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return Math.floor(date.getTime() / 1000); // Convert to seconds
}

// Helper to get current timestamp
export function getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000); // Convert to seconds
}

export async function getUsdRubRate(): Promise<number> {
    try {
        const params = withApiKey(new URLSearchParams({
            ids: 'bitcoin',
            vs_currencies: 'usd,rub',
        }));

        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?${params}`
        );

        const data = response.data;
        const usdPrice = data.bitcoin.usd;
        const rubPrice = data.bitcoin.rub;

        if (usdPrice && rubPrice) {
            return rubPrice / usdPrice;
        } else {
            throw new Error('Could not retrieve valid price data.');
        }
    } catch (error) {
        console.error('Error fetching USD/RUB rate:', error);
        throw new Error('Could not fetch USD/RUB rate.');
    }
}
