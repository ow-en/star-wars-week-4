//When the html is fully loaded...
$(document).ready(function(){
	var attack = $("#attackButton");

	var obi = $("#movableObi");
	var luke = $("#movableLuke");
	var maul = $("#movableMaul");
	var vader = $("#movableVader");

	var obiHealthBar = $("#obiHealth");
	var lukeHealthBar = $("#lukeHealth");
	var vaderHealthBar = $("#vaderHealth");
	var maulHealthBar = $("#maulHealth");

	var charSelect = $("#charSelectDiv");
	var yourFighter = $("#charSlot");
	var yourEnemies = $("#becomeEnemy")
	var yourDefender = $("#defenderSlot");
	var fightSection = $("#fightSection");

	var charNum = 0;
	var playerWin = 0;

	var obiWan = {
		name: "Obi-Wan",
		baseAttackPower:5,
		currentAttackPower:5,
		health:180,
		attackDefend:-1
	};
	var lukeSkywalker = {
		name: "Luke Skywalker",
		baseAttackPower:6,
		currentAttackPower:6,
		health:150,
		attackDefend:-1
	};
	var darthMaul = {
		name: "Darth Maul",
		baseAttackPower:7,
		currentAttackPower:7,
		health:140,
		attackDefend:-1
	};
	var darthVader = {
		name: "Darth Vader",
		baseAttackPower:7,
		currentAttackPower:7,
		health:170,
		attackDefend:-1
	};

	var currentAttacker = {
		name: " ",
		baseAttackPower: 0,
		currentAttackPower: 0,
		health: 0,
		attackDefend: 20
	}

	var currentDefender = {
		name: " ",
		baseAttackPower: 0,
		currentAttackPower: 0,
		health: 0,
		attackDefend: 20
	}

	var attackerHealthBar;
	var defenderHealthBar;

	var attackerDiv;
	var defenderDiv;


	attack.on("click", function(){
		if (charNum > 4 && charNum != 6) {
			clickBattle(currentAttacker, attackerHealthBar, currentDefender, defenderHealthBar);
		}
	})

	//This function executes when attack button is clicked on AND when charNum > 4 (indicating 2 fighters are locked into battle).
	function clickBattle(attacker, attackerHB, defender, defenderHB){

		//Attackers health can only decrease by the defender's base attack power.
		//Defenders health will decrease by currentAttackPower
		//Increase attackers current power by their (the attackers) base power
		attacker.health -= defender.baseAttackPower;
		defender.health -= attacker.currentAttackPower;
		attacker.currentAttackPower += attacker.baseAttackPower;

		//If either attacker or defender's health falls below zero, make it zero.
		if (defender.health <= 0){
			defender.health = 0;

			//Attack/defend value of 2 signifies a death.
			defender.attackDefend = 2;
		}
		if (attacker.health <= 0){
			attacker.health = 0;

			attacker.attackDefend = 2;
		}

		//Change the html text to reflect the changes in health
		attackerHB.html(attacker.health);
		defenderHB.html(defender.health);


		$("#emptyAttack").html("You attacked " + defender.name + " for " + attacker.currentAttackPower + " damage.");
		$("#emptyDefend").html(defender.name + " counter attacked for " + defender.baseAttackPower + " damage.");
	


		checkHealth(attacker, defender);
		
	}
	//This function checks the health and determins of a character has died
	function checkHealth(attacker, defender){
		if (defender.health == 0){
			//Alert and remove div
			$("#emptyAttack").html("You attacked " + defender.name + " for " + attacker.currentAttackPower + " damage and killed him!");
			$("#emptyDefend").html(defender.name + " counter attacked for " + defender.baseAttackPower + " damage just before he died.");

			alert("You defeated " + defender.name + " !" + "\n" + "Select a new enemy to fight.");
			defenderDiv.remove();

			//make the click attack do nothing when clicked
			charNum = 6;
			//Need to count playerwin so the game eventually comes to an end
			playerWin += 1;

				//If the character defeats all others
				if (playerWin == 3) {
					alert("You win the game!" + "\n" + "(No more enemies to select)" );
					window.location.reload();
				}
		}
		if (attacker.health == 0){
			//Alert and remove div
			$("#emptyAttack").html("You attacked " + defender.name + " for " + attacker.currentAttackPower + " damage");
			$("#emptyDefend").html(defender.name + " counter attacked for " + defender.baseAttackPower + " damage and killed you.");


			alert("You lost to " + defender.name + " !" + "\n" + "Start over!");
			attackerDiv.remove();

			//you lose
			charNum = 6;
		}
	}


	//Select the character and it gets pulled to the left. All other characters pulled to the right.
	//Also, once a character has been selected, the others cannot be selected anymore.
	//However, the player can press their selected character to put it back on the roster.

	obi.on("click", function(){
		//Since charNum loads up as 0, this means that when the user clicks on obi, the following if statement will execute.
   		if (charNum == 0){
	    	//Give the enemies highlights and resize their divs
	    	adjustEnemyAfterSelection(luke,maul,vader);

	    	//Shuffle the character divs around into fighter and enemy divs
	    	yourFighter.append(obi);
	    	yourEnemies.append(luke, maul, vader);

	    	//Resize to fit your character div
	    	obi.removeClass("col-sm-2");
	    	obi.addClass("col-sm-12");

	    	//charNum is changed to 1, which is a value that will later signify having selected obi-wan 
	    	charNum = 1;
	    	obiWan.attackDefend = 1;
	    	console.log("You selected Obi-Wan: " + charNum);
	    }
	    //After the first click on vader, charNum is 1. Therfore, the next time vader is clicked this else if will run.
	    //Essentially, it changes the classes back to what they were before the above if statement arranged them.	    
	    else if (charNum == 1) {
	    	//Remove the enemy highlights
	    	adjustEnemyAfterDeselection(luke,maul,vader);

	    	//Shuffle the character divs around into fighter and enemy divs
	    	charSelect.append(obi);
	    	charSelect.append(luke, maul, vader);

	    	//Resize the div to fill out the full width of the very first row div
	    	obi.removeClass("col-sm-12");
	    	obi.addClass("col-sm-2");

			//charNum is changed to 0, which is a value that will later signify having de-selected obi-wan 
	    	charNum = 0;
	    	obiWan.attackDefend = -1;
	    	console.log("You de-selected Obi-Wan: " + charNum);
	    }

	    //The above if else-if acts as a toggle. When it is "toggled on", the user is able to enter the if else-if below.
	    //The user must first choose their character and then they are able to choose their enemy.
	    
    	//If vader is chosen first and obi second...	    
	    if (charNum == 4){
	    	//Append obi as the defender
	    	appendDefender(obi);

	    	//Based off observations, in this scenario luke needs a margin to make the enemies section centered
	    	luke.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = vaderHealthBar;
	    	defenderHealthBar = obiHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = vader;
	    	defenderDiv = obi;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(darthVader, obiWan);	    	
	    }
    	//If maul is chosen first and obi second...	    
	    else if (charNum == 3){
	    	//Append obi as the defender
	    	appendDefender(obi);

	    	//Based off observations, in this scenario luke needs a margin to make the enemies section centered
	    	luke.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = maulHealthBar;
	    	defenderHealthBar = obiHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = maul;
	    	defenderDiv = obi;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(darthMaul, obiWan);	  
	    }	    
	    //Else if luke first and obi second...
	    else if (charNum == 2){
	    	//Append obi as the defender
	    	appendDefender(obi);

	    	//Based off observations, in this scenario maul needs a margin to make the enemies section centered
	    	maul.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = lukeHealthBar;
	    	defenderHealthBar = obiHealthBar;	

	    	//Current attacker and defender divs
	    	attackerDiv = luke;
	    	defenderDiv = obi;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(lukeSkywalker, obiWan);    	
	    }

		//When the first round finishes, the defenders "attack status" is set to two, signifying he has died and a new character can be selected to fight against.
		//And we only want obi to be selectable if he has not battled before
		if (currentDefender.attackDefend == 2 && obiWan.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(obi);

	    	//Set obi into defense position
	    	obiWan.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(obiWan, obi, obiHealthBar);

	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;

		}
		else if (currentDefender.attackDefend == 3 && obiWan.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(obi);

	    	//Set obi into defense position
	    	obiWan.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(obiWan, obi, obiHealthBar);

	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;
		}
    })
    luke.on("click", function(){
 		//Since charNum loads up as 0, this means that when the user clicks on obi, the following if statement will execute.
    	if (charNum == 0){
	    	//Give the enemies highlights and resize their divs
	    	adjustEnemyAfterSelection(obi,maul,vader);

	    	//Shuffle the character divs around into fighter and enemy divs
	    	yourFighter.append(luke);
	    	yourEnemies.append(obi, maul, vader);

	    	//Resize to fit your character div
	    	luke.removeClass("col-sm-2");
	    	luke.addClass("col-sm-12");

			//charNum is changed to 2, which is a value that will later signify having selected luke skywalker. 
	    	charNum = 2;
	    	lukeSkywalker.attackDefend = 1;
	    	console.log("You selected Luke: " + charNum);
	    }
	    //After the first click on luke skywalker, charNum is 2. Therfore, the next time vader is clicked this else if will run.
	    //Essentially, it changes the classes back to what they were before the above if statement arranged them.	    
	    else if (charNum ==2) {
	    	//Remove the enemy highlights
	    	adjustEnemyAfterDeselection(obi, maul, vader);

	    	//Shuffle the character divs around into fighter and enemy divs
	    	charSelect.append(luke);
	    	charSelect.append(obi, maul, vader);

	    	//Resize the div to fill out the full width of the very first row div
	    	luke.removeClass("col-sm-12");
	    	luke.addClass("col-sm-2");

			//charNum is changed to 0, which is a value that will later signify having selected luke skywalker.
	    	charNum = 0;
	    	lukeSkywalker.attackDefend = -1;
	    	console.log("You de-selected Luke: " + charNum);
	    }

	    //The above if else-if acts as a toggle. When it is "toggled on", the user is able to enter the if else-if below.
	    //The user must first choose their character and then they are able to choose their enemy.

    	//If vader is chosen first and luke second...	    
	    if (charNum == 4){
	    	//Append luke as the defender
	    	appendDefender(luke);

	    	//Based off observations, in this scenario obi needs a margin to make the enemies section centered
	    	obi.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = vaderHealthBar;
	    	defenderHealthBar = lukeHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = vader;
	    	defenderDiv = luke;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(darthVader, lukeSkywalker);
	    }
    	//If maul is chosen first and luke second...	    
	    else if (charNum == 3){
	    	//Append luke as the defender
	    	appendDefender(luke);

	    	//Based off observations, in this scenario obi needs a margin to make the enemies section centered	    	
	    	obi.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = maulHealthBar;
	    	defenderHealthBar = lukeHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = maul;
	    	defenderDiv = luke;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(darthMaul, lukeSkywalker);
	    }	    
	    //Else if obi was chosen second and luke second...
	    else if (charNum == 1){
	    	//Append luke as the defender
	    	appendDefender(luke);

	    	//Based off observations, in this scenario maul needs a margin to make the enemies section centered	 
	    	maul.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = obiHealthBar;
	    	defenderHealthBar = lukeHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = obi;
	    	defenderDiv = luke;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(obiWan, lukeSkywalker);
	    }	

		//When the first round finishes, the defenders "attack status" is set to two, signifying he has died and a new character can be selected to fight against.
		//And we only want obi to be selectable if he IS NOT the attacker and if he has not died.
		if (currentDefender.attackDefend == 2 && lukeSkywalker.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(luke);

	    	//Set obi into defense position
	    	lukeSkywalker.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(lukeSkywalker, luke, lukeHealthBar);

	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;				    
		}
		else if (currentDefender.attackDefend == 3 && lukeSkywalker.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(luke);

	    	//Set obi into defense position
	    	lukeSkywalker.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(lukeSkywalker, luke, lukeHealthBar);

	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;			
		}
    })
    maul.on("click", function(){
 		//Since charNum loads up as 0, this means that when the user clicks on obi, the following if statement will execute.
    	if (charNum == 0){
	    	//Give the enemies highlights and resize their divs
	    	adjustEnemyAfterSelection(obi,luke,vader);

	    	//Shuffle the character divs around into fighter and enemy divs
	    	yourFighter.append(maul);
	    	yourEnemies.append(obi, luke, vader);

	    	//Resize the div to fill out the full width of the very first row div
	    	maul.removeClass("col-sm-2");
	    	maul.addClass("col-sm-12");

			//charNum is changed to 3, which is a value that will later signify having selected darth maul.
	    	charNum = 3;
	    	darthMaul.attackDefend = 1;
	    	console.log("You selected Maul: " + charNum);
		}
	    //After the first click on darth maul, charNum is 3. Therfore, the next time vader is clicked this else if will run.
	    //Essentially, it changes the classes back to what they were before the above if statement arranged them.
		else if (charNum == 3) {
	    	//Remove the enemy highlights
	    	adjustEnemyAfterDeselection(obi, luke, vader);

	    	//Shuffle the character divs around into fighter and enemy divs
	    	charSelect.append(maul);
	    	charSelect.append(obi, luke, vader);

	    	//Resize the div to fill out the full width of the very first row div
	    	maul.removeClass("col-sm-12");
	    	maul.addClass("col-sm-2");

	    	//charNum is changed to 0, which is a value that will later signify having de-selected darth maul
	    	charNum = 0;
	    	darthMaul.attackDefend = -1;
	    	console.log("You de-selected Maul: " + charNum);
		}

	    //The above if else-if acts as a toggle. When it is "toggled on", the user is able to enter the if else-if below.
	    //The user must first choose their character and then they are able to choose their enemy.

    	//If obi is chosen first and maul second.	    
	    if (charNum == 1){
	    	//Append maul as the defender
	    	appendDefender(maul);

	    	//Based off observations, in this scenario luke needs a margin to make the enemies section centered	 
	    	luke.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = obiHealthBar;
	    	defenderHealthBar = maulHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = obi;
	    	defenderDiv = maul;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(obiWan, darthMaul);	    	
	    }
	    //If vader is chosen first and maul second
	    else if (charNum == 4){
	    	//Append maul as the defender
	    	appendDefender(maul);

	    	//Based off observations, in this scenario obi needs a margin to make the enemies section centered	 
	    	obi.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = vaderHealthBar;
	    	defenderHealthBar = maulHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = vader;
	    	defenderDiv = maul;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(darthVader, darthMaul);	
	    }
	    //If luke is chosen first and maul second
	    else if (charNum == 2){
	    	//Append maul as the defender
	    	appendDefender(maul);

	    	//Based off observations, in this scenario obi needs a margin to make the enemies section centered	 
	    	obi.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = lukeHealthBar;
	    	defenderHealthBar = maulHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = luke;
	    	defenderDiv = maul;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(lukeSkywalker, darthMaul);	
	    }

		//When the first round finishes, the defenders "attack status" is set to two, signifying he has died and a new character can be selected to fight against.
		//And we only want obi to be selectable if he IS NOT the attacker and if he has not died.
		if (currentDefender.attackDefend == 2 && darthMaul.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(maul);

	    	//Set obi into defense position
	    	darthMaul.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();	

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(darthMaul, maul, maulHealthBar);
	    		
	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;
		}
		else if (currentDefender.attackDefend == 3 && darthMaul.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(maul);

	    	//Set obi into defense position
	    	darthMaul.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();	

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(darthMaul, maul, maulHealthBar);
	    		
	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;			
		}
    })
    vader.on("click", function(){
		//Since charNum loads up as 0, this means that when the user clicks on obi, the following if statement will execute.
    	if (charNum == 0){
	    	//Give the enemies highlights and resize their divs
	    	adjustEnemyAfterSelection(obi,luke,maul);

	    	//Shuffle the character into the fighter and enemy divs
	    	yourFighter.append(vader);
	    	yourEnemies.append(obi, luke, maul);

	    	//Resize the div to fill out the full width of the very first row div
	    	vader.removeClass("col-sm-2");
	    	vader.addClass("col-sm-12");

			//charNum is changed to 4, which is a value that will later signify having selected darth vader
	    	charNum = 4;
	    	darthVader.attackDefend = 1;
	    	console.log("You selected Vader: " + charNum);	
	    }
	    //After the first click on vader, charNum is 4. Therfore, the next time vader is clicked this else if will run.
	    //Essentially, it changes the classes back to what they were before the above if statement arranged them.
	    else if (charNum == 4) {
	    	//Remove the enemy highlights
	    	adjustEnemyAfterDeselection(obi, luke, maul);

	    	//Shuffle the character into the fighter and enemy divs
	    	charSelect.append(vader);
	    	charSelect.append(obi, luke, maul);

	    	//Resize the div to fill out the full width of the very first row div
	    	vader.removeClass("col-sm-12");
	    	vader.addClass("col-sm-2");

			//charNum is changed to 0, which is a value that will later signify having de-selected darth vader
	    	charNum = 0;
	    	darthVader.attackDefend = -1;
	    	console.log("You de-selected Vader: " + charNum);
	    }

	    //The above if else-if acts as a toggle. When it is "toggled on", the user is able to enter the if else-if below.
	    //The user must first choose their character and then they are able to choose their enemy.
	    
    	//If obi is chosen first and vader second...	    
	    if (charNum == 1){
	    	//Append vader as the defender
	    	appendDefender(vader);

	    	//Based off observations, in this scenario luke needs a margin to make the enemies section centered	
	    	luke.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = obiHealthBar;
	    	defenderHealthBar = vaderHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = obi;
	    	defenderDiv = vader;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(obiWan, darthVader);	    	
	    }
	    //If luke is chosen first and vader second...
	    else if (charNum == 2){
	    	//Append vader as the defender
	    	appendDefender(vader);

	    	//Based off observations, in this scenario obi needs a margin to make the enemies section centered	
	    	obi.addClass("firstMargin");


	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = lukeHealthBar;
	    	defenderHealthBar = vaderHealthBar;	

	    	//Current attacker and defender divs
	    	attackerDiv = luke;
	    	defenderDiv = vader;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(lukeSkywalker, darthVader);
	    }	    
	    //If maul is chosen first and vader second...
	    else if (charNum == 3){
	    	//Append vader as the defender
	    	appendDefender(vader);

	    	//Based off observations, in this scenario obi needs a margin to make the enemies section centered	
	    	obi.addClass("firstMargin");

	    	//Current attackers health bar to the <p></p> associated with the characters health.
	    	attackerHealthBar = maulHealthBar;
	    	defenderHealthBar = vaderHealthBar;

	    	//Current attacker and defender divs
	    	attackerDiv = maul;
	    	defenderDiv = vader;

	    	//Make it so the attacker/defender is locked in
	    	lockChars(darthMaul, darthVader);    	
	    }	   


		//When the first round finishes, the defenders "attack status" is set to two, signifying he has died and a new character can be selected to fight against.
		//And we only want obi to be selectable if he IS NOT the attacker and if he has not died.
		if (currentDefender.attackDefend == 2 && darthVader.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(vader);

	    	//Set obi into defense position
	    	darthVader.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(darthVader, vader, vaderHealthBar);
	    		
	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;
		}    	
		else if (currentDefender.attackDefend == 3 && darthVader.attackDefend == -1){
	    	//Put the character in the defender section
	    	appendDefender(vader);

	    	//Set obi into defense position
	    	darthVader.attackDefend = 0;

	    	//Fix the enemy divs to be centered
	    	adjustEnemyRound2();

	    	//I need to assign these placeholder variables with the ones associated to the defender in order write to html
	    	placeholdersR2R3(darthVader, vader, vaderHealthBar);
	    		
	    	//charNum of 7 allows the click button to become usable again
	    	charNum = 7;			
		}
    })


	//These functions adjust the divs as they change when being moved around
	function adjustEnemyAfterSelection (d1, d2, d3){
		//Add highlights of the remaining 3 enemies
    	d1.addClass("highlightEnemies");
    	d2.addClass("highlightEnemies");
    	d3.addClass("highlightEnemies");

    	//Resize by removing bootstrap classes then adding new ones
    	d1.removeClass("col-sm-2");
    	d2.removeClass("col-sm-2");
    	d3.removeClass("col-sm-2");

    	d1.addClass("col-sm-4");
    	d2.addClass("col-sm-4");
    	d3.addClass("col-sm-4");
	}
	function adjustEnemyAfterDeselection (d1, d2, d3){
		//Remove highlights of the remaining 3 enemies
    	d1.removeClass("highlightEnemies");
    	d2.removeClass("highlightEnemies");
    	d3.removeClass("highlightEnemies");

    	//Resize by removing bootstrap classes, then adding new ones
    	d1.removeClass("col-sm-4");
    	d2.removeClass("col-sm-4");
    	d3.removeClass("col-sm-4");
    	
    	d1.addClass("col-sm-2");
    	d2.addClass("col-sm-2");
    	d3.addClass("col-sm-2");   	
	}

	//This function execute when the user selects their character and then a second character. It also makes it so no character's divs can be clicked on.
	function lockChars(attacker, defender){
		//Fill in the empty objects with the values for the attacker
		currentAttacker.name = attacker.name;
		currentAttacker.health = attacker.health;
		currentAttacker.baseAttackPower = attacker.baseAttackPower;
		currentAttacker.currentAttackPower = attacker.currentAttackPower;
		currentAttacker.attackDefend = attacker.attackDefend;
		//Do the same for the defender
		currentDefender.name = defender.name;
		currentDefender.health = defender.health;
		currentDefender.baseAttackPower = defender.baseAttackPower;
		currentDefender.currentAttackPower = defender.currentAttackPower;
		currentDefender.attackDefend = defender.attackDefend;

		//With charNum set to 5, the character divs cannot be clicked on
		charNum = 5;

		//Signify that the defender is in the defensive state
		//Before this lockChars function was run, the attackers attackDefend was set to 1, which was then brought into this function and assigned currentAttacker.attackDefend
		currentDefender.attackDefend = 0;

		console.log(currentAttacker.name + " vs. " + currentDefender.name);
		console.log("Attacker status: " + currentAttacker.attackDefend + "\n" + "Defender status: " + currentDefender.attackDefend + "\n" + "charNum: " + charNum);
	}

	//Appends the chosen enemy into the defender section and changes some CSS classes to center everything
	function appendDefender (defender){
    	//Put the character in the defender section
    	yourDefender.append(defender);

    	//Resize by removing, then adding css classes
    	defender.removeClass("col-sm-4");
    	defender.addClass("col-sm-12");

    	//Change color of defender
    	defender.removeClass("highlightEnemies");
    	defender.addClass("highlightDefender");

    	//Margins that are added to adjust for the enemies section should be removed
    	defender.removeClass("firstMargin");
	}


	//Changes some CSS classes to center everything
	function adjustEnemyRound2(){
    	//If one of these characters are remaining
    	if (darthMaul.attackDefend == -1){
	    	//Based on observations the div of  the last enemy needs resizing
	    	maul.removeClass("firstMargin");
	    	maul.addClass("secondMargin");
	    }
	    if (darthVader.attackDefend == -1){
	    	//Based on observations the div of  the last enemy needs resizing
	    	vader.removeClass("firstMargin");
	    	vader.addClass("secondMargin");		    	
	    }
	    if (lukeSkywalker.attackDefend == -1){
	    	//Based on observations the div of  the last enemy needs resizing
	    	luke.removeClass("firstMargin");
	    	luke.addClass("secondMargin");	    	
	    }
	    if (obiWan.attackDefend == -1){
	    	//Based on observations the div of  the last enemy needs resizing
	    	obi.removeClass("firstMargin");
	    	obi.addClass("secondMargin");	 	    	
	    }

	    //If these characters were selected as the second defender
	    if (darthMaul.attackDefend == 0){
	    	maul.removeClass("firstMargin");
	    	maul.removeClass("secondMargin");
	    }
	    else if (darthVader.attackDefend == 0){
	    	vader.removeClass("firstMargin");
	    	vader.removeClass("secondMargin");
	    }	    
	    else if (lukeSkywalker.attackDefend == 0){
	    	luke.removeClass("firstMargin");
	    	luke.removeClass("secondMargin");
	    }
	    else if (obiWan.attackDefend == 0){
	    	obi.removeClass("firstMargin");
	    	obi.removeClass("secondMargin");
	    }	    		    		
	}
	//Brings in the defender object, the defenders movable div and the chosen defenders health
	function placeholdersR2R3(object, div, hb){
    	currentDefender = object;
    	defenderDiv = div;
    	defenderHealthBar = hb;
	}

})

