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
		TextRenderer.drawText(x, y, terrain.getName(), length, color, font);
		
		//y += this.getIntervalY();
		//this._drawKeyword(x, y, root.queryCommand('avoid_capacity'), terrain.getAvoid());
		
		if (terrain.getDef() !== 0) {
			text = ParamGroup.getParameterName(ParamGroup.getParameterIndexFromType(ParamType.DEF));
			y += this.getIntervalY();
			this._drawKeyword(x, y, text, terrain.getDef());
		}
		
		if (terrain.getMdf() !== 0) {
			text = ParamGroup.getParameterName(ParamGroup.getParameterIndexFromType(ParamType.MDF));
			y += this.getIntervalY();
			this._drawKeyword(x, y, text, terrain.getMdf());
		}

		if (terrain.custom.extraRecovery == true) {
			text = ParamGroup.getParameterName(ParamGroup.getParameterIndexFromType(ParamType.MDF));
			y += this.getIntervalY();
			this._drawKeyword(x, y, 'Bonus Recovery');
		}
	}