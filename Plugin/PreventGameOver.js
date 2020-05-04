AutoScrollFlowEntry._completeMemberData = function(battleSetupScene) {
		var generator;
	
		if (!this._isContinue()) {
			return EnterResult.NOTENTER;
		}
		
		generator = this._dynamicEvent.acquireEventGenerator();
		generator.mapScroll(SpeedType.NORMAL, true, true);
		
		// If the game starts up from the beginning without the initial members and moreover,
		// the map displays the battle setup scene, if statement can be satisfied.
		
		return this._dynamicEvent.executeDynamicEvent();
	}