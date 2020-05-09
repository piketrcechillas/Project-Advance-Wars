FuelChecker = function() {
	var list = TurnControl.getActorList();
	var count = list.getCount();
	var generator = root.getEventGenerator();
	var isSkipMode = CurrentMap.isTurnSkipMode();

	for (var i = 0 ; i < count; i++) {
		unit = list.getData(i);

		if(OT_GetNowEP(unit) == 0 && unit.getClass().getClassType().getName() == "Flying") {
			generator.locationFocus(unit.getMapX(), unit.getMapY(), true); 
			generator.damageHit(unit,  root.queryAnime('easydamage'), ParamBonus.getMhp(unit), DamageType.FIXED, {}, isSkipMode);
			generator.execute();
		}
	}
}