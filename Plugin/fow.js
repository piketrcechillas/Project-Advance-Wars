/**
 * Script by Goinza and Lady Rena.
 * 
 * Fog of War. Custom parameters:
 * For the map, use "fog", and as the values of that paramter use two other parameters called "color" (uses RGB values) and "alpha" (0-255).
 * For example: {fog:{color:0x333333, alpha:128}}
 * 
 * For the classes, use "baseVision" to give each class a particular range of vision. If this parameter is not used, the default value of 3 will be used.
 * For units, skills and states, you can give the paramter "extraVision" to give extra vision to the unit. This parameter is optional.
 * IMPORTANT: if a skill is made to grant extra vision, it must be a custom skill with the custom keyword "ExtraVision".
 */

/**
 * Missing mechanics (basic) 
 * You can't see any enemy during battle preparations (I don't think this can be fixed, I use getSortieList() to check vision, and until the battle preparations is finished, you can't use that list)
 * Ally units can attack invisible units
 */

//At the beginning of the map, the fog is updated
var fw01 = CurrentMap.prepareMap;
CurrentMap.prepareMap = function() {
	fw01.call(this);
	if (FogLight.isActive()) {
		FogLight.setFog();
	}
}

//Draws the fog
var fw03 = MapLayer.drawMapLayer;
MapLayer.drawMapLayer = function() {
	fw03.call(this);
	if (FogLight.isActive()) {
		FogLight.drawLight();
	}
}

//Every end of turn, the fog is updated
/*
var fw04 = TurnChangeStart.doLastAction;
TurnChangeStart.doLastAction = function() {
	fw04.call(this);
	if (root.getCurrentSession().getTurnType() == TurnType.PLAYER && FogLight.isActive()) {
		FogLight.setFog();
	}
	if (root.getCurrentSession().getTurnType() == TurnType.PLAYER2 && FogLight.isActive()) {
		FogLight.setFog();
	}
}*/

//Every time a player unit moves, the fow is updated
PlayerTurn._moveUnitCommand = function() {
	var result = this._mapSequenceCommand.moveSequence();

	//This part stops the player's movements when it hits an enemy player
	var stop = root.getMetaSession().global.stop;
	if (stop!=null && stop) {
		root.getMetaSession().global.stop = null;
		this.changeCycleMode(PlayerTurnMode.MAP)
		FogLight.setFog();		
		return MoveResult.CONTINUE;
	}
	
	if (result === MapSequenceCommandResult.COMPLETE) {
		this._mapSequenceCommand.resetCommandManager();
		MapLayer.getMarkingPanel().updateMarkingPanelFromUnit(this._targetUnit);
		this._changeEventMode();
		if (FogLight.isActive()) {			
			FogLight.setFog();
		}
	}
	else if (result === MapSequenceCommandResult.CANCEL) {
		this._mapSequenceCommand.resetCommandManager();
		this.changeCycleMode(PlayerTurnMode.MAP);
	}
	
	return MoveResult.CONTINUE;
}

SimulateMove._currentPos = {
	x: null,
	y: null
}

//Hides the movement of enemy units. Does not hide them when they are on idle animation
//It also stops the movement of the unit who moves on an tile occupied for a invisible unit
var fw05 = SimulateMove.drawUnit;
SimulateMove.drawUnit = function() {
	if (FogLight.isActive()) {
		var chipWidth = GraphicsFormat.MAPCHIP_WIDTH;
		var chipHeight = GraphicsFormat.MAPCHIP_HEIGHT;
		var x = Math.round(this._xPixel / chipWidth);
		var y = Math.round(this._yPixel / chipHeight);
		
		var unit = FogLight.getEnemyUnit(x, y)
		if (this._unit.getUnitType() !== UnitType.ENEMY && unit!=null) {
			//Player unit founds a enemy unit, must stop and end that unit's turn
			if (this._currentPos.x!=null && this._currentPos.y!=null) {
				this._unit.setMapX(this._currentPos.x);
				this._unit.setMapY(this._currentPos.y);
			}
			this._endMove(this._unit);
			root.getMetaSession().global.stop = true;
			this._unit.setWait(true);
		}
		else {
			this._currentPos.x = x;
			this._currentPos.y = y;
		}
		
		if (FogLight.isUnitVisibleFromPos(this._unit, x, y)) {
			var unitRenderParam = StructureBuilder.buildUnitRenderParam();
		
			if (this._isMoveFinal) {
				return;
			}
			
			unitRenderParam.direction = this._unit.getDirection();
			unitRenderParam.animationIndex = this._unitCounter.getAnimationIndexFromUnit(this._unit);
			unitRenderParam.isScroll = true;
			UnitRenderer.drawScrollUnit(this._unit, this._xPixel, this._yPixel, unitRenderParam);
		}
	}
	else {
		fw05.call(this);
	}   
}

