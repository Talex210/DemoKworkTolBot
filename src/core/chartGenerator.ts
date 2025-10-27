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
        .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.rate) as number, d3.max(data, d => d.rate) as number])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickFormat((domainValue: Date | d3.NumberValue) => {
                return d3.timeFormat('%b %d')(domainValue as Date);
            })
            .tickSizeOuter(0))
        .call((g: any) => g.selectAll('text').style('fill', '#333333'))
        .call((g: any) => g.selectAll('line').style('stroke', '#333333'));

    const yAxis = (g: any) => g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g: any) => g.select('.domain').remove())
        .call((g: any) => g.selectAll('text').style('fill', '#333333'))
        .call((g: any) => g.selectAll('line').style('stroke', '#333333'))
        .call((g: any) => g.selectAll('.tick line')
            .clone()
            .attr('x2', width - margin.left - margin.right)
            .attr('stroke-dasharray', '2,2')
            .attr('stroke-opacity', 0.3));

    const line = d3.line<ChartData>()
        .x(d => x(new Date(d.timestamp)))
        .y(d => y(d.rate));

    svg.append('g')
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    // Define the gradient
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'line-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', y(d3.min(data, d => d.rate) as number))
        .attr('x2', 0).attr('y2', y(d3.max(data, d => d.rate) as number));

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#0EA5E9') // Line color
        .attr('stop-opacity', 0);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#0EA5E9') // Line color
        .attr('stop-opacity', 0.5);

    const area = d3.area<ChartData>()
        .x(d => x(new Date(d.timestamp)))
        .y0(height - margin.bottom)
        .y1(d => y(d.rate));

    svg.append('path')
        .datum(data)
        .attr('fill', 'url(#line-gradient)')
        .attr('d', area);

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#0EA5E9')
        .attr('stroke-width', 2)
        .attr('d', line);

    const svgString = body.html();

    return sharp(Buffer.from(svgString)).png().flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } }).toBuffer();
}
