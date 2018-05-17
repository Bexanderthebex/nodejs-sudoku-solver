#include <node_api.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

#define FIXED -2
#define REGULAR 40
#define SUDOKU_X 10
#define SUDOKU_Y 20
#define SUDOKU_XY 30

// FUNCTION PROTOTYPES =========================
void solve(int, napi_env);
void printPuzzle();
int isInRow(int, int);
int isInCol(int, int);
int isInGrid(int, int, int);
int isInLeftX(int, int, int);
int isInRightX(int, int, int);
int isInLeftY(int, int, int);
int isInRightY(int, int, int);
int isSafe(int, int, int, int);
void populate(int, int);
void addAnswer(int index, napi_env);

// GLOBAL VARIABLES ============================
int **puzzle;
int **options;
int *nopts;
int gridSize, N;
napi_value array_of_puzzles; 

napi_value Solver(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value argv[2];
  napi_value array;
  napi_value e;
  napi_value temp_array;
  size_t argc = 2;
  int e2;
  int sudoku_type;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Failed to parse arguments");
  }

  napi_create_array(env, &array_of_puzzles);
  napi_create_array(env, &array);
  array = argv[0];
  napi_get_value_int32(env, argv[1], &sudoku_type);

  // get the number of rows the array passed has
  napi_get_array_length(env, array, &N);
  gridSize = (int)sqrt(N);
  // napi_get_value_int32(env, rows, &N);

  puzzle = (int **)malloc(N * sizeof(int *));
  for (int j = 0; j < N; j++)
          puzzle[j] = (int *)malloc(N * sizeof(int));

  // initialize C array
  for (int i = 0; i < N; i++) {
    napi_get_element(env, array, i, &temp_array);

    for (int j = 0; j < N; j++) {
      napi_get_element(env, temp_array, j, &e);
      napi_get_value_int32(env, e, &e2);
      puzzle[i][j] = e2;
    }
  }

  if(isValid(sudoku_type))
  {
    solve(sudoku_type, env);
  }
  else {
    return false;       // return undefined for now if invalid
  }

  return array_of_puzzles;
}

// returns an array of indexes that are have invalid values
napi_value Checker(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value argv[3];
  napi_value puzzle_parameter;
  napi_value positions_to_check;
  napi_value return_array;
  napi_value temp_array;
  napi_value e;
  int e2;
  size_t argc = 3;
  uint32_t to_check_length;
  int to_check_length_row;
  int to_check_length_col;
  int counter = 0;
  int sudoku_type;
  int temp_value_holder;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Failed to parse arguments");
  }

  napi_create_array(env, &puzzle);
  napi_create_array(env, &positions_to_check);
  napi_create_array(env, &return_array);
  puzzle_parameter = argv[0];
  positions_to_check = argv[1];

  napi_get_value_int32(env, argv[2], &sudoku_type);
  napi_get_array_length(env, positions_to_check, &to_check_length);
  napi_get_array_length(env, puzzle_parameter, &N);
  gridSize = (int)sqrt(N);

  puzzle = (int **)malloc(N * sizeof(int *));
  for (int j = 0; j < N; j++)
    puzzle[j] = (int *)malloc(N * sizeof(int));

  // initialize C array
  for (int i = 0; i < N; i++)
  {
    napi_get_element(env, puzzle_parameter, i, &temp_array);

    for (int j = 0; j < N; j++)
    {
      napi_get_element(env, temp_array, j, &e);
      napi_get_value_int32(env, e, &e2);
      puzzle[i][j] = e2;
    }
  }

  for (int i = 0; i < to_check_length; i++) {
    napi_get_element(env, positions_to_check, i, &temp_array);
    napi_value row;
    napi_value col;
    napi_get_element(env, temp_array, 0, &row);
    napi_get_element(env, temp_array, 1, &col);
    napi_get_value_int32(env, row, &to_check_length_row);
    napi_get_value_int32(env, col, &to_check_length_col);

    // set puzzle index first to zero;
    temp_value_holder = puzzle[to_check_length_row][to_check_length_col];
    puzzle[to_check_length_row][to_check_length_col] = 0;

    if (!isSafe(to_check_length_row, to_check_length_col, temp_value_holder, sudoku_type))
    {
      napi_set_element(env, return_array, counter, temp_array);
      counter++;
    }

    // set the puzzle value back after checking
    puzzle[to_check_length_row][to_check_length_col] = temp_value_holder;
  }

  return return_array;
} 

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, NULL, 0, Solver, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function");
  }

  status = napi_create_function(env, NULL, 0, Checker, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function");
  }

  status = napi_set_named_property(env, exports, "solver", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports");
  }

  status = napi_set_named_property(env, exports, "checker", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports");
  }

  return exports;
}