//Hides unit menu of invisible units
var fw06 = MapEdit._openMenu;
MapEdit._openMenu = function(unit) {
	if (!FogLight.isActive() || unit==null || FogLight.isUnitVisible(unit)) {
		result = fw06.call(this, unit);
	}
	else {
		result = MapEditResult.NONE;
	}

	return result;
}

//Hides map window of invisible units
var fw07 = MapParts.UnitInfo.drawMapParts;
MapParts.UnitInfo.drawMapParts = function() {
	var unit = this.getMapPartsTarget();
	if (!FogLight.isActive() || FogLight.isUnitVisible(unit)) {
		fw07.call(this);
	}
}

//Hides range of invisible units
var fw08 = UnitRangePanel.drawRangePanel;
UnitRangePanel.drawRangePanel = function() {
	if (!FogLight.isActive() || FogLight.isUnitVisible(this._unit)) {
		fw08.call(this);
	}
}

//If you are in the unit menu of a visible unit, you can only change it to another unit if that unit is also visible
var fw09 = UnitMenuScreen._getUnitList;
UnitMenuScreen._getUnitList = function(unit) {
	var list;
	if (FogLight.isActive()) {
		if (unit.getUnitType() == UnitType.ENEMY) {
			var visibleEnemies = [];
			var allEnemies = EnemyList.getAliveDefaultList();
			for (var i=0; i<allEnemies.getCount(); i++) {
				if (FogLight.isUnitVisible(allEnemies.getData(i))) {
					visibleEnemies.push(allEnemies.getData(i));
				}
			}
			list = StructureBuilder.buildDataList();
			list.setDataArray(visibleEnemies);
		}
		else {
			var visibleUnits = [];
			var allUnits = unit.getUnitType()==UnitType.PLAYER ? PlayerList.getSortieDefaultList() : AllyList.getAliveDefaultList();
			for (var i=0; i<allUnits.getCount(); i++) {
				if (!allUnits.getData(i).isInvisible()) {
					visibleUnits.push(allUnits.getData(i));
				}
			}
			list = StructureBuilder.buildDataList();
			list.setDataArray(visibleUnits);
		}
		
	}
	else {
		list = fw09.call(this, unit);
	}

	return list;
}

//Once an enemy unit ends its move, if it is outside the visible range of your army, it will become invisible. Else, it will become visible
var fw10 = SimulateMove._endMove;
SimulateMove._endMove = function(unit) { 
	fw10.call(this, unit);
	if (FogLight.isActive()) {
		unit.setInvisible(!FogLight.isUnitVisible(unit));
	}
}

//Removes the unit.isInvisible check so invisible units can move
var fw11 = EnemyTurn._isOrderAllowed;
EnemyTurn._isOrderAllowed = function(unit) {
	if (!FogLight.isActive()) {
		return fw11.call(this, unit);
	}
	if (unit.isActionStop() || unit.isWait() || StateControl.isBadStateOption(unit, BadStateOption.NOACTION)) {
		return false;
	}
	
	return true;
}

