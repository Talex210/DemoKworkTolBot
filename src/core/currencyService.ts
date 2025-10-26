import axios from 'axios';

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

interface MarketChartRangeResponse {
    prices: [number, number][]; // [timestamp, price]
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export async function pingApi(): Promise<boolean> {
    try {
        const apiKey = process.env.COINGECKO_DEMO_API_KEY;
        const url = `${COINGECKO_API_BASE_URL}/ping`;
        const params: { x_cg_demo_api_key?: string } = {};
        if (apiKey) {
            params.x_cg_demo_api_key = apiKey;
        }
        const response = await axios.get(url, { params });
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
        const response = await axios.get<MarketChartRangeResponse>(
            `${COINGECKO_API_BASE_URL}/coins/${coinId}/market_chart/range`,
            {
                params: {
                    vs_currency: vsCurrency,
                    from: fromTimestamp,
                    to: toTimestamp,
                },
            }
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
        const apiKey = process.env.COINGECKO_DEMO_API_KEY;
        const params: { ids: string; vs_currencies: string; x_cg_demo_api_key?: string } = {
            ids: 'bitcoin',
            vs_currencies: 'usd,rub',
        };

        if (apiKey) {
            params.x_cg_demo_api_key = apiKey;
        }

        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params,
        });

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
