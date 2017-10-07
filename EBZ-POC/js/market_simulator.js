// Household structure
var HouseHold = (function() {
    // constructor
    function HouseHold() {
    	this._generation = 0;
    	this._consumption = 0;
    	this._capacity = 10;
    	this._current = 0;
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
	var B = new HouseHold();
	
	A.set_generation(Number(document.getElementById('A_generation').value));
	A.set_consumption(Number(document.getElementById('A_consumption').value));
	A.set_capacity(Number(document.getElementById('A_capacity').value));
	A.set_current(A.get_current());
	B.set_generation(Number(document.getElementById('B_generation').value));
	B.set_consumption(Number(document.getElementById('B_consumption').value));
	B.set_capacity(Number(document.getElementById('B_capacity').value));
	B.set_current(B.get_current());

	$('#A_current').html(A.get_current()+" KwH");
	$('#B_current').html(B.get_current()+" KwH");

	var households = [A,B]

	return households
};

function updateHouseholds(){	

	A.set_generation(Number(document.getElementById('A_generation').value));
	A.set_consumption(Number(document.getElementById('A_consumption').value));
	A.set_capacity(Number(document.getElementById('A_capacity').value));

	B.set_generation(Number(document.getElementById('B_generation').value));
	B.set_consumption(Number(document.getElementById('B_consumption').value));
	B.set_capacity(Number(document.getElementById('B_capacity').value));

};

// Clock
var h = 0;
document.getElementById('clock').innerHTML = "Time " + "0" + h + ":00";

// Simulation
function runSimulation() {
	
	if (BlockChainActive == false) {
		swal({
			customClass: "activate-warning",
			showConfirmButton:false,
  			text: "To see the smart contracted generated by the simulated market dyamics, please first activate the blockchain",
  			type: "warning",
		});
		return;
	}

	// Account disclaimer for POC
	// Deploying address = web3.eth.accounts[0]
	// Household A (Singh) = web3.eth.accounts[1]
	// Household B (Chopra) = web3.eth.accounts[2]
	// Household A (Singh) Smartmeter = web3.eth.accounts[3]
	// Household B (Chopra) Smartmeter = web3.eth.accounts[4]

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

			updateHouseholds();

			A.set_current(A.get_current() + A.get_generation() - A.get_consumption());
			if (A.get_current() <= 0) {
				// A available stored energy is lower than 0, so A is demanding
				// Set status to demanding
				document.getElementById("A_demand").style.display = 'block';
				document.getElementById("A_balance").style.display = 'none';
				document.getElementById("A_supply").style.display = 'none';

				$('#A_tokens').html(checkUserBalance(web3.eth.accounts[1]));
				// As A is demanding energy, we check for available coins to exchange for energy
				// Set status to using
				document.getElementById("A_using").style.display = 'block';
				document.getElementById("A_minting").style.display = 'none';
				$('#A_using').html("<label>Household Singh: Using Tokens</label><div> EBZ account balance is: "
					  + checkUserBalance(web3.eth.accounts[1]))
				A.set_current(0);
			} else if (A.get_current() > A.get_capacity()) {
				// As A is producing more energy than what it can store, we now mint coins
				// Set status to supplying
				document.getElementById("A_demand").style.display = 'none';
				document.getElementById("A_balance").style.display = 'none';
				document.getElementById("A_supply").style.display = 'block';
				for (i = 0; i < (A.get_current() - A.get_capacity()); i++) {
					mintTokens(web3.eth.accounts[1],web3.eth.accounts[2]);
				};
				$('#A_tokens').html(checkUserBalance(web3.eth.accounts[1]));
				document.getElementById("A_minting").style.display = 'block';
				document.getElementById("A_using").style.display = 'none';
				$('#A_minting').html("<label>Household Singh: Minting Tokens</label><div> Total available energy is: "
					  + A.get_current() + " KwH</div><div>Storing capcity is: "
					  + A.get_capacity() + " KwH</div><div>EnergyBazaar can now mint "
					  + (A.get_current() - A.get_capacity()) + " KwH for household Singh</div>"
					  + "Household Singh EBZ account balance is now: " + checkUserBalance(web3.eth.accounts[1]))
				A.set_current(A.get_capacity());
			} else {
				// otherwise set to balance
				document.getElementById("A_demand").style.display = 'none';
				document.getElementById("A_balance").style.display = 'block';
				document.getElementById("A_supply").style.display = 'none';
			};

			B.set_current(B.get_current() + B.get_generation() - B.get_consumption());
			if (B.get_current() <= 0) {
				// B available stored energy is lower than 0, so B is demanding
				// Set status to demanding
				document.getElementById("B_demand").style.display = 'block';
				document.getElementById("B_balance").style.display = 'none';
				document.getElementById("B_supply").style.display = 'none';
				$('#B_tokens').html(checkUserBalance(web3.eth.accounts[2]));
				document.getElementById("B_using").style.display = 'block';
				document.getElementById("B_minting").style.display = 'none';
				$('#B_using').html("<label>Household Chopra: Using Tokens</label><div> EBZ account balance is: "
					  + checkUserBalance(web3.eth.accounts[2]))
				B.set_current(0);
			} else if (B.get_current() > B.get_capacity()) {
				// As B is producing more energy than what it can store, we now mint coins
				// Set status to supplying
				document.getElementById("B_demand").style.display = 'none';
				document.getElementById("B_balance").style.display = 'none';
				document.getElementById("B_supply").style.display = 'block';
				for (i = 0; i < (B.get_current() - B.get_capacity()); i++) {
					mintTokens(web3.eth.accounts[2],web3.eth.accounts[1]);
				};
				$('#B_tokens').html(checkUserBalance(web3.eth.accounts[2]));
				document.getElementById("B_minting").style.display = 'block';
				document.getElementById("B_using").style.display = 'none';
				$('#B_minting').html("<label>Household Chopra: Minting Tokens</label><div> Total available energy is: "
					  + B.get_current() + " KwH</div><div>Storing capcity is: "
					  + B.get_capacity() + " KwH</div><div>EnergyBazaar can now mint "
					  + (B.get_current() - B.get_capacity()) + " KwH for household Singh</div>"
					  + "Household Singh EBZ account balance is now: " + checkUserBalance(web3.eth.accounts[2]))
				B.set_current(B.get_capacity());
			} else {
				// otherwise set to balance
				document.getElementById("B_demand").style.display = 'none';
				document.getElementById("B_balance").style.display = 'block';
				document.getElementById("B_supply").style.display = 'none';
			};

		$('#A_current').html(households[0].get_current()+ " KwH");
		$('#B_current').html(households[1].get_current()+ " KwH");
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