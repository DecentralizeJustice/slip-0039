/*
 * This file is part of the TREZOR project, https://trezor.io/
 *
 * Copyright (c) SatoshiLabs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
#include <stdio.h>
#include <stddef.h>
#define SHAMIR_MAX_SHARE_COUNT 16

/// def interpolate(shares, x) -> bytes:
///     '''
///     Returns f(x) given the Shamir shares (x_1, f(x_1)), ... , (x_k, f(x_k)).
///     :param shares: The Shamir shares.
///     :type shares: A list of pairs (x_i, y_i), where x_i is an integer and
///         y_i is an array of bytes representing the evaluations of the
///         polynomials in x_i.
///     :param int x: The x coordinate of the result.
///     :return: Evaluations of the polynomials in x.
///     :rtype: Array of bytes.
///     '''
void interpolate(int *share_x, int share_count, uint8_t share_array[], size_t x) {
  if (share_count < 1 || share_count > SHAMIR_MAX_SHARE_COUNT) {
    printf("Invalid number of shares.");
  }
  uint8_t x_uint8 = 255;
  uint8_t share_indices[SHAMIR_MAX_SHARE_COUNT];
  const uint8_t *share_values[SHAMIR_MAX_SHARE_COUNT];
  size_t value_len = 0;
  for (int i = 0; i < share_count; ++i) {
    mp_obj_t *share;
    mp_obj_get_array_fixed_n(share_items[i], 2, &share);
    share_indices[i] = trezor_obj_get_uint8(share[0]);
    mp_buffer_info_t value;
    mp_get_buffer_raise(share[1], &value, MP_BUFFER_READ);
    if (value_len == 0) {
      value_len = value.len;
      if (value_len > SHAMIR_MAX_LEN) {
        printf("Share value exceeds maximum supported length.");
      }
    }
    if (value.len != value_len) {
      printf("All shares must have the same length.");
    }
    share_values[i] = value.buf;
  }
  vstr_t vstr;
  vstr_init_len(&vstr, value_len);
  if (shamir_interpolate((uint8_t *)vstr.buf, x_uint8, share_indices,
                         share_values, share_count, value_len) != true) {
    printf("Share indices must be pairwise distinct.");
  }
  return;
}
