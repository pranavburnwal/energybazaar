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
var A = new HouseHold();
A.set_initial(8);
A.set_generation(2);
A.set_consumption(1);
A.set_capacity(10);
A.set_current(A.get_initial());

var B = new HouseHold();
B.set_initial(5);
B.set_generation(0);
B.set_consumption(1);
B.set_capacity(10);
B.set_current(B.get_initial());

var households = [A, B];
var no_houses = households.length;
var market_demand = 0;
var market_supply = 0;
var execute_smart_contract = 0;

// Market dynamics 
for (var time = 0; time < 10; time++) {

	for (var i = 0; i < no_houses; i++ ){
		
		households[i].set_current(households[i].get_current() + households[i].get_generation() - households[i].get_consumption());
		
		if (households[i].get_current() <= 0) {
			market_demand = 1;
		};
		
		if (households[i].get_current() > households[i].get_capacity()) {
			market_supply += households[i].get_current() - households[i].get_capacity();
		};
	};
	
	debug(A.get_current());
	debug(B.get_current());

	if (market_supply > 0 && Boolean(market_demand)) {
		exectue_exchange = 1;
	};
	debug("Time: "+time+" Exectue exchange?: "+Boolean(exectue_exchange));

	if (Boolean(exectue_exchange)){
		for (var i = 0; i < no_houses; i++ ){

			if (households[i].get_current() <= 0) {
				households[i].set_current(households[i].get_current() + market_supply);
			};
		
			if (households[i].get_current() > households[i].get_capacity()) {
				households[i].set_current(households[i].get_current() - market_supply);
			};
		};

	} else {
		for (var i = 0; i < no_houses; i++ ){

			if (households[i].get_current() <= 0) {
				households[i].set_current(0);
			};
		
			if (households[i].get_current() > households[i].get_capacity()) {
				households[i].set_current(households[i].get_capacity());
			};
		};
	};

	market_supply = 0;
	market_demand = 0;
}
