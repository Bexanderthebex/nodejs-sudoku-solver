(function () {
  angular.module("app").controller("mainController", mainController);

  function mainController($scope, $http, $document) {
    /*
			Puzzle for ui purpose: vm.uiTable
			Puzzle for checker: vm.currTable
			Puzzle for solver: vm.puzzles[puzzleIndex]
    	*/

    var vm = this;
    vm.puzzleIndex = 0;
    vm.currentPage = 0;
    vm.subgrid = 2;

    vm.puzzles = [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ], //puzzle 0
      [
        [1, 0, 0, 3],
        [2, 0, 4, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [6, 0, 0, 2, 0, 0, 9, 0, 0],
        [0, 0, 0, 5, 0, 0, 7, 4, 0],
        [0, 7, 4, 9, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 8, 0, 5, 4],
        [1, 0, 0, 0, 0, 0, 0, 0, 9],
        [8, 9, 0, 3, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 9, 2, 7, 0],
        [0, 2, 9, 0, 0, 3, 0, 0, 0],
        [0, 0, 3, 0, 0, 2, 1, 0, 8],
      ],
      [
        [1, 0, 0, 0, 2, 0, 0, 0, 4],
        [0, 2, 0, 0, 0, 8, 0, 1, 0],
        [0, 0, 3, 0, 4, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 4, 0],
        [0, 0, 0, 7, 6, 9, 0, 0, 0],
        [0, 0, 6, 0, 7, 0, 8, 0, 0],
        [0, 9, 0, 0, 8, 0, 0, 7, 0],
        [8, 0, 7, 0, 3, 0, 0, 0, 6],
      ],
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],

      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [9, 10, 11, 12, 1, 2, 3, 4, 13, 14, 15, 16, 5, 6, 7, 8],
        [5, 6, 7, 8, 13, 14, 15, 16, 1, 2, 3, 4, 9, 10, 11, 12],
        [13, 14, 15, 16, 9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4],
        [3, 1, 4, 2, 7, 5, 8, 6, 11, 9, 14, 10, 15, 12, 16, 13],
        [11, 9, 14, 10, 3, 1, 4, 2, 15, 12, 16, 13, 7, 5, 8, 6],
        [7, 5, 8, 6, 15, 12, 16, 13, 3, 1, 4, 2, 11, 9, 14, 10],
        [15, 12, 16, 13, 11, 9, 14, 10, 7, 5, 8, 6, 3, 1, 4, 2],
        [2, 4, 1, 3, 6, 8, 5, 7, 10, 15, 9, 11, 12, 16, 13, 14],
        [10, 15, 9, 11, 2, 4, 1, 3, 12, 16, 13, 14, 6, 8, 5, 7],
        [6, 8, 5, 7, 12, 16, 13, 14, 2, 4, 1, 3, 10, 15, 9, 11],
        [12, 16, 13, 14, 10, 15, 9, 11, 6, 8, 5, 7, 2, 4, 1, 3],
        [4, 3, 2, 1, 8, 7, 6, 5, 14, 11, 10, 9, 16, 13, 12, 15],
        [14, 11, 10, 9, 4, 3, 2, 1, 16, 13, 12, 15, 8, 7, 6, 5],
        [8, 7, 6, 5, 16, 13, 12, 15, 4, 3, 2, 1, 14, 11, 10, 9],
        [16, 13, 12, 15, 14, 11, 10, 9, 8, 7, 6, 5, 4, 3, 0, 0]
      ]
    ]; //all puzzles

    vm.puzzleNumber = vm.puzzles.length;
    vm.currTable = JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex])); //current table
    vm.uiTable = JSON.parse(JSON.stringify(vm.currTable)); //table for ui
    vm.N = vm.currTable.length; //dimensions
    vm.solutions = [];
    vm.Nsolutions = 0;
    vm.noSolution = false;
    vm.showPuzzles = false;

    vm.prevPuzzle = prevPuzzle;
    vm.nextPuzzle = nextPuzzle;
    vm.solveRegular = solveRegular;
    vm.solveX = solveX;
    vm.solveY = solveY;
    vm.solveXY = solveXY;
    vm.here = here;
    vm.nextPage = nextPage;
    vm.prevPage = prevPage;
    vm.fileRead = fileRead;
    vm.openModal = openModal;
    vm.checkPlayable = checkPlayable;

    function here(val, i, j) {
      // console.log("here:" + val);
      // console.log(i + "	" + j);
      if (val != null) {
        if (val != undefined && val < vm.N + 1 && val > 0) {
          vm.currTable[i][j] = val;
        } else {
          document.getElementById("form").reset();
        }
      }

      // console.log(vm.currTable);
    }

    function fileRead() {
      var fileToLoad = document.getElementById("upload").files[0];
      var fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        var array = textFromFileLoaded.split("\n");

        var noOfPuzzles = parseInt(array[0]);
        var subgrid = 0;

        for (var i = 1; i < array.length; i += subgrid + 1) {
          subgrid = parseInt(array[i]);
          var puzzle = []
          for (var j = 1; j <= subgrid; j++) {
            for (var k = 0; k < subgrid; k++) {
              array[i + j][k] = parseInt(array[i + j][k]);
            }
            puzzle.push(array[i + j]);
          }
          vm.puzzles.push(puzzle);
          vm.puzzleNumber += 1;
        }

        $scope.$apply();

      };
      fileReader.readAsText(fileToLoad, "UTF-8");
    }

    function update(puzzles) {
      vm.puzzles = puzzles;
      vm.puzzleNumber = vm.puzzles.length;
      // console.log(vm.puzzleNumber);
    }

    function openModal(i) {
      // console.log(i)
      if (i == 1) {
        $('.ui.modal.instruc')
          .modal('show')
          ;
      }
      if (i == 2) {
        $('.ui.modal.credits')
          .modal('show')
          ;
      }
    }

    function nextPuzzle() {
      // console.log(vm.puzzles);
      if (vm.puzzleIndex < vm.puzzleNumber - 1) {
        vm.puzzleIndex++;
        vm.currTable = JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex]));
        vm.uiTable = JSON.parse(JSON.stringify(vm.currTable));
        vm.N = vm.currTable.length;
        vm.solutions = [];
        vm.Nsolutions = 0;
        vm.noSolution = false;
        vm.showPuzzles = false;
        // console.log(vm.N);
      }
    }

    function prevPuzzle() {
      if (vm.puzzleIndex > 0) {
        vm.puzzleIndex--;
        vm.currTable = JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex]));
        vm.uiTable = JSON.parse(JSON.stringify(vm.currTable));
        vm.N = vm.currTable.length;
        vm.solutions = [];
        vm.Nsolutions = 0;
        vm.noSolution = false;
        vm.showPuzzles = false;
        // console.log(vm.N);
      }
    }

    function nextPage() {
      if (vm.currentPage < vm.solutions.length - 1) {
        vm.currentPage++;
      }
    }

    function prevPage() {
      if (vm.currentPage > 0) {
        vm.currentPage--;
      }
    }

    function checkPlayable(t) {
      vm.uiTable = JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex]));
      var type = 0;
      if (t == 1) {
        type = 40;//regular
      } else if (t == 2) {
        type = 10;//x
      } else if (t == 3) {
        type = 20;//y
      } else if (t == 4) {
        type = 30;//xy
      }
      var dim = vm.N;
      var complete = true;
      var answered = [];

      for (i = 0; i < dim; i++) {
        for (j = 0; j < dim; j++) {
          if (vm.uiTable[i][j] == 0 && vm.currTable[i][j] != 0) {
            answered.push([i, j])
          }
          if (vm.uiTable[i][j] == 0 && vm.currTable[i][j] == 0) {
            complete = false;
          }
        }
      }
      // console.log(answered)
      // console.log(complete)
      $http({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        url: "http://localhost:3000/check",
        data: { puzzle: vm.currTable, to_check: answered, type: type }
      }).then(
        function successCallback(response) {
          // console.log(response.data)
          let size = response.data.length;
          if (size == 0) {
            // console.log("here")
            if (complete) {
              for (i = 0; i < dim; i++) {
                for (j = 0; j < dim; j++) {
                  if (vm.uiTable[i][j] == 0)
                    vm.uiTable[i][j] = 9999
                }
              }
            }
            // console.log(vm.uiTable)
          } else {
            for (i = 0; i < size; i++) {
              let j = response.data[i][0]
              let k = response.data[i][1]
              vm.uiTable[j][k] = 999
            }
          }
        },
        function errorCallback(response) {
          // console.log(response);
        }
      );

    }

    function solveRegular() {
      $http({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        url: "http://localhost:3000/solve",
        data: { puzzle: vm.puzzles[vm.puzzleIndex], type: 40 }
      }).then(
        function successCallback(response) {
          if (response.data == undefined || response.data == 0) {
            vm.noSolution = true;
            vm.solutions = [];
            vm.Nsolutions = 0;
            vm.showPuzzles = false;
          } else {
            vm.solutions = response.data.slice();
            vm.Nsolutions = vm.solutions.pop();
            vm.noSolution = false;
            vm.showPuzzles = true;
            // console.log(vm.solutions);
            // console.log(vm.Nsolutions);
          }
        },
        function errorCallback(response) {
          // console.log(response);
        }
      );
    }

    function solveX() {
      $http({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        url: "http://localhost:3000/solve",
        data: { puzzle: vm.puzzles[vm.puzzleIndex], type: 10 }
      }).then(
        function successCallback(response) {
          // console.log("went here");
          // console.log(response.data);
          if (response.data == 0 || response.data == undefined) {
            // console.log("here");
            vm.noSolution = true;
            vm.solutions = [];
            vm.Nsolutions = 0;
            vm.showPuzzles = false;
          } else {
            vm.solutions = response.data.slice();
            vm.Nsolutions = vm.solutions.pop();
            vm.noSolution = false;
            vm.showPuzzles = true;
            // console.log(vm.solutions);
            // console.log(vm.Nsolutions);
          }
        },
        function errorCallback(response) {
          // console.log(response);
        }
      );
    }

    function solveY() {
      $http({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        url: "http://localhost:3000/solve",
        data: { puzzle: vm.puzzles[vm.puzzleIndex], type: 20 }
      }).then(
        function successCallback(response) {
          if (response.data == 0 || response.data == undefined) {
            vm.noSolution = true;
            vm.solutions = [];
            vm.Nsolutions = 0;
            vm.showPuzzles = false;
          } else {
            vm.solutions = response.data.slice();
            vm.Nsolutions = vm.solutions.pop();
            vm.noSolution = false;
            vm.showPuzzles = true;
            // console.log(vm.solutions);
            // console.log(vm.Nsolutions);
          }
        },
        function errorCallback(response) {
          // console.log(response);
        }
      );
    }

    function solveXY() {
      $http({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        url: "http://localhost:3000/solve",
        data: { puzzle: vm.puzzles[vm.puzzleIndex], type: 30 }
      }).then(
        function successCallback(response) {
          if (response.data == undefined || response.data == 0) {
            vm.noSolution = true;
            vm.solutions = [];
            vm.Nsolutions = 0;
            vm.showPuzzles = false;
          } else {
            vm.solutions = response.data.slice();
            vm.Nsolutions = vm.solutions.pop();
            vm.noSolution = false;
            vm.showPuzzles = true;
            // console.log(vm.solutions);
            // console.log(vm.Nsolutions);
          }
        },
        function errorCallback(response) {
          // console.log(response);
        }
      );
    }
  }
})();

/*#define REGULAR 40
#define SUDOKU_X 10
#define SUDOKU_Y 20
#define SUDOKU_XY 30*/
