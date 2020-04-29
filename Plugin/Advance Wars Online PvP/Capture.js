var HouseType = {
	PLAYER: 0,
	ENEMY: 1,
	NEUTRAL: 2,
	HALF_PLAYER: 3,
	HALF_ENEMY: 4,
	BIG_NEUTRAL: 5,
	FULL_PLAYER: 6,
	FULL_ENEMY: 7,
	BLUE_CASTLE: 8,
	RED_CASTLE: 9
}

UnitCommand.configureCommands = function(groupArray) {
		this._appendTalkEvent(groupArray);
		groupArray.appendObject(UnitCommand.Capture);
		groupArray.appendObject(UnitCommand.Attack);
		//groupArray.appendObject(UnitCommand.PlaceCommand);
		//groupArray.appendObject(UnitCommand.Occupation);
		//groupArray.appendObject(UnitCommand.Treasure);
		//groupArray.appendObject(UnitCommand.Village);
		//groupArray.appendObject(UnitCommand.Shop);
		//groupArray.appendObject(UnitCommand.Gate);
		//this._appendUnitEvent(groupArray);
		//groupArray.appendObject(UnitCommand.Quick);
		//groupArray.appendObject(UnitCommand.Steal);
		//groupArray.appendObject(UnitCommand.Wand);
		//groupArray.appendObject(UnitCommand.Information);
		//this._appendMetamorphozeCommand(groupArray);
		//this._appendFusionCommand(groupArray);
		//groupArray.appendObject(UnitCommand.Item);
		//groupArray.appendObject(UnitCommand.Trade);
		//groupArray.appendObject(UnitCommand.Stock);
		//groupArray.appendObject(UnitCommand.MetamorphozeCancel);
		groupArray.appendObject(UnitCommand.Wait);
	}


UnitCommand.Capture = defineObject(UnitListCommand,
{
	_capsuleEvent: null,
	
	openCommand: function() {
		

	},
	
	moveCommand: function() {
		var session = root.getCurrentSession();
		var unit = this.getCommandTarget();
		var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		var small = mapInfo.custom.small;
		var big = mapInfo.custom.big;

		var handlePlayer = root.createResourceHandle(false, 1, 0, 0, 0)
		var handleEnemy = root.createResourceHandle(false, 2, 0, 0, 0)
		var handleHalfPlayer = root.createResourceHandle(false, 4, 0, 0, 0)
		var handleFullPlayer = root.createResourceHandle(false, 5, 0, 0, 0)
		var handleHalfEnemy = root.createResourceHandle(false, 6, 0, 0, 0)
		var handleFullEnemy = root.createResourceHandle(false, 7, 0, 0, 0)

		var table = root.getMetaSession().getVariableTable(1);
		var playerIncome = table.getVariable(0);
		var enemyIncome = table.getVariable(1);

		var hp = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, unit.getMapX(), unit.getMapY()).custom.hp;
		var mhp = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, unit.getMapX(), unit.getMapY()).custom.mhp;
		root.log("posHP: " + hp)

		if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.NEUTRAL){
			hp = hp - unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handlePlayer);
				table.setVariable(0, playerIncome+small)
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}

		if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.ENEMY){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handlePlayer);
				table.setVariable(0, playerIncome+small);
				table.setVariable(1, enemyIncome-small);
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}

		if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.NEUTRAL){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handleEnemy);
				table.setVariable(1, enemyIncome+small);
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}


		if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.PLAYER){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handleEnemy);
				table.setVariable(1, enemyIncome+small);
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}

		if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.BIG_NEUTRAL){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handleFullPlayer);
				table.setVariable(0, playerIncome+big)
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}

		if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.BIG_NEUTRAL){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handleFullEnemy);
				table.setVariable(1, enemyIncome+big)
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}

		if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.FULL_ENEMY){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handleFullPlayer);
				table.setVariable(0, playerIncome+big)
				table.setVariable(1, enemyIncome-big);
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}

		if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.RED_CASTLE){
			hp -= unit.getHp();
			if(hp<=0){
				root.getMetaSession().getVariableTable(3).setVariable(0, 1)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}


		if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.FULL_PLAYER){
			hp -= unit.getHp();
			if(hp<=0){
				session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, handleFullEnemy);
				table.setVariable(0, playerIncome-big)
				table.setVariable(1, enemyIncome+big);
				Eval.setHp(unit.getMapX(), unit.getMapY(), mhp)
			
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}

		}


		if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.BLUE_CASTLE){
			hp -= unit.getHp();
			if(hp<=0){
				root.log("Captured")
				root.getMetaSession().getVariableTable(3).setVariable(1, 1)
			}
			else{
				Eval.setHp(unit.getMapX(), unit.getMapY(), hp)
			}
		}



		this.endCommandAction();

		return MoveResult.END;
	},
	
	isCommandDisplayable: function() {
		var unit = this.getCommandTarget();
		var capturable = false;


		var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());

		root.log("Current Terrain: " + CaptureControl.getHouseType(terrain))

		if(terrain.getTerrainGroup() != null && terrain.getTerrainGroup().getName() == "Capture"){
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.NEUTRAL){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.BIG_NEUTRAL){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.ENEMY){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.NEUTRAL){
				capturable = true;
				root.log("Got'em, Enemy");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.BIG_NEUTRAL){
				capturable = true;
				root.log("Got'em, Enemy");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.PLAYER){
				capturable = true;
				root.log("Got'em, Enemy");
			}
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.HALF_PLAYER){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.HALF_ENEMY){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.FULL_ENEMY){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.HALF_PLAYER){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.FULL_PLAYER){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.HALF_ENEMY){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.ENEMY && CaptureControl.getHouseType(terrain) == HouseType.BLUE_CASTLE){
				capturable = true;
				root.log("Got'em, Player");
			}
			if(unit.getUnitType() == UnitType.PLAYER && CaptureControl.getHouseType(terrain) == HouseType.RED_CASTLE){
				capturable = true;
				root.log("Got'em, Player");
			}

		}

		if(unit.getName() != "Infantry" && unit.getName() != "Heavy Infantry")
			capturable = false;
		
		return capturable;
	},
	
	getCommandName: function() {
		return "Capture";
	},
	
	isRepeatMoveAllowed: function() {
		return false;
	},
	
	_prepareCommandMemberData: function() {
	},
	
	_completeCommandMemberData: function() {
	}
	}
);



var CaptureControl = {
	getHouseType: function(terrain) {
		var HouseType = 0;
		if(terrain.getName() == "Neutral House")
			return 2;
		else if(terrain.getName() == "Blue House")
			return 0;
		else if(terrain.getName() == "Red House")
			return 1;
		else if(terrain.getName() == "Half Blue House")
			return 3;
		else if(terrain.getName() == "Half Red House")
			return 4;
		else if(terrain.getName() == "Big Neutral House")
			return 5;
		else if(terrain.getName() == "Big Blue House")
			return 6;
		else if(terrain.getName() == "Big Red House")
			return 7;
		else if(terrain.getName() == "Blue Castle")
			return 8;
		else if(terrain.getName() == "Red Castle")
			return 9;
	}

}

