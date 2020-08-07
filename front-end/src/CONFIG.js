// NEVER CHANGE ANYTHING EXCAPET THE NUMBER OR STRING(INSIDE QUOTES)
// NEVER CHAGNE EVENT THE QUOMA OR THE QUOTATION
// Order doesn't matter
// Colors can be written as STRING or HEX value

export const config = {

  // ZOOM
  max_zoom_out: 0.3,
  max_zoom_in: 32,
  default_zoom_level: 0.5,

  // Recenter zoom to...
  recenter_max_zoom_x: 50,
  recenter_max_zoom_y: 30,
  recenter_default_zoom_level: 0.5,

  // all values are in pixels except those whose details are written on their front

  // Place on the board where you want the new section to appear
  new_section_x_axis: 0,
  new_section_y_axis: 0,

  // New section color, please write hex code
  new_section_color: '#999',

  // Place on the board where you want the new tile to appear
  new_tile_x_axis: 0,
  new_tile_y_axis: 0,

  // New tile color, please write hex code
  new_tile_color: '#5c9aff',
  
  // New section dimensions
  section_width: 200,
  section_height: 200,

  section_opacity: 0.5, // not in pixels, ranges from 0 to 1
  section_edges_round: 6,
  
  // New tile dimensions
  tile_width: 80,
  tile_height: 40,

  tile_opacity: 1, // not in pixels, ranges from 0 to 1
  tile_edges_round: 4,

  // New label dimensions
  label_width: 15,
  label_height: 7,
  label_opacity: 1, // not in pixels, ranges from 0 to 1
  labels_edges_round: 1,
  lebel_padding_from_left: 6,

  gap_between_labels: 5,
  padding_on_labels: 2,

  // Section text Tile
  // For Capital letters, 15 is good, for Small letters 10 is good
  a_letter_width: 15,

  // Section text
  section_text_color: 'white',
  // relative distance (x, y) from the section
  section_text_y: 20, // y pixels appart from the point(y) of the tile
  section_text_font: 'sans-serif',
  section_text_size: '15',

  // Tile text
  tile_text_color: 'white',
  // relative distance (x, y) from the tile
  tile_text_x: 13, // x pixels appart from the point(x) of the tile
  tile_text_y: 25, // y pixels appart from the point(y) of the tile
  tile_text_font: 'sans-serif',
  tile_text_size: '15',

  // Section Cross Circle
  // relative distance (x, y) from the section
  section_x_x: 16, // x pixels appart from the point(x) of the section
  section_x_y: 14, // y pixels appart from the point(y) of the section
  section_x_color: 'black',
  section_x_radius: 6,
  section_x_opacity: 1,

  // Section Color Circle
  // relative distance (x, y) from the section
  section_color_x: 30, // x pixels appart from the point(x) of the section
  section_color_y: 14, // y pixels appart from the point(y) of the section
  section_color_color: 'black',
  section_color_radius: 6,
  section_color_opacity: 1,

  // CONTEXT MENU (on right mouse click)
  whole_context_oppacity: 1,
  context_background_color: '#ffffff',
  context_border: '#00557d',
  context_menu_x: 0, // Distance (in x-axis) of context menu rectangles from the click of the mouse pointer
  context_menu_y: 0, // Distance (in y-axis) of context menu rectangles from the click of the mouse pointer,
  context_menu_rounded_x: 5, // You can test it by changing the values
  context_menu_rounded_y: 5, // You can test it by changing the values
  context_menu_width: 150,
  context_menu_height: 30,
  context_menu_opacity: 0.5,
  context_menu_text_x: 35, // Distance (in x-axis) of context menu text from the context menu
  context_menu_text_y: 0, // Distance (in y-axis) of context menu text from the context menu
  context_menu_text_opacity: 1,
  context_menu_text_font_size: '12',
  context_menu_text_color: '#00557d',
  context_menu_text_thickness: 1,

  // Tile Warning
  tile_warning_width: 80,
  tile_warning_height: 10,
  tile_warning_x: 0, // Distance appart (in x-axis) from the start of the tile
  tile_warning_y: 30, // Distance appart (in y-axis) from the start of the tile
  tile_warning_rounded_edge_x: 2,
  tile_warning_rounded_edge_y: 2,
  tile_3_days_warning_color: 'red',
  tile_7_days_warning_color: 'yellow',

  // Backloaded Left
  back_left_color: 'green',
  back_left_width: 5,
  back_left_height: 40,
  back_left_stroke_color: 'black',
  back_left_stroke_width: 0.5,
  back_left_padding_from_x: 4,
  back_left_padding_from_y: 0,
  back_left_rounded_edges_x: 2,
  back_left_rounded_edges_y: 2,

  // Backloaded Right
  back_right_color: 'red',
  back_right_width: 5,
  back_right_height: 40,
  back_right_stroke_color: 'black',
  back_right_stroke_width: 0.5,
  back_right_padding_from_right_x: 9,
  back_right_padding_from_y: 0,
  back_right_rounded_edges_x: 2,
  back_right_rounded_edges_y: 2,

  // ToolTip
  mouse_over_opacity: 1,
  text_x_appart_on_mouse_move: 50,
  text_y_appart_on_mouse_move: 0,
  text_font: 'sans-serif',
  text_size: '15',
  text_color: 'Black',
  mouse_leave_opacity: 0,

  // Arrange
  y_gap_between_tiles: 10,
  x_gap_between_tiles: 10,
  y_appart_from_section: 30,
  x_appart_from_section: 10,
  no_of_tiles_in_a_row: 2,

}