UnitListCommand.endCommandAction = function() {
		var unit = this.getCommandTarget();
		var EP = OT_GetNowEP(unit);
		OT_SetNowEP(unit, EP - unit.getMostResentMov());

		this._listCommandManager.endCommandAction(this);
	}

UnitRangePanel._getRangeMov = function(unit) {
		var mov;
		
		if (unit.isMovePanelVisible()) {
			mov = ParamBonus.getMov(unit);
			var EP = OT_GetNowEP(unit);
				if(EP < mov)
					mov = EP;
		}
		else {
			mov = 0;
		}
		
		return mov;
	}
	
AW_Replenish = function(unit) {
	OT_RecoveryNowEP(unit, ParamBonus.getEp(unit))
	var count = UnitItemControl.getPossessionItemCount(unit);
	for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			item.setLimit(item.getLimitMax());
		}
}

AW_BuidingEffect = function() {
	var unitList;
	var turnType = root.getCurrentSession().getTurnType();

	if(turnType == TurnType.PLAYER)
		unitList = PlayerList.getSortieList();
	if(turnType == TurnType.PLAYER2)
		unitList = EnemyList.getAliveList();

	for (var i=0; i<unitList.getCount(); i++) {
		unit = unitList.getData(i);
		var x = unit.getMapX();
		var y = unit.getMapY();
		var terrain = PosChecker.getTerrainFromPos(x, y);
		var classType = unit.getClass().getClassType();
		if(turnType == TurnType.PLAYER) {
			if(classType.getName() == "Flying" && terrain.getName() == "Big Blue House"){
				AW_Replenish(unit);
			}
			if(classType.getName() != "Flying" && (terrain.getName() == "Blue House" || terrain.getName() == "Blue Castle" || terrain.getName() == "Blue Barrack")) {
				AW_Replenish(unit);
			}
			if(APCAdjacency(unit))
				AW_Replenish(unit);
		}
		if(turnType == TurnType.PLAYER2) {
			if(classType.getName() == "Flying" && terrain.getName() == "Big Red House"){
				AW_Replenish(unit);
			}
			if(classType.getName() != "Flying" && (terrain.getName() == "Red House" || terrain.getName() == "Red Castle" || terrain.getName() == "Red Barrack")) {
				AW_Replenish(unit);
			}
			if(APCAdjacency(unit))
				AW_Replenish(unit);
		}
	}
}

APCAdjacency = function(unit) {
		var result = false;
		var x = unit.getMapX();
		var y = unit.getMapY();
		var unitType = unit.getUnitType();
		var unit1 = PosChecker.getUnitFromPos(x-1, y);
		var unit2 = PosChecker.getUnitFromPos(x, y-1);
		var unit3 = PosChecker.getUnitFromPos(x+1, y);
		var unit4 = PosChecker.getUnitFromPos(x, y+1);
		if(unit1 != null) {
			if(unit1.getUnitType() == unitType && unit1.getClass().getName() == "APC")
				result = true;
			}
		if(unit2 != null) {
			if(unit2.getUnitType() == unitType && unit2.getClass().getName() == "APC")
				result = true;
			}
		if(unit3 != null) {
			if(unit3.getUnitType() == unitType && unit3.getClass().getName() == "APC")
				result = true;
			}
		if(unit4 != null) {
			if(unit4.getUnitType() == unitType && unit4.getClass().getName() == "APC")
				result = true;
			}

		return result;
}



UnitCommand.Repair = defineObject(UnitListCommand,
{
	openCommand: function() {
		
	},
	
	moveCommand: function() {
		var unit = this.getCommandTarget()
		var count = UnitItemControl.getPossessionItemCount(unit);
		var coeff = 0;
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if(item.custom.unit != null && item.custom.unit == unit.getName()){
				coeff = item.getGold()/10;
			}
		}


		var missingHealth = ParamBonus.getMhp(unit) - unit.getHp();
		if(missingHealth > 2){
			missingHealth = 2;
		}
		var cost = missingHealth*coeff;

		var prev = unit.getHp();
		unit.setHp(prev + missingHealth);
		var prevG = root.getMetaSession().getGold();
		root.getMetaSession().setGold(prevG - cost);


		this.endCommandAction();
		MoveResult.END;
	},
	
	drawCommand: function() {
	},
	
	isCommandDisplayable: function() {
		var result = false;
		var unit = this.getCommandTarget();
		var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY())
		var unitType = unit.getUnitType();
		if(unitType == UnitType.PLAYER) {
			if(unit.getClass().getClassType().getName() == "Flying"){
				if(terrain.getName() == "Big Blue House")
					result = true;
			}
			else {
				if(terrain.getName() == "Blue House" || terrain.getName() == "Blue Castle")
					result = true;
			}
		}

		if(unitType == UnitType.ENEMY) {
			if(unit.getClass().getClassType().getName() == "Flying"){
				if(terrain.getName() == "Big Red House")
					result = true;
			}
			else {
				if(terrain.getName() == "Red House" || terrain.getName() == "Red Castle")
					result = true;
			}
		}

		if(unit.getHp() == ParamBonus.getMhp(unit)){
			result = false;
		}

		var count = UnitItemControl.getPossessionItemCount(unit);
		var coeff = 0;
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if(item.custom.unit != null && item.custom.unit == unit.getName()){
				coeff = item.getGold()/10;
			}
		}
		var cost = (ParamBonus.getMhp(unit) - unit.getHp())*coeff;
		if(cost > 2*coeff){
			cost = 2*coeff;
		}

		if(root.getMetaSession().getGold() < cost) {
			result = false;
		}

		return result;
	},
	
	getCommandName: function() {
		var unit = this.getCommandTarget()
		var count = UnitItemControl.getPossessionItemCount(unit);
		var coeff = 0;
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if(item.custom.unit != null && item.custom.unit == unit.getName()){
				coeff = item.getGold()/10;
			}
		}

		var cost = (ParamBonus.getMhp(unit) - unit.getHp())*coeff
		if(cost > 2*coeff){
			cost = 2*coeff;
		}

		var repair = "Rest - " + cost + "G"
		return repair;
	},
	
	isRepeatMoveAllowed: function() {
		// "Wait" mode doesn't allow to move again.
		return false;
	}
}
);