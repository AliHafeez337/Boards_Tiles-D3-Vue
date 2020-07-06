import * as d3 from "d3";
import styles from "./contextMenu.css";
import { config } from '../../../../CONFIG';

export const menuFactory = (x, y, menuItems, data, place, _this) => {
    d3.select(`.contextMenu`).remove();

    // Draw the menu
    d3.select(place)
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
        .attr("font-size", '10px')
        .attr("font-size", config.context_menu_text_font_size + 'px')
        .style("opacity", config.context_menu_text_opacity)
        .style("stroke", config.context_menu_text_color)
        .style("stroke-width", config.context_menu_text_thickness)
        .on('click', (d) => { d.action(data, _this) });

    // Other interactions
    d3.select('body')
        .on('click', () => {
            d3.select(`.contextMenu`).remove();
        });
}

export const createContextMenu = (d, x, y, menuItems, place, _this = null) => {
  menuFactory(x, y, menuItems, d, place, _this);
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

export const distance = function (p1, p2) {
  return Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2), 0.5);
}

export const getColor = function () {
  return new Promise(resolve => {
    // IMPORTANT: Remove the old input color element with old event listeneres and place a new one with no event listener
    // coppied from: https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
    var old_element = document.querySelector('#color');
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    // Now select the new element
    var colorInput = document.querySelector('#color');
    // Click the new element
    colorInput.click();
    // Add event listener, whenever user clicks 'ok', this function fires
    colorInput.addEventListener('input', () => {
      resolve(colorInput.value);
    })
  });
}

export const mouseover = function(d) {
  d3.select('.tooltip')
    .style("opacity", config.mouse_over_opacity)
}

export const mousemove = function(d) {
  let coords = d3.mouse(this);
  let date = d.event_due * 1000, name = d.event_name;

  d3.select('.tooltip')
    .attr("x", () => {
      // console.log(coords[0], config.text_x_appart_on_mouse_move)
      return coords[0] + config.text_x_appart_on_mouse_move + "px"
    })
    .attr("y", (coords[1] + config.text_y_appart_on_mouse_move) + "px")
    .text(() => {
      if (date){
        var d = new Date(date)
        return name + ' ( ' + d.getDate() + ' / ' + d.getMonth() + ' / ' + d.getFullYear() + ' ) '
      } else {
        return name
      }
    })
    .attr("font-family", config.text_font)
    .attr("font-size", config.text_size + 'px')
    .attr("fill", config.text_color)
}

export const mousemoveBackLeft = function(d) {
  let coords = d3.mouse(this);

  d3.select('.tooltip')
    .attr("x", coords[0] + config.text_x_appart_on_mouse_move + "px")
    .attr("y", (coords[1] + config.text_y_appart_on_mouse_move) + "px")
    .text(d.backLTitle)
    .attr("font-family", config.text_font)
    .attr("font-size", config.text_size + 'px')
    .attr("fill", config.text_color)
}

export const mousemoveBackRight = function(d) {
  let coords = d3.mouse(this);

  d3.select('.tooltip')
    .attr("x", coords[0] + config.text_x_appart_on_mouse_move + "px")
    .attr("y", (coords[1] + config.text_y_appart_on_mouse_move) + "px")
    .text(d.backRTitle)
    .attr("font-family", config.text_font)
    .attr("font-size", config.text_size + 'px')
    .attr("fill", config.text_color)
}

export const mouseleave = function(d) {
  d3.select('.tooltip')
    // .transition()
    // .duration(200)
    .style("opacity", config.mouse_leave_opacity)
}