//Updates the fog every time a non-enemy unit dies.
var fw12 = DamageControl.setDeathState;
DamageControl.setDeathState = function(unit) {
	fw12.call(this, unit);
	if (unit.getUnitType() != UnitType.ENEMY && FogLight.isActive()) {
		FogLight.setFog();
	}
}

//Modified so the attacking unit won't be visible after the easy battle
EasyBattle._enableDefaultCharChip = function(isDraw) {
	var enable;
	
	if (isDraw) {
		enable = true;
	}
	else {
		enable = false;
	}
	
	if (!FogLight.isActive() || FogLight.isUnitVisible(this._order.getActiveUnit())) {
		this._order.getActiveUnit().setInvisible(enable);
	}
	this._order.getPassiveUnit().setInvisible(enable);
	this._isUnitDraw = isDraw;
}

//Doesn't draw invisible units during the easy battle 
var fw13 = EasyMapUnit.drawMapUnit;
EasyMapUnit.drawMapUnit = function() {
	if (!FogLight.isActive() || FogLight.isUnitVisible(this._unit)) {
		fw13.call(this);
	}
}

//In the objective screen, only count the units that are visible
var fw14 = ObjectiveFaceZone._getTotalValue;
ObjectiveFaceZone._getTotalValue = function(unitType) {
	var value;
	if (!FogLight.isActive()) {
		value = fw14.call(this, unitType);
	}
	else {	
		value = 0;	
		if (unitType === UnitType.PLAYER) {
			list = PlayerList.getSortieDefaultList();
		}
		else if (unitType === UnitType.ENEMY) {
			list = EnemyList.getAliveDefaultList();
		}
		else {
			list = AllyList.getAliveDefaultList();
		}
		
		for (var i=0; i<list.getCount(); i++) {
			if (!list.getData(i).isInvisible()) {
				value++;
			}
		}
	}

	return value;
}
var fw15 = SortieSetting.assocUnit
SortieSetting.assocUnit = function(unit, sortiePos) {
	fw15.call(this,unit,sortiePos)
	if (FogLight.isActive()){
		FogLight.setFog()
	};
};

//With this, now you cannot cycle between invisible units
MapEdit._changeTarget = function(isNext) {
	var unit;
	var list = PlayerList.getSortieList();
	var count = list.getCount();
	var index = this._activeIndex;
	
	for (;;) {
		if (isNext) {
			index++;
		}
		else {
			index--;
		}
		
		if (index >= count) {
			index = 0;
		}
		else if (index < 0) {
			index = count - 1;
		}
		
		unit = list.getData(index);
		if (unit === null) {
			break;
		}
		
		if (!unit.isWait() && !unit.isInvisible())  { //Here I added !unit.isInvisible(). This is the only change in the function
			this._activeIndex = index;
			this._setUnit(unit);
			this._setFocus(unit);
			break;
		}
		
		if (index === this._activeIndex) {
			break;
		}
	}
}

//Without this, the auto end feature would not work if there were invisible units in the player's army
PlayerTurn._checkAutoTurnEnd = function() {
	var i, unit;
	var isTurnEnd = true;
	var list = PlayerList.getSortieList();
	var count = list.getCount();
	
	// Don't let the turn change occur at the same time when selecting the auto turn end on the config screen.
	// There is also an intention that doesn't let the turn end at the same time when the alive is 0 at the battle.
	if (this.getCycleMode() !== PlayerTurnMode.MAP) {
		return false;
	}
	
	// Even if the auto turn is not enabled, if no alive exists, end the turn.
	if (count === 0) {
		TurnControl.turnEnd();
		return true;
	}
	
	if (!EnvironmentControl.isAutoTurnEnd()) {
		return false;
	}
	
	for (i = 0; i < count; i++) {
		unit = list.getData(i);
		// If the all players cannot act due to the states, ending the turn is needed, so decide with the following code.
		if (!StateControl.isTargetControllable(unit)) {
			continue;
		}
		
		if (!unit.isWait() && !unit.isInvisible()) { //Here I added !unit.isInvisible(). This is the only change in the function
			isTurnEnd = false;
			break;
		}
	}
	
	if (isTurnEnd) {
		this._isPlayerActioned = false;
		TurnControl.turnEnd();
	}
	
	return isTurnEnd;
}