void addAnswer(int index, napi_env env) {
  napi_value temp_int;
  napi_value temp_array_outer;
  napi_create_array(env, &temp_array_outer);
  for(int i = 0; i < N; i++) {
    napi_value temp_array;
    napi_create_array(env, &temp_array);
    for(int j = 0; j < N; j++) {
      napi_create_int32(env, puzzle[i][j], &temp_int);
      napi_set_element(env, temp_array, j, temp_int);
    }
    napi_set_element(env, temp_array_outer, i, temp_array);
  }

  napi_set_element(env, array_of_puzzles, index, temp_array_outer);
}

// returns number of solutions
void solve(int type, napi_env env)
{
  int row, col, solnCount = 0, start, move;

  // allocate nopts[]
  nopts = (int *)malloc(((N * N) + 2) * sizeof(int));
  // allocate options[][]
  options = (int **)malloc(((N * N) + 2) * sizeof(int *));
  for (row = 0; row < (N * N) + 2; row++)
    options[row] = (int *)malloc((N + 2) * sizeof(int));

  //initialize options all to 0
  for (row = 0; row < N * N + 2; row++)
    for (col = 0; col < N + 2; col++)
      options[row][col] = 0;

  //initialize nopts
  for (row = 0; row < N; row++)
    for (col = 0; col < N; col++)
      nopts[(row * N) + col + 1] = (puzzle[row][col] != 0) ? FIXED : 0;
  nopts[(N * N) + 1] = 0;

  // BACKTRACKING ============================
  move = start = 0;
  nopts[start] = 1;

  while (nopts[start] > 0)
  { // while leftmost is not decremented to 0
    if (nopts[move] > 0)
    { // if empty stack
      do
      {
        move++;
      } while (nopts[move] == FIXED); // next blank
      nopts[move] = 0;                // empty stack

      //print - solution found!
      if (move == (N * N) + 1)
      { //last element of nopts
        //printPuzzle();
        addAnswer(solnCount, env);
        solnCount++;
      }
      else
      { // populate candidates
        populate(move, type);
      }
    }
    else
    {
      //backtrack
      do
      {
        move--;
      } while (nopts[move] == FIXED);                                      // previous blank
      nopts[move]--;                                                       //pop()
      puzzle[(move - 1) / N][(move - 1) % N] = options[move][nopts[move]]; //update puzzle
    }
  }

  //deallocate options -------------------
  for (row = 0; row < N * N + 2; row++)
    free(options[row]);
  free(options);
  //deallocate nopts ---------------------
  free(nopts);

  napi_value no_of_solutions;
  napi_create_int32(env, solnCount, &no_of_solutions);
  napi_set_element(env, array_of_puzzles, solnCount, no_of_solutions);
}

// FUNCTION DEFINITIONS =====================
void printPuzzle()
{
  for (int i = 0; i < N; i++)
  {
    for (int j = 0; j < N; j++)
    {
      printf("%d ", puzzle[i][j]);
    }
    putchar('\n');
  }
  putchar('\n');
}

int isInRow(int row, int num)
{
  for (int col = 0; col < N; col++)
    if (puzzle[row][col] == num)
      return 1;
  return 0;
}

int isInCol(int col, int num)
{
  for (int row = 0; row < N; row++)
    if (puzzle[row][col] == num)
      return 1;
  return 0;
}

int isInGrid(int gridStartRow, int gridStartCol, int num)
{
  for (int i = 0; i < gridSize; i++)
    for (int j = 0; j < gridSize; j++)
      if (puzzle[gridStartRow + i][gridStartCol + j] == num)
        return 1;
  return 0;
}

