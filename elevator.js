{
	init: function(elevators, floors) {
		var findElevator = function(elevators) {
			//current dumb algorithm is to get the first elevator
			return elevators[0];
		}


		//initialize elevators
		_.each(elevators, function(elevator) {
			elevator.on("floor_button_pressed", function(floorNum) {
				this.goToFloor(floorNum);
			});
		});


		//intialzie floors
		_.each(floors, function(floor) {
			floor.on("up_button_pressed", function(e) {
				return function(floor) {
					findElevator(e).goToFloor(floor.floorNum());
				};
			}(elevators));

			floor.on("down_button_pressed", function(e) {
				return function(floor) {
					findElevator(e).goToFloor(floor.floorNum());
				};
			}(elevators));
		});
	},
	update: function(dt, elevators, floors) {
		// We normally don't need to do anything here
	}
}