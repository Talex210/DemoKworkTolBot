import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

interface ChartData {
    timestamp: number;
    rate: number;
}

export async function generateChart(data: ChartData[]): Promise<Buffer> {
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const { window } = new JSDOM('');
    const body = d3.select(window.document.body);

    const svg = body.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'white');

    const x = d3.scaleUtc()
        .domain(d3.extent(data, d => new Date(d.timestamp * 1000)) as [Date, Date])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.rate) as number, d3.max(data, d => d.rate) as number])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = (g: any) => g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g: any) => g.select('.domain').remove());

    const line = d3.line<ChartData>()
        .x(d => x(new Date(d.timestamp * 1000)))
        .y(d => y(d.rate));

    svg.append('g')
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

    const svgString = body.html();

    return sharp(Buffer.from(svgString)).png().toBuffer();
}
