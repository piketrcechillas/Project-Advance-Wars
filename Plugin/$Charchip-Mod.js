//DON'T USE THE RTP WITH THIS MOD. AT ALL.
(function() {

UnitCounter.moveUnitCounter = function() {
	var result = this._counter.moveCycleCounter();
	
	if (result !== MoveResult.CONTINUE) {
		if (++this._unitAnimationIndex === 10) {
			this._unitAnimationIndex = 0;
		}
	}
	
	result = this._counter2.moveCycleCounter();
	if (result !== MoveResult.CONTINUE) {
		if (++this._unitAnimationIndex2 === 2) {
			this._unitAnimationIndex2 = 0;
		}
	}

	return result;
};

UnitCounter.getAnimationIndex = function() {
	var a = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
	
	return a[this._unitAnimationIndex];
};

UnitRenderer.drawCharChip = function(x, y, unitRenderParam) {
	var dx, dy, dxSrc, dySrc;
	var directionArray = [4, 1, 2, 3, 0];
	var handle = unitRenderParam.handle;
	var width = GraphicsFormat.CHARCHIP_WIDTH;
	var height = GraphicsFormat.CHARCHIP_HEIGHT;
	var xSrc = handle.getSrcX() * (width * 6);
	var ySrc = handle.getSrcY() * (height * 5);
	var pic = this._getGraphics(handle, unitRenderParam.colorIndex);
	
	if (pic === null) {
		return;
	}
	
	dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
	dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
	dxSrc = unitRenderParam.animationIndex;
	dySrc = directionArray[unitRenderParam.direction];
	
	pic.setAlpha(unitRenderParam.alpha);
	pic.setDegree(unitRenderParam.degree);
	pic.setReverse(unitRenderParam.isReverse);
	pic.drawStretchParts(x - dx, y - dy, width, height, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, height);
};

MapLayer.drawUnitLayer = function() {
	var index = this._counter.getAnimationIndex();
	var index2 = this._counter.getAnimationIndex2();
	var session = root.getCurrentSession();
	var HPGauges = EnvironmentControl.getMapUnitHpType()
	this._markingPanel.drawMarkingPanel();
	
	this._unitRangePanel.drawRangePanel();
	this._mapChipLight.drawLight();
	var URP = StructureBuilder.buildUnitRenderParam();
	URP.animationIndex = index;
	if (session !== null) {
		// session.drawUnitSet(true, true, true, index, index2);
		var ListP = PlayerList.getSortieList();
		var ListA = AllyList.getAliveList();
		var ListE = EnemyList.getAliveList();
		var p, a, e, unit;
		for (p = 0; p < ListP.getCount(); p++){
			unit = ListP.getData(p);
			URP.colorIndex = 0;
			URP.handle = unit.getCharChipResourceHandle();
			x = LayoutControl.getPixelX(unit.getMapX());
			y = LayoutControl.getPixelY(unit.getMapY());
			if (unit.custom.RSDD != true){
				UnitRenderer.drawDefaultUnit(unit, x, y, URP);
				if (HPGauges != 2){
					MapHpDecorator.setupDecoration(unit);
				}
			}
		}
		for (a = 0; a < ListA.getCount(); a++){
			unit = ListA.getData(a);
			URP.colorIndex = 2;
			URP.handle = unit.getCharChipResourceHandle();
			x = LayoutControl.getPixelX(unit.getMapX());
			y = LayoutControl.getPixelY(unit.getMapY());
			if (unit.custom.RSDD != true){
				UnitRenderer.drawDefaultUnit(unit, x, y, URP);
				if (HPGauges != 2){
					MapHpDecorator.setupDecoration(unit);
				}
			}
		}
		for (e = 0; e < ListE.getCount(); e++){
			unit = ListE.getData(e);
			URP.colorIndex = 1;
			URP.handle = unit.getCharChipResourceHandle();
			x = LayoutControl.getPixelX(unit.getMapX());
			y = LayoutControl.getPixelY(unit.getMapY());
			if (unit.custom.RSDD != true){
				UnitRenderer.drawDefaultUnit(unit, x, y, URP);
				if (HPGauges != 2){
					MapHpDecorator.setupDecoration(unit);
				}
			}
		}
	}
	
	this._drawColor(EffectRangeType.MAPANDCHAR);
	
	if (this._effectRangeType === EffectRangeType.MAPANDCHAR) {
		this._drawScreenColor();
	}
};

var RSDD1 = SimulateMove.startMove;
SimulateMove.startMove = function(unit, moveCource) {
	unit.custom.RSDD = true;
	RSDD1.call(this, unit, moveCource)
};

var RSDD2 = SimulateMove._endMove;
SimulateMove._endMove = function(unit) {
	unit.custom.RSDD = false;
	RSDD2.call(this, unit);
};

MapHpDecorator._getNumberColorIndex = function(type) {
	var a = [3, 2, 1, 0]
	return a[type];
};

MapHpDecorator._getPos = function(unit) {
	var x = LayoutControl.getPixelX(unit.getMapX());
	var y = LayoutControl.getPixelY(unit.getMapY());
	if (GraphicsFormat.MAPCHIP_WIDTH !== 32 || GraphicsFormat.MAPCHIP_HEIGHT !== 32) {
		x += 8;
		y += 8;
	}
	
	return {
		x: x,
		y: y
	};
};

MapHpDecorator._setupDecorationFromType = function(type, unit) {
	// var obj = root.getHpDecoration(type);
	if (unit == null){
		return;
	}
	var Canvas = root.getGraphicsManager().getCanvas();
	var Gradient = Canvas.createGradient();
	var pos = this._getPos(unit);
	var width = 32;
	var height = 10;
	var color = this._getColor(type);
	var alpha = this._getAlpha(type);
	var strokeColor = 0xff;
	var strokeAlpha = 255;
	var hpType = EnvironmentControl.getMapUnitHpType();
	
	// obj.beginDecoration();
	
	if (hpType === 0) {
		NumberRenderer.drawNumber(pos.x+10, pos.y+12, unit.getHp())
		// // The color and outline are set before calling addRectangle.
		// obj.setFillColor(color, alpha);
		// obj.setStrokeInfo(strokeColor, strokeAlpha, 1, true);
		// obj.addRectangle(pos.x, pos.y, width, height);
		
		// obj.addHp(pos.x, pos.y, 0);
	}
	else if (hpType === 1) {
		// obj.addGauge(pos.x, pos.y, 1);
		Canvas.setStrokeInfo(strokeColor, strokeAlpha, 1, true)
		Canvas.drawRectangle(pos.x, pos.y+24, width, height)
		if (type == HpDecorationType.FULL){
			Canvas.setFillColor(color, alpha)
		}
		else if (type == HpDecorationType.NONFULL){
			Canvas.drawRectangle(pos.x, pos.y+24, Math.floor(width*0.75), height)
			Canvas.setFillColor(color, alpha)
		}
		else if (type == HpDecorationType.HALF){
			Canvas.drawRectangle(pos.x, pos.y+24, Math.floor(width*0.5), height)
			Canvas.setFillColor(color, alpha)
		}
		else{
			Canvas.drawRectangle(pos.x, pos.y+24, Math.floor(width*0.25), height)
			Canvas.setFillColor(color, alpha)
		}
		// Gradient.beginGradient(0)
		// Gradient.addColor(color, alpha)
		// Canvas.setGradient(Gradient)
		// Gradient.endGradient()
		
	}
	
	// obj.endDecoration();
	
};

MapHpDecorator.setupDecoration = function(unit) {
	if (unit == null){
		return;
	}
	if (unit.getHp() == ParamBonus.getMhp(unit)){		
		this._setupDecorationFromType(HpDecorationType.FULL, unit);
	}
	else if (unit.getHp() >= Math.floor(ParamBonus.getMhp(unit)*0.75)){
		this._setupDecorationFromType(HpDecorationType.NONFULL, unit);
	}
	else if (unit.getHp() >= Math.floor(ParamBonus.getMhp(unit)*0.5)){
		this._setupDecorationFromType(HpDecorationType.HALF, unit);
	}
	else{
		this._setupDecorationFromType(HpDecorationType.QUARTER, unit);
	}
};

}) ();