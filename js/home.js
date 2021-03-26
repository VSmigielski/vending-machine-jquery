// Check that the document is ready
$(document).ready(function () {
	// Initialize the moneyInput to 0
    $('#moneyInput').val('0.00');

	// Call function to load in api dynamically
    loadItems();

	// When the Add Dollar is clicked
    $('#addDollarButton').click(function (event) {
		// Define variable that will be updated in the html through jquery
		var currentTotalVal = $('#moneyInput').val();
		// Define a variable to hold the amount to be added
		var newAmount = Number(currentTotalVal) + 1.00;
		// Update the readonly area for the money, make sure it shows 
		// to 2 decimal places
		$('#moneyInput').val(newAmount.toFixed(2));
	});

	// When the Add Quarter is clicked
	$('#addQuarterButton').click(function (event) {
		// Define variable that will be updated in the html through jquery
		var currentTotalVal = $('#moneyInput').val();
		// Define a variable to hold the amount to be added
		var newAmount = Number(currentTotalVal) + .25;
		// Update the readonly area for the money, make sure it shows 
		// to 2 decimal places
		$('#moneyInput').val(newAmount.toFixed(2));

	});

	// When the Add Dime is clicked
	$('#addDimeButton').click(function (event) {
		// Define variable that will be updated in the html through jquery
		var currentTotalVal = $('#moneyInput').val();
		// Define a variable to hold the amount to be added
		var newAmount = Number(currentTotalVal) + .10;
		// Update the readonly area for the money, make sure it shows 
		// to 2 decimal places
		$('#moneyInput').val(newAmount.toFixed(2));

	});

	// When the Add Nickel is clicked
	$('#addNickelButton').click(function (event) {
		// Define variable that will be updated in the html through jquery
		var currentTotalVal = $('#moneyInput').val();
		// Define a variable to hold the amount to be added
		var newAmount = Number(currentTotalVal) + .05;
		// Update the readonly area for the money, make sure it shows 
		// to 2 decimal places
		$('#moneyInput').val(newAmount.toFixed(2));

	});

	// Call the returnChange function
    returnChange();

	// Call the makePurchase function
    makePurchase();

});

