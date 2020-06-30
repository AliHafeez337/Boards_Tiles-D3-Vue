import * as d3 from "d3";
import styles from "./contextMenu.css";
import { config } from '../../../../CONFIG';

export const menuFactory = (x, y, menuItems, data, svgId, _this) => {
    d3.select(`.contextMenu`).remove();

    // Draw the menu
    d3.select(svgId)
        .append('g')
        .attr('class', 'contextMenu')
        .style("opacity", config.whole_context_oppacity)
        .style("fill", config.context_background_color)
        .style("stroke", config.context_border)
        .selectAll('tmp')
        .data(menuItems)
        .enter()
        .append('g')
        .attr('class', 'menuEntry')
        .style({ 'cursor': 'pointer' });

    // Draw menu entries
    d3.selectAll(`.menuEntry`)
        .append('rect')
        .attr('x', +x + config.context_menu_x)
        .attr('y', (d, i) => y + (i * 30) + config.context_menu_y)
        .attr('rx', config.context_menu_rounded_x)
        .attr('ry', config.context_menu_rounded_y)
        .attr('width', config.context_menu_width)
        .attr('height', config.context_menu_height)
        .style("opacity", config.context_menu_opacity)
        .on('click', (d) => { d.action(data, _this) });

    d3.selectAll(`.menuEntry`)
        .append('text')
        .text((d) => { return d.title; })
        .attr('x', +x - +config.context_menu_text_x)
        .attr('y', (d, i) => y + (i * 30) + +config.context_menu_text_y)
        .attr('dy', 20)
        .attr('dx', 45)
        .attr("font-size", config.context_menu_text_font_size + 'px')
        .style("opacity", config.context_menu_text_opacity)
        .style("stroke", config.context_menu_text_color)
        .on('click', (d) => { d.action(data, _this) });

    // Other interactions
    d3.select('body')
        .on('click', () => {
            d3.select(`.contextMenu`).remove();
        });
}

export const createContextMenu = (d, x, y, menuItems, svgId, _this = null) => {
  menuFactory(x, y, menuItems, d, svgId, _this);
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

export const noOfLabels = parent => {
  return new Promise(resolve => {
    var number = 0
    parent.selectAll('rect')._groups[0].forEach(rect => {
      let tempRec = d3.select(rect)
      let tempRecId = tempRec.attr('id')
      let indexOf = tempRecId.indexOf('-')
      let number = parseInt(tempRecId[indexOf + 1]);
      if (number){
        number++
      }
    })
    resolve(number)
  })
}