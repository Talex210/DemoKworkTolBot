import axios from 'axios';

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

interface MarketChartRangeResponse {
    prices: [number, number][]; // [timestamp, price]
    market_caps: [number, number][];
    total_volumes: [number, number][];
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