// This function will return the API information dynamically
function loadItems() {
	// Define variable to hold the html to be updated
    var grid1 = $('#gridContentCol1');
	// Define variable to hold the html to be updated
    var grid2 = $('#gridContentCol2');
	// Define variable to hold the html to be updated
    var grid3 = $('#gridContentCol3');

	// This will format the currency to 2 decimal places and include a dollar sign
    const formatToCurrency = amount => {
		// Returns the format
        return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
      };

	  // Ajax call to API to retrieve the information through 'GET' http method
    $.ajax({
		// Type of http method
        type: 'GET',
		// URL to go to
        url: 'https://tsg-vending.herokuapp.com/items',
		// If the call succeeds, retrieve the array and the indexes
        success: function(itemArray) {
			// For each of the items
            $.each(itemArray, function(index, item){
				// Define variable to hold id
                var id = item.id;
				// Define variable to hold name
                var name = item.name;
				// Define variable to hold price
                var price = item.price;
				// Define variable to hold quantity
                var quantity = item.quantity;
				// Define variable to display the dynamically retrieved information on cards with bootstrap
				// When the card is clicked, use the id inside to link it to the itemToVend text
				// Style the inside of the card with center text-align and a height of 225
                var card = '<div class="card" onclick="selectedItem(' + id + ')" style="height:225px; text-align:center; font-weight:700">';
                	// Set up the card body    
					card += '<div class="card-body">';
					// Set up the alignment of id, override the center-align above
                    card += '<div style="text-align:left">' + id + '</div>';
					// Use a break to give space, place the name, and use another two breaks to give more space
                    card += '<br />' + name + '<br /><br />';
					// Format the price using formatToCurrency function, use break to give space
                    card += '$'+ formatToCurrency(price) + '<br /><br />';
					// Display the quantity left, close off the divs, and add one last break for space
                    card += 'Quantity Left: ' + quantity + '</div></div><br />';
                
					// Use the modulus to assign where the cards go by index
                    if(index % 3 == 0){
					// Add the care to grid1 / column 1
                    grid1.append(card);
                }
				// Use the modulus to assign where the cards go by index
                else if(index % 3 == 1){
					// Add the care to grid2 / column 2
                    grid2.append(card);
                }
				// Use the modulus to assign where the cards go by index
                else if(index % 3 == 2){
					// Add the care to grid3 / column 3
                    grid3.append(card);
                }

            })
        },
		// If there is an error retrieving the information, show this error message
        error: function() {
			// This will be "above" the columns and forms
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    });
}

// This selects the value of the id from the dynamically retrieved information
function selectedItem(id) {
	// This is the selector for this html element
    $('#itemToVend').val(id);
	$('#changeInputBox').val('');
}
 
// This is the function when making a purchase
function makePurchase() {
	// When a user clicks the make purchase button
    $('#purchaseButton').click(function (event) {
		// Define a variable to retrieve the amount of total money in
		var amount = $('#moneyInput').val();
		// Define a variable to retrieve the id of the item to be purchased
		var id = $('#itemToVend').val();
		
		// Ajax call to POST http method to make a purchase
		$.ajax({
			// Post http method
			type: 'POST',
			// URL for the api to use POST, uses the variables from above
			url: '	https://tsg-vending.herokuapp.com/money/' + amount + '/item/' + id,
			// This sends/accepts the information in JSON format
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			// This is the type of data
			'dataType': 'json',
			// If the request is a success, retrieve: quarters, dimes, nickels, pennies
			success: function(data) {
				// Define variable for quarters from the response
				var quarters = data.quarters;
				// Define variable for dimes from the response
				var dimes = data.dimes;
				// Define variable for nickels from the response
				var nickels = data.nickels;
				// Define variable for pennies from the response
				var pennies = data.pennies;

				// Use the formatChange function to properly format a response to put inside the html
				formatChange(quarters, dimes, nickels, pennies);
				// Show a message that the purchase went through in the messages form
				$('#vendingMessage').val('Thank you for your purchase!');
				// Reset the money input to 0 since change is "dispensed"
				$('#moneyInput').val('0.00');
				// Reset the Item number to nothing 
				$('#itemToVend').val('');
				// Clear the previously loaded cards
				clearCards();
				// Reload the items with their current&updated information
				loadItems();
			},
			// If there is an error buying an item, retrieve the response
			error: function(xhr, status, error) {
				// Define a variable to hold the error response 
				var responseText = jQuery.parseJSON(xhr.responseText);
				// Update the message displayed to give user's the correct error
           		$('#vendingMessage').val( responseText.message);
				// Clear the cards
				clearCards();
				// Reload the current/updated cards
           		loadItems();
			}
		});
	});
}

// A function to clear the loaded cards from the html page
function clearCards() {
	// Define a variable for Column 1
	var grid1 = $('#gridContentCol1');
	// Define a variable for Column 2
    var grid2 = $('#gridContentCol2');
	// Define a variable for Column 3
    var grid3 = $('#gridContentCol3');
	// Empty Column 1
	$(grid1).empty();
	// Empty Column 2
	$(grid2).empty();
	// Empty Column 3
	$(grid3).empty();
}

// Formats the change that is given
function formatChange(quarters, dimes, nickels, pennies) {
	// Define a variable to hold the message
	var changeMsg = '';
	// This allows a check on whether or not to add a comma to the output
	var coinsLeft = quarters + dimes + nickels + pennies;

	// "Subtract" the quarters from the coinsleft variable
	coinsLeft -= quarters;
	// If there is one quarter and there are more coins left
	if (quarters == 1 & coinsLeft > 0) {
		// Append the change message with this
		changeMsg += quarters + ' Quarter, ';
	// If there is one quarter and there are no more coins left
	} else if (quarters == 1 & coinsLeft == 0) {
		// Append the change message with this
		changeMsg += quarters + ' Quarter ';
	// If there is more than one quarter and more coins left
	} else if (quarters > 1 & coinsLeft > 0) {
		// Append the change message with this
		changeMsg += quarters + ' Quarters, ';
	// If there is more than one quarter and no coins left
	} else if (quarters > 1 & coinsLeft == 0) {
		// Append the change message with this
		changeMsg += quarters + ' Quarters ';
	}

	// "Subtract" the dimes from the coinsleft variable
	coinsLeft -= dimes;
	// If there is one dime and there are more coins left
	if (dimes == 1 & coinsLeft > 0) {
		// Append the change message with this
		changeMsg += dimes + ' Dime, ';
	// If there is one dime and there are no more coins left
	} else if (dimes == 1 & coinsLeft == 0) {
		// Append the change message with this
		changeMsg += dimes + ' Dime ';
	// If there is more than one dime and more coins left
	} else if (dimes > 1 & coinsLeft > 0) {
		// Append the change message with this
		changeMsg += dimes + ' Dimes, ';
	// If there is more than one dime and no coins left
	} else if (dimes > 1 & coinsLeft == 0) {
		// Append the change message with this
		changeMsg += dimes + ' Dimes ';
	}

	// "Subtract" the nickels from the coinsleft variable
	coinsLeft -= nickels;
	// If there is one nickels and there are more coins left
	if (nickels == 1 & coinsLeft > 0) {
		// Append the change message with this
		changeMsg += nickels + ' Nickel, ';
	// If there is one nickels and there are no more coins left
	} else if (nickels == 1 & coinsLeft == 0) {
		// Append the change message with this
		changeMsg += nickels + ' Nickel ';
	} 

	// There are no more coins left to check once we get here
	// If there is one penny
	if (pennies == 1) {
		// Append the change message with this
		changeMsg += pennies + ' Penny ';
	// If there is more than 1 penny
	} else if (pennies > 1) {
		// Append the change message with this
		changeMsg += pennies + ' Pennies ';
	}
	
	// Display the change message inside the change input return form
	$('#changeInputBox').val(changeMsg);
}

// The function to return change when nothing's been purchased
function returnChange() {
	// When the return change button is clicked
    $('#returnChangeButton').click(function (event) {
		// Define variable to hold the value in total money in
		var total = $('#moneyInput').val();
		// Define a variable to hold quarter count
		var quarterCount = 0;
		// Define a variable to hold dime count
		var dimeCount = 0;
		// Define a variable to hold nickel count
		var nickelCount = 0;
		// Define a variable to hold penny count
		var pennyCount = 0;


		// Check if the total money in is more than 0
		if (total > 0.00) {
			// Define a variable for the total being the value of money in
			var total = $('#moneyInput').val();
			// Multiply the total by 100 so that we're able to work with whole numbers
			var temp = total * 100;
			// This is to check the cents amount
			var totalPennies = temp.toFixed(2);
	
			// While the cent amount is over 25
			while (totalPennies >= 25){
				// Accumulate quarters
				quarterCount++;
				// Subtract 0.25 from the cents
				totalPennies -= 25;
			}

			// While the cent amount is over 10
			while (totalPennies >= 10){
				// Accumulate dimes
				dimeCount++;
				// Subtract 0.10 from the cents
				totalPennies -= 10;
			}

			// While the cent amount is over 5
			while (totalPennies >= 5){
				// Accumulate nickels
				nickelCount++;
				// Subtract 0.05 from the cents
				totalPennies -= 5;
			}

			// While the cent amount is greater than 1
			while (totalPennies >= 1){
				// Accumulate pennies
				pennyCount++;
				// Subtract 0.01 from the cents
				totalPennies -= 1;
			}

			// Reset the money input to 0
			$('#moneyInput').val('0.00');
		}

		// Use the format change function to format the counts (similarly to sending a JSON response)
		formatChange(quarterCount, dimeCount, nickelCount, pennyCount);
		
	}); 
}

