TurnChangeEnd._removeWaitState = function(unit) {
		var reactionTurnCount = unit.getReactionTurnCount();
		
		if(unit.getUnitType() == UnitType.ENEMY){
			var session = root.getMetaSession();
			var gold = session.getGold();
			session.getVariableTable(0).setVariable(1, gold);
		}

		if(unit.getUnitType() == UnitType.PLAYER){
			var session = root.getMetaSession();
			var gold = session.getGold();
			session.getVariableTable(0).setVariable(0, gold);
		}



		if (reactionTurnCount > 0) {
			unit.setReactionTurnCount(reactionTurnCount - 1);
		}
		
		unit.setWait(false);
	}