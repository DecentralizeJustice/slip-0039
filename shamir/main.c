// #include "shamir.h"
// #include <stdio.h>
// int main (void) {
//
//    printf("The value of square3()\n");
// }
/* funcs.c  -- Examples of function declarations, definitions, and use
 */

 #include <emscripten.h>
#include <math.h>

int a(int x) {
  return sqrt(x);
 }

 int main() {
     EM_ASM( global.js_run() );
 }
