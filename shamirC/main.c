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


#include "shamir.h"

#define SHAMIR_MAX_SHARE_COUNT 16
#include <stdio.h>
#define N 16

int main(void) {
  int first, second;

  printf("Enter two integers > ");
  scanf("%d %d", &first, &second);
  printf("The two numbers are: %d  %d\n", first, second);
  printf("Their sum is %d\n", first+second);
  
}
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
