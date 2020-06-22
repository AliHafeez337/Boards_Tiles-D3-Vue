export const config = {
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
  section_width: 180,
  section_height: 200,

  section_opacity: 0.5, // not in pixels, ranges from 0 to 1
  section_edges_round: 6,
  
  // New tile dimensions
  tile_width: 80,
  tile_height: 30,

  tile_opacity: 1, // not in pixels, ranges from 0 to 1
  tile_edges_round: 4,

  // New label dimensions
  label_width: 15,
  label_height: 7,

  label_opacity: 1, // not in pixels, ranges from 0 to 1
  labels_edges_round: 1,

  gap_between_labels: 5,
  padding_on_labels: 2,

  // Section text
  section_text_color: 'black',
  section_text_x: 70, // x pixels appart from the point(x) of the tile
  section_text_y: 20, // y pixels appart from the point(y) of the tile
  section_text_font: 'sans-serif',
  section_text_size: '15',

  // Tile text
  tile_text_color: 'white',
  tile_text_x: 8, // x pixels appart from the point(x) of the tile
  tile_text_y: 25, // y pixels appart from the point(y) of the tile
  tile_text_font: 'sans-serif',
  tile_text_size: '15'
}