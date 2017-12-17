#include <stdio.h>
#include <time.h>

int main() {
  clock_t begin = clock();


  int input = 335;
  int ix = 0;
  int result = 0;
  int step = 1;

  do {
    // Skip until end of wrap
    int times = (step - ix - 1) / input;
    ix = ix + times * input + times;
    step = step + times;

    // Then the extra step that wrapps
    ix = ix + input;
    if (ix >= 2 * step) {
      ix = (ix % step);
    } else { // Modulo is slow
      if (ix >= step) {
        ix = ix - step;
      }
    }
    ix = ix + 1;
    if (ix == 1) {
      result = step;
    }
    step = step + 1;
  } while (step <= 50000000);


  clock_t end = clock();
  int time_spent = (double)(end - begin) / CLOCKS_PER_SEC * 1000000;

  printf("%i, time: %iµ\n", result, time_spent);
}
