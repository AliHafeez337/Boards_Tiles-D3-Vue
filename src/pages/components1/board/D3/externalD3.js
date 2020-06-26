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

export const createContextMenu = (d, x, y, menuItems, svgId) => {
  menuFactory(x, y, menuItems, d, svgId);
  d3.event.preventDefault();
}

export const filter = (svg) => {
  // Copied from http://bl.ocks.org/cpbotha/5200394

  // filters go in defs element
  var defs = svg.append("defs");

  // create filter with id #drop-shadow
  // height=130% so that the shadow is not clipped
  var filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");

  // SourceAlpha refers to opacity of graphic that this filter will be applied to
  // convolve that with a Gaussian with standard deviation 3 and store result
  // in blur
  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 5)
      .attr("result", "blur");

  // translate output of Gaussian blur to the right and downwards with 2px
  // store result in offsetBlur
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 5)
      .attr("dy", 5)
      .attr("result", "offsetBlur");

  // overlay original SourceGraphic over translated blurred opacity by using
  // feMerge filter. Order of specifying inputs is important!
  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
}