//If an ally unit (green unit) moves, the fog is updated
EnemyTurn._moveAutoAction = function() {
	// Check if action which is identified with this._autoActionIndex has ended.
	if (this._autoActionArray[this._autoActionIndex].moveAutoAction() !== MoveResult.CONTINUE) {
		if (!this._countAutoActionIndex()) {
			if (root.getCurrentSession().getTurnType() !== TurnType.ENEMY && FogLight.isActive()) {
				FogLight.setFog();
			}
			this._changeIdleMode(EnemyTurnMode.TOP, this._getIdleValue());
		}
	}
	
	return MoveResult.CONTINUE;
}

//With this, ally units won't attack hidden enemy units.
BaseCombinationCollector._setUnitRangeCombination = function(misc, filter, rangeMetrics) {
	var i, j, indexArray, list, targetUnit, targetCount, score, combination, aggregation;
	var unit = misc.unit;
	var filterNew = this._arrangeFilter(unit, filter);
	var listArray = this._getTargetListArray(filterNew, misc);
	var listCount = listArray.length;
	
	if (misc.item !== null && !misc.item.isWeapon()) {
		aggregation = misc.item.getTargetAggregation();
	}
	else if (misc.skill !== null) {
		aggregation = misc.skill.getTargetAggregation();
	}
	else {
		aggregation = null;
	}
	
	for (i = 0; i < listCount; i++) {
		list = listArray[i];
		targetCount = list.getCount();
		for (j = 0; j < targetCount; j++) {
			targetUnit = list.getData(j);
			if (unit === targetUnit) {
				continue;
			}
			if (targetUnit.isInvisible()){
				continue;
			}
			if (aggregation !== null && !aggregation.isCondition(targetUnit)) {
				continue;
			}
			
			score = this._checkTargetScore(unit, targetUnit);
			if (score < 0) {
				continue;
			}
			
			// Calculate a series of ranges based on the current position of targetUnit (not myself, but the opponent).
			indexArray = IndexArray.createRangeIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), rangeMetrics);
			
			misc.targetUnit = targetUnit;
			misc.indexArray = indexArray;
			misc.rangeMetrics = rangeMetrics;
			
			// Get an array to store the position to move from a series of ranges.
			misc.costArray = this._createCostArray(misc);
			
			if (misc.costArray.length !== 0) {
				// There is a movable position, so create a combination.
				combination = this._createAndPushCombination(misc);
				combination.plusScore = score;
			}
		}
	}
}

