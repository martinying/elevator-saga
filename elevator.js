{
	init: function(elevators, floors) {
		var findElevator = function(elevators) {
			//current dumb algorithm is to get the first elevator
			return elevators[0];
		}

		var elevatorIsGoingToFloorAlready = function(elevator, floorNum) {
			var q = elevator.destinationQueue;
			return _.contains(q, floorNum);
		}

		//initialize elevators
		_.each(elevators, function(elevator) {
			elevator.on("floor_button_pressed", function(floorNum) {
				if (!elevatorIsGoingToFloorAlready(this, floorNum)) {
					this.goToFloor(floorNum);
				}
			});
		});


		//intialzie floors
		_.each(floors, function(floor) {
			floor.on("up_button_pressed", function(e) {
				return function(floor) {
					var elevator = findElevator(e);
					var q = elevator.destinationQueue;
					if (!elevatorIsGoingToFloorAlready(elevator, floor.floorNum())) {
						q.push(floor.floorNum());
						elevator.destinationQueue = q;
						elevator.checkDestinationQueue();
					}
				};
			}(elevators));

			floor.on("down_button_pressed", function(e) {
				return function(floor) {
					var elevator = findElevator(e);
					var q = elevator.destinationQueue;
					if (!elevatorIsGoingToFloorAlready(elevator, floor.floorNum())) {
						q.push(floor.floorNum());
						elevator.destinationQueue = q;
						elevator.checkDestinationQueue();
					}
				};
			}(elevators));
		});
	},
	update: function(dt, elevators, floors) {
		// We normally don't need to do anything here
	}
}