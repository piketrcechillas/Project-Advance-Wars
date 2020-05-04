RealBattle.eraseRoutine = function(alpha) {
		var active = this.getActiveBattler();
		var passive = this.getPassiveBattler();
		var activeUnit = active.getUnit();
		var passiveUnit = passive.getUnit();
		var eventActive = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, activeUnit.getMapX(), activeUnit.getMapY());
		var eventPassive = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, passiveUnit.getMapX(), passiveUnit.getMapY());

		if (DamageControl.isLosted(active.getUnit())) {
			if(eventActive != null){
				mhp = eventActive.custom.mhp;
				Eval.setHp(activeUnit.getMapX(), activeUnit.getMapY(), mhp)
			}
			active.setColorAlpha(alpha);

		}
		
		if (DamageControl.isLosted(passive.getUnit())) {
			if(eventPassive != null){
				mhp = eventPassive.custom.mhp;
				Eval.setHp(passiveUnit.getMapX(), passiveUnit.getMapY(), mhp)
			}
			passive.setColorAlpha(alpha);
		}
	}

EasyBattle.eraseRoutine = function(alpha) {
		var active = this.getActiveBattler();
		var passive = this.getPassiveBattler();
		var activeUnit = active.getUnit();
		var passiveUnit = passive.getUnit();
		var eventActive = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, activeUnit.getMapX(), activeUnit.getMapY());
		var eventPassive = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, passiveUnit.getMapX(), passiveUnit.getMapY());

		if (DamageControl.isLosted(active.getUnit())) {
			if(eventActive != null){
				mhp = eventActive.custom.mhp;
				Eval.setHp(activeUnit.getMapX(), activeUnit.getMapY(), mhp)
			}
			active.setColorAlpha(alpha);

		}
		
		if (DamageControl.isLosted(passive.getUnit())) {
			if(eventPassive != null){
				mhp = eventPassive.custom.mhp;
				Eval.setHp(passiveUnit.getMapX(), passiveUnit.getMapY(), mhp)
			}
			passive.setColorAlpha(alpha);
		}
	}


SimulateMove.oriX = 0;
SimulateMove.oriY = 0;


MapSequenceArea._startMove = function() {
		var cource;
		SimulateMove.oriX = this._targetUnit.getMapX();
		SimulateMove.oriY = this._targetUnit.getMapY();

		var x = this._mapCursor.getX();
		var y = this._mapCursor.getY();
		var isCurrentPos = this._targetUnit.getMapX() === x && this._targetUnit.getMapY() === y;
		
		this._parentTurnObject.setCursorSave(this._targetUnit);
		
		// If select the unit current position, no need to move.
		if (isCurrentPos) {
			this._simulateMove.noMove(this._targetUnit);
			this._playMapUnitSelectSound();
			return true;
		}
		else {
			// Create a course and start moving.
			cource = this._simulateMove.createCource(this._targetUnit, x, y, this._unitRangePanel.getSimulator());
			this._simulateMove.startMove(this._targetUnit, cource);
		}
		
		return false;
	}


SimulateMove._endMove = function(unit) {
		// Face the front because move ends.
		unit.setDirection(DirectionType.NULL);
		
		// Enable to draw the default because move ends.
		unit.setInvisible(false);
		this._isMoveFinal = true;
		
	}



var Eval = {
	setHp: function(x, y, hp) {
		eval('PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP,' + x + ',' + y + ').custom.hp' + '=' + hp);
	},

	setTempHp: function(x, y, thp) {
		eval('PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP,' + x + ',' + y + ').custom.thp' + '=' + thp);
	},

	setGlobal: function(id) {
		eval('root.getMetaSession().global.multiplayerID' + '=' + id);
	},

	setID: function(id) {
		eval('root.getMetaSession().global.playerID' + '=' + id);
	}


}

MapLayer.prepareMapLayer = function() {
		this._createArrayIndex();
		this._counter = createObject(UnitCounter);
		this._unitRangePanel = createObject(UnitRangePanel);

		this._mapChipLight = createObject(MapChipLight);
		this._mapChipLight.setLightType(MapLightType.NORMAL);
		
		this._markingPanel = createObject(MarkingPanel);
	}



MapLayer._arrayIndex = [];
MapLayer._houseHpArray = [];


MapLayer._createArrayIndex = function() {	
		if(this._arrayIndex.length == 0) {
			var width = CurrentMap.getWidth();
			var height = CurrentMap.getHeight();

			for (var i=0; i<width; i++) {
				
		  		for (var j=0; j<height; j++) {
		  			var event = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, i,j)
		    		if (event!=null) {
		    			var obj = {};
		    			//ex = LayoutControl.getPixelX(i);
						//ey = LayoutControl.getPixelY(j);
						obj.x=i;
						obj.y=j;
						this._arrayIndex.push(obj);

						var terrain = PosChecker.getTerrainFromPos(i, j);
						if(terrain.getName() == "Blue House" || terrain.getName() == "Big Blue House" || terrain.getName() == "Blue Barrack")
							{root.getMetaSession().global.houseArray.push("PLAYER");
								}
						else if(terrain.getName() == "Red House" || terrain.getName() == "Big Red House" || terrain.getName() == "Red Barrack")
							{root.getMetaSession().global.houseArray.push("ENEMY");
								}
						else
							{root.getMetaSession().global.houseArray.push("NEUTRAL");
								}

						
						var hp =  PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, i, j).custom.hp;
						this._houseHpArray.push(hp);
		    		}
		  		}
			}
		}
}
/*
MapLayer.saveHp = function() {
	for(i = 0; i < this._arrayIndex.length; i++) {
		pos = this._arrayIndex[i];
		ex = LayoutControl.getPixelX(pos.x);
		ey = LayoutControl.getPixelY(pos.y);
		hp =  PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, pos.x, pos.y).custom.hp;
		this._houseHpArray[i] = hp;
		root.log("SavedHPList: " + this._houseHpArray[i])
	}	
}

MapLayer.loadHp = function() {
	root.log("House Length: " + this._houseHpArray.length)
	for(i = 0; i < this._arrayIndex.length; i++) {
		pos = this._arrayIndex[i];
		Eval.setHp(pos.x, pos.y, this._houseHpArray[i])
		root.log("LoadedHPList: " + this._houseHpArray[i])

	}	
}*/



MapLayer.drawHouseHP = function() {
	for(i = 0; i < this._arrayIndex.length; i++) {
		pos = this._arrayIndex[i];
		ex = LayoutControl.getPixelX(pos.x);
		ey = LayoutControl.getPixelY(pos.y);
		hp = PosChecker.getPlaceEventFromPos(PlaceEventType.SHOP, pos.x, pos.y).custom.hp;
		
		NumberRenderer.drawNumber(ex, ey, hp);
	}

}

MapLayer.drawMapLayer = function() {
		var session;
		session = root.getCurrentSession();
		if (session !== null) {
			session.drawMapSet(0, 0);
			this.drawHouseHP();
			if (EnvironmentControl.isMapGrid() && root.isSystemSettings(SystemSettingsType.MAPGRID)) {
				session.drawMapGrid(0x0, 64);
			}
		}
		else {
			root.getGraphicsManager().fill(0x0);
		}
		
		this._drawColor(EffectRangeType.MAP);
	}


