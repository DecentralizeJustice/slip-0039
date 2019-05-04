


#include "memzero.h"
#include "memzero.c"
#include "shamir.c"
#include "shamir.h"
#include <stdio.h>
#include <stdlib.h>
#include<time.h>
#define SHAMIR_MAX_SHARE_COUNT 16


int main(void) {
  srand(time(0));
  uint8_t results[16];//128 bytes
  uint8_t result_index = 1;
  uint8_t share_indices[SHAMIR_MAX_SHARE_COUNT] = {0,1};
  const uint8_t *share_values[SHAMIR_MAX_SHARE_COUNT];
  uint8_t share_count = 2;
  size_t len = 16; //128 bytes

  for(int i = 0; i<share_count; i++){
      uint8_t temparray[len];
      for(int i = 0; i<len; i++){
          temparray[i]= rand() % 256;
      }
      share_values[i] = temparray;
  }

  bool test = shamir_interpolate(results, result_index,share_indices,share_values,share_count,len);
  printf("Test result was %d\n", test);
  return 0;
}