//check if(row == col), if yes, check all other cells where row==col
int isInLeftX(int row, int col, int num)
{
  if (row == col)
  {
    for (int i = 0; i < N; i++)
    {
      if (puzzle[i][i] == num)
      {
        return 1;
      }
    }
    return 0;
  }
  else
  {
    return 0;
  }
}

//check if(row-col == N-1) if yes, check all other cells where row==col
int isInRightX(int row, int col, int num)
{
  if ((N - row - 1 == col))
  {
    for (int i = 0, j = (N - 1); i < N; i++, j--)
    {
      if (puzzle[i][j] == num)
      {
        return 1;
      }
    }
    return 0;
  }
  else
  {
    return 0;
  }
}

//
int isInLeftY(int row, int col, int num)
{
  if ((row <= N / 2 && row == col) || (row > N / 2 && col == N / 2))
  {
    for (int i = 0; i <= N / 2; i++)
    {
      if (puzzle[i][i] == num)
      {
        return 1;
      }
    }
    for (int i = N / 2 + 1; i < N; i++)
    {
      if (puzzle[i][N / 2] == num)
      {
        return 1;
      }
    }
  }
  return 0;
}

int isInRightY(int row, int col, int num)
{
  if ((row <= N / 2 && (N - row - 1 == col)) || (row > N / 2 && col == N / 2))
  {
    for (int i = 0, j = N - 1; i <= N / 2; i++, j--)
    {
      if (puzzle[i][j] == num)
      {
        return 1;
      }
    }
    for (int i = N / 2 + 1; i < N; i++)
    {
      if (puzzle[i][N / 2] == num)
      {
        return 1;
      }
    }
  }
  return 0;
}

int isSafe(int row, int col, int num, int type)
{
  if (type == REGULAR)
  {
    if (!isInRow(row, num) &&
        !isInCol(col, num) &&
        !isInGrid(row - row % gridSize, col - col % gridSize, num))
      return 1;
    else
      return 0;
  }
  else if (type == SUDOKU_X)
  {
    if (!isInRow(row, num) &&
        !isInCol(col, num) &&
        !isInGrid(row - row % gridSize, col - col % gridSize, num) &&
        !isInLeftX(row, col, num) && !isInRightX(row, col, num))
      return 1;
    else
      return 0;
  }
  else if (type == SUDOKU_Y)
  {
    if (!isInRow(row, num) &&
        !isInCol(col, num) &&
        !isInGrid(row - row % gridSize, col - col % gridSize, num) &&
        !isInLeftY(row, col, num) && !isInRightY(row, col, num))
      return 1;
    else
      return 0;
  }
  else
  { // SUDOKU_XY
    if (!isInRow(row, num) &&
        !isInCol(col, num) &&
        !isInGrid(row - row % gridSize, col - col % gridSize, num) &&
        !isInLeftX(row, col, num) && !isInRightX(row, col, num) &&
        !isInLeftY(row, col, num) && !isInRightY(row, col, num))
      return 1;
    else
      return 0;
  }
}

void populate(int move, int type)
{
  for (int cand = N; cand >= 1; cand--)
  {
    if (isSafe((move - 1) / N, (move - 1) % N, cand, type))
    {
      //push
      nopts[move]++;                     // update top of stack
      options[move][nopts[move]] = cand; // update options[][]
    }
  }
  puzzle[(move - 1) / N][(move - 1) % N] = options[move][nopts[move]]; //update puzzle
}

int isValid(int type)
{
  int temp, i, j;

  if (type == SUDOKU_Y)
    if (N % 2 == 0)
      return 0;

  for (i = 0; i < N; i++)
  {
    for (j = 0; j < N; j++)
    {
      if (puzzle[i][j] == 0)
        continue;
      temp = puzzle[i][j];
      puzzle[i][j] = 0;
      if (!isSafe(i, j, temp, type))
      {
        return 0; //not valid
      }
      puzzle[i][j] = temp;
    }
  }
  return 1; // valid
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)