// Household structure
var HouseHold = (function() {
    // constructor
    function HouseHold() {
    	this._initial = 0;
    	this._generation = 0;
    	this._consumption = 0;
    	this._capacity = 10;
    	this._current = 0;
    };

    HouseHold.prototype.get_initial = function() {
        return this._initial;
    };
    HouseHold.prototype.set_initial = function(value) {
        this._initial = value;
    };
    HouseHold.prototype.get_generation = function() {
        return this._generation;
    };
    HouseHold.prototype.set_generation = function(value) {
        this._generation = value;
    };
    HouseHold.prototype.get_capacity = function() {
        return this._capacity;
    };
    HouseHold.prototype.set_capacity = function(value) {
        this._capacity = value;
    };
    HouseHold.prototype.get_consumption = function() {
        return this._consumption;
    };
    HouseHold.prototype.set_consumption = function(value) {
        this._consumption = value;
    };
    HouseHold.prototype.get_current = function() {
        return this._current;
    };
    HouseHold.prototype.set_current = function(value) {
        this._current = value;
    };
    return HouseHold;
})();

// Initiate two households
function loadHouseholds(){
	var A = new HouseHold();
	A.set_initial(Number(document.getElementById('A_initial').value));
	A.set_generation(Number(document.getElementById('A_generation').value));
	A.set_consumption(Number(document.getElementById('A_consumption').value));
	A.set_capacity(Number(document.getElementById('A_capacity').value));
	A.set_current(A.get_initial());

	var B = new HouseHold();
	B.set_initial(Number(document.getElementById('B_initial').value));
	B.set_generation(Number(document.getElementById('B_generation').value));
	B.set_consumption(Number(document.getElementById('B_consumption').value));
	B.set_capacity(Number(document.getElementById('B_capacity').value));
	B.set_current(B.get_initial());

	$('#A_current').html(A.get_current());
	$('#B_current').html(B.get_current());

	var households = [A,B]

	return households
};

// Clock
var h = 0;
document.getElementById('clock').innerHTML = "Time " + "0" + h + ":00";

// Simulation
function runSimulation() {
	
	households = loadHouseholds();
	A = households[0]
	B = households[1]
	marketDynamics();

	function marketDynamics() {
		
		if (h < 24) {
	    	h += 1;
	    	if (h < 10) {
	    		document.getElementById('clock').innerHTML = "Time " +  "0" + h + ":00";
	    	} else {
	    		document.getElementById('clock').innerHTML = "Time " +  h + ":00";
	    	}
	    	var timer = setTimeout(marketDynamics, 1500);
	    	if (h >= 24){
				clearTimeout(timer);
			};
		};

			A.set_current(A.get_current() + A.get_generation() - A.get_consumption());
			if (A.get_current() <= 0) {
				document.getElementById("A_demand").style.display = 'block';
				document.getElementById("A_balance").style.display = 'none';
				document.getElementById("A_supply").style.display = 'none';
				A.set_current(0);
			};

			if (A.get_current() > A.get_capacity()) {
				document.getElementById("A_demand").style.display = 'none';
				document.getElementById("A_balance").style.display = 'none';
				document.getElementById("A_supply").style.display = 'block';
				A.set_current(A.get_capacity());
			};

			B.set_current(B.get_current() + B.get_generation() - B.get_consumption());
			if (B.get_current() <= 0) {
				document.getElementById("B_demand").style.display = 'block';
				document.getElementById("B_balance").style.display = 'none';
				document.getElementById("B_supply").style.display = 'none';
				B.set_current(0);
			};

			if (B.get_current() > B.get_capacity()) {
				document.getElementById("B_demand").style.display = 'none';
				document.getElementById("B_balance").style.display = 'none';
				document.getElementById("B_supply").style.display = 'block';
				B.set_current(B.get_capacity());
			};

		$('#A_current').html(households[0].get_current());
		$('#B_current').html(households[1].get_current());
	};


	// var exectue_exchange = 0;
	// if (market_supply > 0 && Boolean(market_demand)) {
	// 	exectue_exchange = 1;
	// };

	// if (Boolean(exectue_exchange)){
	// 	for (var i = 0; i < no_houses; i++ ){

	// 		if (households[i].get_current() <= 0) {
	// 			households[i].set_current(households[i].get_current() + market_supply);
	// 		};
		
	// 		if (households[i].get_current() > households[i].get_capacity()) {
	// 			households[i].set_current(households[i].get_current() - market_supply);
	// 		};
	// 	};

	// } else {
	// 	for (var i = 0; i < no_houses; i++ ){

	// 		if (households[i].get_current() <= 0) {
	// 			households[i].set_current(0);
	// 		};
		
	// 		if (households[i].get_current() > households[i].get_capacity()) {
	// 			households[i].set_current(households[i].get_capacity());
	// 		};
	// 	};
	// };

	// market_supply = 0;
	// market_demand = 0;

};
