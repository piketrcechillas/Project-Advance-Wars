RecoveryAllFlowEntry._getRecoveryValue = function(unit) {
		var skill, terrain;
		var recoveryValue = 0;
		
		skill = SkillControl.getBestPossessionSkill(unit, SkillType.AUTORECOVERY);
		if (skill !== null) {
			recoveryValue += skill.getSkillValue();
		}
		
		terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
		if (terrain !== null) {
			recoveryValue += terrain.getAutoRecoveryValue();
			if(terrain.custom.extraRecovery == true && SkillControl.getPossessionCustomSkill(unit, "HealTerrain")) {
					terrainValue = terrain.custom.value;
					recoveryValue += ParamBonus.getMhp(unit)*terrainValue/100;
			}
		}
		
		recoveryValue += StateControl.getHpValue(unit);

		return recoveryValue;
}

MapParts.Terrain._drawContent = function(x, y, terrain) {
		var text;
		var textui = this._getWindowTextUI();
		var font = textui.getFont();
		var color = textui.getColor();
		var length = this._getTextLength();
		
		if (terrain === null) {
			return;
		}
		
		x += 2;

		var terrainName = terrain.getName();

		if(terrain.getName() == "Neutral House" || terrain.getName() == "Blue House" || terrain.getName() == "Red House")
			terrainName = "Village";
		if(terrain.getName() == "Big Neutral House" || terrain.getName() == "Big Blue House" || terrain.getName() == "Big Red House")
			terrainName = "Aviary"
		if(terrain.getName() == "Neutral Barrack" || terrain.getName() == "Blue Barrack" || terrain.getName() == "Red Barrack")
			terrainName = "Barrack";
		if(terrain.getName() == "Red Castle" || terrain.getName() == "Blue Castle")
			terrainName = "Headquarter";



		TextRenderer.drawText(x, y, terrainName, length, color, font);
		
		//y += this.getIntervalY();
		//this._drawKeyword(x, y, root.queryCommand('avoid_capacity'), terrain.getAvoid());
		
		if (terrain.getDef() !== 0) {
			text = ParamGroup.getParameterName(ParamGroup.getParameterIndexFromType(ParamType.DEF));
			y += this.getIntervalY();
			this._drawKeyword(x, y, 'Star', terrain.getDef());
			//root.getGraphicsManager().drawText(x, y, text, length, color, 255, font);
		}
		
		if (terrain.getMdf() !== 0) {
			//text = ParamGroup.getParameterName(ParamGroup.getParameterIndexFromType(ParamType.MDF));
			//y += this.getIntervalY();
			//this._drawKeyword(x, y, text, terrain.getMdf());
		}

		if (terrain.custom.extraVision == true) {
			text = ParamGroup.getParameterName(ParamGroup.getParameterIndexFromType(ParamType.MDF));
			y += this.getIntervalY();
			//this._drawKeyword(x, y, 'Inf. /H. Inf. Unit');
			root.getGraphicsManager().drawText(x, y+3, 'Inf. /H. Inf. Unit', length, color, 255, font);
			y += this.getIntervalY();
			this._drawKeyword(x, y, 'Vision', 1);
		}

		

	}