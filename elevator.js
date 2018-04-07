{
    init: function(elevators, floors) {
        var queue = new Array();

        //find closest idle elevator
        var findElevator = function(floorNum) {
            var result;
            var minDistance = Number.MAX_SAFE_INTEGER;
            for(var index in elevators) {
                var distance = Math.abs(elevators[index].currentFloor()-floorNum)
                if (elevators[index].destinationQueue.length === 0 && distance < minDistance) {
                    minDistance = distance;
                    result = elevators[index];

                }
            }
            return result;
        }

        //initialize elevators
        elevators.forEach(function(elevator) {
            elevator.on("floor_button_pressed", function(floorNum) {
                if (this.destinationQueue.indexOf(floorNum) < 0) {
                    this.goToFloor(floorNum);
                }
            });

            elevator.on("idle", function() {
                if(queue.length > 0) {
                    //the elevator is idle , destination queue will always be empty so no need to check if elevator will be going there
                    //provided we ensure there are no dups in the queue, see floor behavior                    
                    this.goToFloor(queue.shift());
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                var i = queue.indexOf(floorNum);
                if (i >= 0) {
                    queue.splice(i, 1);
                }
            });
        });

        var floorBehavior = function() {
            //CAN'T PUT INTO QUEUE IMMEDIATELY BECAUSE FIRST MOVE IS USUALLIY THIS AND THE ELEVATOR HAS NOT CALLED IDLE YET
            //assumes floor context            
            var elevator = findElevator(this.floorNum());
            if (elevator) {
                //it's an idle elevator so should not need to check if going to floor already                
                elevator.goToFloor(this.floorNum());
            } else {
                //THIS CHECK IS THE BOUNDARY CONDITION IF ONE DIRECIOTN IS PRESSED ALREADY AND THEN THE OTHER DIRECITON IS PRESSED
                //NO NEED TO GO TO FLOOR TWICE.  THIS CHECK MIGHT BE ABLE TO BE REMOVED WHEN WE ADD INDICATOR AND SEPERATE OUT UP/DOWN                 \
                if(queue.indexOf(this.floorNum()) === -1) {
                    queue.push(this.floorNum());
                }
            }
        }

        //intialzie floors
        floors.forEach(function(floor) {
            floor.on("up_button_pressed", floorBehavior);
            floor.on("down_button_pressed", floorBehavior);
        });
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}