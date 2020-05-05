//Weapon Type Block, by piketrcechillas
//add {miss:[<weapon class type name>]} into Weapon Type custom parameter, the attack will not affect that class type
//Example: add {miss:["Flying"]}, and that weapon type cannot be used on Flying class type


AttackChecker.getAttackIndexArray = function(unit, weapon, isSingleCheck) {
		var i, index, x, y, targetUnit;
		var indexArrayNew = [];
		var indexArray = IndexArray.createIndexArray(unit.getMapX(), unit.getMapY(), weapon);
		var count = indexArray.length;

		for (i = 0; i < count; i++) {
			index = indexArray[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			targetUnit = PosChecker.getUnitFromPos(x, y);
			if (targetUnit !== null && unit !== targetUnit) {
				if (FilterControl.isReverseUnitTypeAllowed(unit, targetUnit) && AttackChecker.checkCompatibility(unit, targetUnit)) {
					indexArrayNew.push(index);
					if (isSingleCheck) {
						return indexArrayNew;
					}
				}
			}
		}
		
		return indexArrayNew;
	}


AttackChecker.checkCompatibility = function(unit, targetUnit) {
	var weaponType = ItemControl.getEquippedWeapon(unit).getWeaponType();
	var result = true;
	if(weaponType.custom.miss != null) {
		var missArray = weaponType.custom.miss;
		var targetClassType = targetUnit.getClass().getClassType().getName();
		
		for(i = 0; i < missArray.length; i++) {
			root.log("Miss Array Length = " + missArray.length)
			root.log("targetClassType = " + targetClassType)
			if(missArray[i] == targetClassType)
				{
					result = false;
					break;
				}
		}
	}

	return result;
}

AttackChecker.isCounterattack = function(unit, targetUnit) {
		var weapon, indexArray;
		
		if (!Calculator.isCounterattackAllowed(unit, targetUnit)) {
			return false;
		}
		
		weapon = ItemControl.getEquippedWeapon(unit);
		if (weapon !== null && weapon.isOneSide()) {
			// If the attacker is equipped with "One Way" weapon, no counterattack occurs.
			return false;
		}
		
		// Get the equipped weapon of those who is attacked.
		weapon = ItemControl.getEquippedWeapon(targetUnit);
		
		// If no weapon is equipped, cannot counterattack.
		if (weapon === null) {
			return false;
		}
		
		// If "One Way" weapon is equipped, cannot counterattack.
		if (weapon.isOneSide()) {
			return false;
		}

		if(!AttackChecker.checkCompatibility(targetUnit, unit))
			return false;
		
		indexArray = IndexArray.createIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon);
		
		return IndexArray.findUnit(indexArray, unit);
	}