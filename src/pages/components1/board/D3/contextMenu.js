import * as d3 from "d3";
import styles from "./contextMenu.css";
import { config } from '../../../../CONFIG';

export const menuFactory = (x, y, menuItems, data, svgId) => {
    d3.select(`.contextMenu`).remove();

    // Draw the menu
    d3.select(svgId)
        .append('g')
        .attr('class', 'contextMenu')
        .style("opacity", 1)
        .style("fill", '#ffffff')
        .style("stroke", '#00557d')
        .selectAll('tmp')
        .data(menuItems)
        .enter()
        .append('g')
        .attr('class', 'menuEntry')
        .style({ 'cursor': 'pointer' });

    // Draw menu entries
    d3.selectAll(`.menuEntry`)
        .append('rect')
        .attr('x', x)
        .attr('y', (d, i) => { return y + (i * 30); })
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('width', 150)
        .attr('height', 30)
        .style("opacity", 0.5)
        .on('click', (d) => { d.action(data) });

    d3.selectAll(`.menuEntry`)
        .append('text')
        .text((d) => { return d.title; })
        .attr('x', x - 10)
        .attr('y', (d, i) => { return y + (i * 30); })
        .attr('dy', 20)
        .attr('dx', 45)
        .attr("font-size", '12px')
        .style("opacity", 1)
        .style("stroke", '#00557d')
        .on('click', (d) => { d.action(data) });

    // Other interactions
    d3.select('body')
        .on('click', () => {
            d3.select(`.contextMenu`).remove();
        });
}

export const createContextMenu = (d, x, y, menuItems, width, height, svgId) => {
  menuFactory(x, y, menuItems, d, svgId);
  d3.event.preventDefault();
}