//Object that handles the fog
var FogLight = defineObject(BaseObject, {

	_fogIndexArray: null,
	_visibleArray: null,

	setFog: function() {  
		var fogTile;
		this._fogIndexArray = [];
		var session = root.getCurrentSession();
		var turnType = root.getCurrentSession().getTurnType();
		if(turnType == TurnType.PLAYER)
			this._setVisibleArrayPlayer();
		if(turnType == TurnType.PLAYER2)
			this._setVisibleArrayEnemy();

		this.resetUnit(turnType);

		var handleHouse = root.createResourceHandle(false, 0, 0, 0, 0)
		var handleBigHouse = root.createResourceHandle(false, 3, 0, 0, 0)
		var handlePlayer = root.createResourceHandle(false, 1, 0, 0, 0)
		var handleEnemy = root.createResourceHandle(false, 2, 0, 0, 0)
		var handleHalfPlayer = root.createResourceHandle(false, 4, 0, 0, 0)
		var handleFullPlayer = root.createResourceHandle(false, 5, 0, 0, 0)
		var handleHalfEnemy = root.createResourceHandle(false, 6, 0, 0, 0)
		var handleFullEnemy = root.createResourceHandle(false, 7, 0, 0, 0)
		var handleBarrack = root.createResourceHandle(false, 12, 0, 0, 0)
		var handleBlueBarrack = root.createResourceHandle(false, 13, 0, 0, 0)
		var handleRedBarrack = root.createResourceHandle(false, 14, 0, 0, 0)


		for (var i=0; i<CurrentMap.getWidth(); i++) {
			for (var j=0; j<CurrentMap.getHeight(); j++) {

					var event = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, i,j);
					if(event != null) {
						var index = IndexChecker(i, j);
						var status = root.getMetaSession().global.houseArray[index];
						var terrain = PosChecker.getTerrainFromPos(i, j);
						if(status == "PLAYER" && turnType == TurnType.PLAYER) {
							if(terrain.getName() == "Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handlePlayer);
								}
							if(terrain.getName() == "Big Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handleFullPlayer);
								}
							if(terrain.getName() == "Neutral Barrack") {
									session.setMapChipGraphicsHandle(i, j, true, handleBlueBarrack);
								}
							}

						if(status == "ENEMY" && turnType == TurnType.PLAYER2) {
							if(terrain.getName() == "Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handleEnemy);
								}
							if(terrain.getName() == "Big Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handleFullEnemy);
								}
							if(terrain.getName() == "Neutral Barrack") {
									session.setMapChipGraphicsHandle(i, j, true, handleRedBarrack);
								}
							}
						}
					}
				}


		for (var i=0; i<CurrentMap.getWidth(); i++) {
			for (var j=0; j<CurrentMap.getHeight(); j++) {
				this._checkTerrainVision(i,j)
			}
		}

		

		for (var i=0; i<CurrentMap.getWidth(); i++) {
			for (var j=0; j<CurrentMap.getHeight(); j++) {



				

				
				fogTile = this._visibleArray==null || (this._visibleArray!=null && !this._visibleArray[i][j])				
				if (fogTile) {
					this._fogIndexArray.push(CurrentMap.getIndex(i, j));


					var event = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, i,j);
					if(event != null) {
							var index = IndexChecker(i, j);
							var status = root.getMetaSession().global.houseArray[index];



							if(status == "PLAYER" && turnType == TurnType.PLAYER2 && !event.custom.reveal) {
								var terrain = PosChecker.getTerrainFromPos(i, j);
								if(terrain.getName() == "Blue House") {
									session.setMapChipGraphicsHandle(i, j, true, handleHouse);
								}
								if(terrain.getName() == "Big Blue House") {
									session.setMapChipGraphicsHandle(i, j, true, handleBigHouse);
								}
								if(terrain.getName() == "Blue Barrack") {
									session.setMapChipGraphicsHandle(i, j, true, handleBarrack);
								}
							}

							if(status == "ENEMY" && turnType == TurnType.PLAYER && !event.custom.reveal) {
								var terrain = PosChecker.getTerrainFromPos(i, j);
								if(terrain.getName() == "Red House") {
									session.setMapChipGraphicsHandle(i, j, true, handleHouse);
								}
								if(terrain.getName() == "Big Red House") {
									session.setMapChipGraphicsHandle(i, j, true, handleBigHouse);
								}
								if(terrain.getName() == "Red Barrack") {
									session.setMapChipGraphicsHandle(i, j, true, handleBarrack);
								}
							}
					}
				}	// end If
				else {

					var event = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, i,j);
					if(event != null) {
						var index = IndexChecker(i, j);
						var status = root.getMetaSession().global.houseArray[index];
						var terrain = PosChecker.getTerrainFromPos(i, j);

						if(status == "PLAYER" && turnType == TurnType.PLAYER2) {
							if(terrain.getName() == "Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handlePlayer);
									event.custom.reveal = true;
								}
							if(terrain.getName() == "Big Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handleFullPlayer);
									event.custom.reveal = true;
								}
							if(terrain.getName() == "Neutral Barrack") {
									session.setMapChipGraphicsHandle(i, j, true, handleBlueBarrack);
									event.custom.reveal = true;
								}
							if(terrain.getName() == "Blue House" || terrain.getName() == "Big Blue House" || terrain.getName() == "Blue Barrack") {
									event.custom.reveal = true;
								}
								
						}

						if(status == "ENEMY" && turnType == TurnType.PLAYER) {
							if(terrain.getName() == "Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handleEnemy);
									event.custom.reveal = true;
								}
							if(terrain.getName() == "Big Neutral House") {
									session.setMapChipGraphicsHandle(i, j, true, handleFullEnemy);
									event.custom.reveal = true;
								}

							if(terrain.getName() == "Neutral Barrack") {
									session.setMapChipGraphicsHandle(i, j, true, handleRedBarrack);
									event.custom.reveal = true;
								}
							if(terrain.getName() == "Red House" || terrain.getName() == "Big Red House" || terrain.getName() == "Red Barrack") {
									event.custom.reveal = true;
								}
						}



						}

				}// endElse




				unit = FogLight.getEnemyUnit(i, j);

				if (unit!=null)  {
					unit.setInvisible(fogTile);
					}	

			}
		}
		MapLayer.getMarkingPanel().updateMarkingPanel();	 
	},	

	allFog: function() {
		this._fogIndexArray = [];
		for (var i=0; i<CurrentMap.getWidth(); i++) {
			for (var j=0; j<CurrentMap.getHeight(); j++) {				
					this._fogIndexArray.push(CurrentMap.getIndex(i, j));
				}
			}
		MapLayer.getMarkingPanel().updateMarkingPanel();	 
	},

	drawLight: function() {
		root.drawFadeLight(this._fogIndexArray, this._getColor(), this._getAlpha());
	},

	isUnitVisible: function(unit) {
		if (unit==null || this._visibleArray==null) {
			return false;
		}
		var turnType = root.getCurrentSession().getTurnType();
		var isEnemy;

		if(turnType == TurnType.PLAYER)
			isEnemy = unit.getUnitType() === UnitType.PLAYER2;
		if(turnType == TurnType.PLAYER2)
			isEnemy = unit.getUnitType() === UnitType.PLAYER;

		var isVisible = this._visibleArray[unit.getMapX()][unit.getMapY()]!=null ? this._visibleArray[unit.getMapX()][unit.getMapY()] : false;

		var invisible = !(!isEnemy || (isEnemy && isVisible));

		return !invisible;
	},

	isUnitVisibleFromPos: function(unit, x, y) {
		if (unit==null) {
			return false;
		}

		var turnType = root.getCurrentSession().getTurnType();
		var isEnemy;

		if(turnType == TurnType.PLAYER)
			isEnemy = unit.getUnitType() === UnitType.PLAYER2;
		if(turnType == TurnType.PLAYER2)
			isEnemy = unit.getUnitType() === UnitType.PLAYER;

		var isVisible = this._visibleArray[x][y]!=null ? this._visibleArray[x][y] : false;

		var invisible = !(!isEnemy || (isEnemy && isVisible));

		return !invisible;
	},

	getEnemyUnit: function(x, y) {
		var enemyList;

		var turnType = root.getCurrentSession().getTurnType();
		if(turnType == TurnType.PLAYER)
			enemyList = FactionControl.getPlayer2List();
		if(turnType == TurnType.PLAYER2)
			enemyList = PlayerList.getSortieList();

		var unit;
		var unit2;
		var i = 0;
		var found = false;
		while (i<enemyList.getCount() && !found) {
			unit = enemyList.getData(i);
			found = unit.getMapX()==x && unit.getMapY()==y;
			i++;
		}

		return found ? unit : null;
	},

	resetUnit: function(turnType) {
			var list = PlayerList.getSortieList();
			for (var i=0; i<list.getCount(); i++) {
				unit =list.getData(i);
				unit.setInvisible(false);
			}
			var list = FactionControl.getPlayer2List();
			for (var i=0; i<list.getCount(); i++) {
				unit = list.getData(i);
				unit.setInvisible(false);
			}
		


	},

	isActive: function() {
		var hasFog = false;
		if (root.getCurrentSession() != null && root.getBaseScene() != SceneType.REST) {
			hasFog = root.getCurrentSession().getCurrentMapInfo().custom.fog != null;
		}
		return hasFog;
	},

	_setVisibleArrayPlayer: function() {
		this._visibleArray = [];
		for (var j=0; j<CurrentMap.getWidth(); j++) {
			this._visibleArray.push([]);
		}
		var turnType = root.getCurrentSession().getTurnType();
		var str;
		if(turnType == TurnType.PLAYER)
			str = "PLAYER"
		else
			str = "ENEMY"

		//f(turnType == TurnType.PLAYER)		{		
		this._markUnitVision(PlayerList.getSortieList());

			root.log("This turn is: " + str)
		//}
		//if(turnType == TurnType.PLAYER2)	{
		//this._markUnitVision(FactionControl.getPlayer2List()); 	

			root.log("This turn is: " + str)	 
		//}
		this._markUnitVision(AllyList.getAliveList()); 
	},

	_setVisibleArrayEnemy: function() {
		this._visibleArray = [];
		for (var j=0; j<CurrentMap.getWidth(); j++) {
			this._visibleArray.push([]);
		}
		var turnType = root.getCurrentSession().getTurnType();
		var str;
		if(turnType == TurnType.PLAYER)
			str = "PLAYER"
		else
			str = "ENEMY"

		//f(turnType == TurnType.PLAYER)		{		
			//this._markUnitVision(PlayerList.getSortieList());

			root.log("This turn is: " + str)
		//}
		//if(turnType == TurnType.PLAYER2)	{
			this._markUnitVision(FactionControl.getPlayer2List()); 	

			root.log("This turn is: " + str)	 
		//}
		this._markUnitVision(AllyList.getAliveList()); 
	},

	_markUnitVision: function(unitList)  {
		var unit, x, y, i, x2, y2;
		var vision;
		for (var h=0; h<unitList.getCount(); h++) {
			unit = unitList.getData(h);
			var unitType = unit.getUnitType();
			x = unit.getMapX()
			y = unit.getMapY()
			this._visibleArray[unit.getMapX()][unit.getMapY()] = true;
			vision = this._getVision(unit);
			var visionlist = IndexArray.getBestIndexArray(x,y,0,vision);


			for (i = 0; i < visionlist.length; i++){
				x2 = CurrentMap.getX(visionlist[i])
				y2 = CurrentMap.getY(visionlist[i])
				this._visibleArray[x2][y2] = true;

				if(!this._isBlockedTerrain(x2, y2, unitType)) {
					this._visibleArray[x2][y2] = false;

				}

			}
			// for (var i=-vision; i<=vision; i++) {
				// for (var j=0; Math.abs(i)+j<=vision; j++) {
					// if ((unit.getMapX()+i>=0) && (unit.getMapY()+j>=0) && (unit.getMapX()+i<CurrentMap.getWidth()) && (unit.getMapY()+j<CurrentMap.getHeight())) {
						// this._visibleArray[unit.getMapX()+i][unit.getMapY()+j] = true;
					// }
					// if ((unit.getMapX()+i>=0) && (unit.getMapY()-j>=0) && (unit.getMapX()+i<CurrentMap.getWidth()) && (unit.getMapY()-j<CurrentMap.getHeight())) {
						// this._visibleArray[unit.getMapX()+i][unit.getMapY()-j] = true;
					// }
				// }
			// }
		}
	},

	_isBlockedTerrain: function(x, y, unitType) {
		var terrain = PosChecker.getTerrainFromPos(x, y);
		var result = true;

		if(terrain != null && terrain.custom.blockVision){
			var tag = false;
			var unit0 = PosChecker.getUnitFromPos(x, y);
			var unit1 = PosChecker.getUnitFromPos(x-1, y);
			var unit2 = PosChecker.getUnitFromPos(x, y-1);
			var unit3 = PosChecker.getUnitFromPos(x+1, y);
			var unit4 = PosChecker.getUnitFromPos(x, y+1);

			if(unit0 != null) {
				if(unit0.getUnitType() == unitType)
					tag = true;
			}

			if(unit1 != null) {
				if(unit1.getUnitType() == unitType)
					tag = true;
			}
			if(unit2 != null) {
				if(unit2.getUnitType() == unitType)
					tag = true;
			}
			if(unit3 != null) {
				if(unit3.getUnitType() == unitType)
					tag = true;
			}
			if(unit4 != null) {
				if(unit4.getUnitType() == unitType)
					tag = true;
			}

			if(!tag) {
				result = false;
			}
		}

		return result;
	},
	
	_checkTerrainVision: function(x, y){
		var turnType = root.getCurrentSession().getTurnType();
		var vision, range, x2, y2, a, b;
		var terrain1 = root.getCurrentSession().getTerrainFromPos(x, y, true);
		var terrain2 = root.getCurrentSession().getTerrainFromPos(x, y, false);
		if (terrain1.custom.vision && typeof terrain1.custom.range === 'number'){
			range = terrain1.custom.range
			if(terrain1.custom.type == "PLAYER" && turnType == TurnType.PLAYER) {
					vision = IndexArray.getBestIndexArray(x,y,0,range)
					for (a = 0; a < vision.length; a++){
						x2 = CurrentMap.getX(vision[a])
						y2 = CurrentMap.getY(vision[a])
						this._visibleArray[x2][y2] = true;
				}
			}

			if(terrain1.custom.type == "PLAYER2" && turnType == TurnType.PLAYER2) {
					vision = IndexArray.getBestIndexArray(x,y,0,range)
					for (a = 0; a < vision.length; a++){
						x2 = CurrentMap.getX(vision[a])
						y2 = CurrentMap.getY(vision[a])
						this._visibleArray[x2][y2] = true;
				}
			}
		}
		else if (terrain2.custom.vision && typeof terrain2.custom.range === 'number'){
			range = terrain2.custom.range
			if(terrain2.custom.type = "PLAYER" && turnType == TurnType.PLAYER) {
					vision = IndexArray.getBestIndexArray(x,y,0,range)
					for (a = 0; a < vision.length; a++){
						x2 = CurrentMap.getX(vision[a])
						y2 = CurrentMap.getY(vision[a])
						this._visibleArray[x2][y2] = true;
				}
			}

			if(terrain2.custom.type = "PLAYER2" && turnType == TurnType.PLAYER2) {
					vision = IndexArray.getBestIndexArray(x,y,0,range)
					for (a = 0; a < vision.length; a++){
						x2 = CurrentMap.getX(vision[a])
						y2 = CurrentMap.getY(vision[a])
						this._visibleArray[x2][y2] = true;
				}
			}
		}
	},

	_getColor: function() {
		var fog = root.getCurrentSession().getCurrentMapInfo().custom.fog;
		var color = null;
		if (fog!=null) {
			color = fog.color;
		}

		return color;
	},

	_getAlpha: function() {
		var fog = root.getCurrentSession().getCurrentMapInfo().custom.fog;
		var alpha = null;
		if (fog!=null) {
			alpha = fog.alpha;
		}

		return alpha;
	},
	
	_getVision: function(unit) {
		var vision = unit.getClass().custom.baseVision!=null ? unit.getClass().custom.baseVision : 2;
		vision += unit.custom.extraVision!=null ? unit.custom.extraVision : 0;
		var skill = SkillControl.getPossessionCustomSkill(unit, "ExtraVision");
		if (skill!=null) {
			vision += skill.custom.extraVision;
		}
		var statesList = unit.getTurnStateList();
		var state;
		for (var i=0; i<statesList.getCount(); i++) {
			state = statesList.getData(i).getState();
			vision += state.custom.extraVision!=null ? state.custom.extraVision : 0;
		}

		var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
		if(terrain.custom.extraVision != null){
			var extraUnit = terrain.custom.unit;
			for(i = 0; i < extraUnit.length; i++){
				if(unit.getName() == extraUnit[i])
					vision += terrain.custom.extraVision;
			}		
		}

		return vision;
	}

});