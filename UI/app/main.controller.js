(function() {
    angular
        .module('app')
        .controller('mainController', mainController);

    function mainController($scope, $http, $document) {
    	/*
			Puzzle for ui purpose: vm.uiTable
			Puzzle for checker: vm.currTable
			Puzzle for solver: vm.puzzles[puzzleIndex]
    	*/

        var vm = this;
        vm.puzzleIndex=0;
        vm.currentPage=0;
        vm.subgrid = 2; 
        

        vm.puzzles = [
        	[[1,0,0,3],[2,0,4,0],[0,2,0,0],[0,0,0,0]], //puzzle 0
        	[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
        	[
	        	[1,0,0,0,0,0,6,0,7],
	        	[0,8,0,7,0,1,0,4,0],
	        	[0,3,2,4,0,0,0,1,0],
	        	[0,0,0,0,0,9,1,0,0],
	        	[3,1,0,0,4,0,0,2,9],
	        	[0,0,4,8,0,0,0,0,0],
	        	[0,2,0,0,0,3,5,6,0],
	        	[0,9,0,2,0,4,0,3,0],
	        	[8,0,3,0,0,0,0,0,2]],

	        [
	        	[1,0,0,0,0,0,6,0,7,0,0,0,0,6,0,7],
	        	[0,8,0,7,0,1,0,4,0,0,0,0,0,6,0,7],
	        	[0,3,2,4,0,0,0,1,0,0,0,0,0,6,0,7],
	        	[0,0,0,0,0,9,1,0,0,0,0,0,0,6,0,7],
	        	[3,1,0,0,4,0,0,2,9,0,0,0,0,6,0,7],
	        	[0,0,4,8,0,0,0,0,0,0,0,0,0,6,0,7],
	        	[0,2,0,0,0,3,5,6,0,0,0,0,0,6,0,7],
	        	[0,9,0,2,0,4,0,3,0,0,0,0,0,6,0,7],
	        	[8,0,3,0,0,0,0,0,2,0,0,0,0,6,0,7],
	        	[0,3,2,4,0,0,0,1,0,0,0,0,0,6,0,7],
	        	[0,0,0,0,0,9,1,0,0,0,0,0,0,6,0,7],
	        	[3,1,0,0,4,0,0,2,9,0,0,0,0,6,0,7],
	        	[0,0,4,8,0,0,0,0,0,0,0,0,0,6,0,7],
	        	[0,2,0,0,0,3,5,6,0,0,0,0,0,6,0,7],
	        	[0,9,0,2,0,4,0,3,0,0,0,0,0,6,0,7],
	        	[8,0,3,0,0,0,0,0,2,0,0,0,0,6,0,7]
	        ]
        ] //all puzzles

        vm.puzzleNumber=vm.puzzles.length;
        vm.currTable = JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex])); //cuurent table
        vm.uiTable = JSON.parse(JSON.stringify(vm.currTable)); //table for ui
        vm.N = vm.currTable.length; //dimensions
        vm.solutions = []
        vm.Nsolutions = 0;
        vm.noSolution = false;
        vm.showPuzzles=false;

        vm.prevPuzzle = prevPuzzle; 
        vm.nextPuzzle = nextPuzzle;
        vm.solveRegular = solveRegular;
       	vm.solveX = solveX;
       	vm.solveY = solveY;
       	vm.solveXY = solveXY;
       	vm.here = here;
       	vm.nextPage = nextPage;
       	vm.prevPage = prevPage;
       	vm.fileRead=fileRead;

       	function here(val,i,j){
        	console.log("here:"+val)
        	console.log(i+"	"+j)
        	if(val!=null){
        		if(val!=undefined && val<vm.N+1 && val>0){
	        		vm.currTable[i][j] =val;
	        	}
	 			else{
	 				document.getElementById("form").reset();
	 			}
        	}
        	
        	console.log(vm.currTable)
        }

        function fileRead(){
        	//do file reading here
        	console.log("hmm")
        }

        function nextPuzzle(){
        	console.log("entered here")
        	if (vm.puzzleIndex < vm.puzzleNumber - 1) {
				vm.puzzleIndex++;
				vm.currTable= JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex]))
				vm.uiTable = JSON.parse(JSON.stringify(vm.currTable));
				vm.N = vm.currTable.length
				vm.solutions = []
				vm.Nsolutions = 0;
				vm.noSolution = false;
				vm.showPuzzles=false;        
				console.log(vm.N)
			}
        }	

        function prevPuzzle(){
        	if (vm.puzzleIndex > 0) {
				vm.puzzleIndex--;
				vm.currTable= JSON.parse(JSON.stringify(vm.puzzles[vm.puzzleIndex]));
				vm.uiTable = JSON.parse(JSON.stringify(vm.currTable));
				vm.N = vm.currTable.length
				vm.solutions = []
				vm.Nsolutions = 0;
				vm.noSolution = false;
				vm.showPuzzles=false; 
				console.log(vm.N)
			}
        }

         function nextPage(){
        	if (vm.currentPage < vm.solutions.length - 1) {
				vm.currentPage++;
			}
        }

         function prevPage(){
        	if (vm.currentPage > 0) {
				vm.currentPage--;
			}
        }


        function solveRegular(){
			$http({
				 method: 'POST',
				 headers:{
				 	'Content-Type': "application/json"
				 },
				 url: 'http://localhost:3000/solve',
				 data: {"puzzle": vm.puzzles[vm.puzzleIndex], "type": 40}
			}).then(function successCallback(response) {
				if(response.data==undefined || response.data==0){
					vm.noSolution=true;
					vm.solutions = []
					vm.Nsolutions = 0;
					vm.showPuzzles=false;
				}else{
					vm.solutions = response.data.slice()
					vm.Nsolutions = vm.solutions.pop();
					vm.noSolution=false;
					vm.showPuzzles=true;
					console.log(vm.solutions)
					console.log(vm.Nsolutions)
				}
			  }, function errorCallback(response) {
			  	console.log(response)
			  });
        }

        function solveX(){
        	$http({
				 method: 'POST',
				 headers:{
				 	'Content-Type': "application/json"
				 },
				 url: 'http://localhost:3000/solve',
				 data: {"puzzle": vm.puzzles[vm.puzzleIndex], "type": 10}
			}).then(function successCallback(response) {
				console.log("went here")
				console.log(response.data)
				if(response.data==0 || response.data==undefined){
					console.log("here")
					vm.noSolution=true;
					vm.solutions = []
					vm.Nsolutions = 0;
					vm.showPuzzles=false;
				}else{
					vm.solutions = response.data.slice()
					vm.Nsolutions = vm.solutions.pop();
					vm.noSolution=false;
					vm.showPuzzles=true;
					console.log(vm.solutions)
					console.log(vm.Nsolutions)
				}
			  }, function errorCallback(response) {
			  	console.log(response)
			  });

        }
     	
     	function solveY(){
     		$http({
				 method: 'POST',
				 headers:{
				 	'Content-Type': "application/json"
				 },
				 url: 'http://localhost:3000/solve',
				 data: {"puzzle": vm.puzzles[vm.puzzleIndex], "type": 20}
			}).then(function successCallback(response) {
				if(response.data==0 || response.data==undefined){
					vm.noSolution=true;
					vm.solutions = []
					vm.Nsolutions = 0;
					vm.showPuzzles=false;
				}else{
					vm.solutions = response.data.slice()
					vm.Nsolutions = vm.solutions.pop();
					vm.noSolution=false;
					vm.showPuzzles=true;
					console.log(vm.solutions)
					console.log(vm.Nsolutions)
				}
			  }, function errorCallback(response) {
			  	console.log(response)
			  });

     	}

     	function solveXY(){
     		$http({
				 method: 'POST',
				 headers:{
				 	'Content-Type': "application/json"
				 },
				 url: 'http://localhost:3000/solve',
				 data: {"puzzle": vm.puzzles[vm.puzzleIndex], "type": 30}
			}).then(function successCallback(response) {
				if(response.data==undefined || response.data==0){
					vm.noSolution=true;
					vm.solutions = []
					vm.Nsolutions = 0;
					vm.showPuzzles=false;
				}else{
					vm.solutions = response.data.slice()
					vm.Nsolutions = vm.solutions.pop();
					vm.noSolution=false;
					vm.showPuzzles=true;
					console.log(vm.solutions)
					console.log(vm.Nsolutions)
				}
			  }, function errorCallback(response) {
			  	console.log(response)
			  });
     	}

     }

})();


/*#define REGULAR 40
#define SUDOKU_X 10
#define SUDOKU_Y 20
#define SUDOKU_XY 30*/