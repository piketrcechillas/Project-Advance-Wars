TurnChangeEnd.doLastAction = function() {
	var turnType = root.getCurrentSession().getTurnType();

	if(turnType == TurnType.PLAYER2)
	{
			var session = root.getMetaSession();
			var gold = session.getGold();
			session.getVariableTable(0).setVariable(1, gold);

			var session = root.getMetaSession();
			var income = session.getVariableTable(1).getVariable(0);
			var pastGold = session.getVariableTable(0).getVariable(0);

			root.log("Income: " + income);

			session.setGold(pastGold + income);
			
			nextTurnType = TurnType.PLAYER;
		}

	if(turnType == TurnType.PLAYER)
	{
			var session = root.getMetaSession();
			var gold = session.getGold();
			session.getVariableTable(0).setVariable(0, gold);

			var session = root.getMetaSession();
			var income = session.getVariableTable(1).getVariable(1);
			var pastGold = session.getVariableTable(0).getVariable(1);

			root.log("Income: " + income);

			session.setGold(pastGold + income);
		}


	this._startNextTurn();

	}
