// #include "shamir.h"
// #include <stdio.h>
// int main (void) {
//
//    printf("The value of square3()\n");
// }
/* funcs.c  -- Examples of function declarations, definitions, and use
 */

#include <emscripten.h>
#include "shamir.h"

size_t shamirInterpolate(size_t x) {
  return shamir_interpolate(uint8_t result, uint8_t result_index,
                          const uint8_t share_indices,
                          const uint8_t share_values, uint8_t share_count,
                          size_t len);
 }

 int main() {
     EM_ASM( global.js_run() );
 }
