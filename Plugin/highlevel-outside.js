/*--------------------------------------------------------------------------
  
  Without asking the value of "Enable to move to map edges" of the game option, invasion to the map edge is disabled.
  The empty space gets larger by disabling 2 tiles,
  so draw the turn numbers etc. at the area. It isn't shown with func.
  
  Author:
  SapphireSoft
  http://srpgstudio.com/
  
  History:
  2018/08/19 Released
  
--------------------------------------------------------------------------*/

(function() {

var outSidePartsArray = null;

function getDefaultMapBoundaryValue()
{
	return 1;
}

function setMapBoundaryValue(groupArray)
{
	groupArray.appendObject(OutSideParts.Turn);
	groupArray.appendObject(OutSideParts.Gold);
	groupArray.appendObject(OutSideParts.Bonus);
}

function setupOutSideParts()
{
	var i;
	var count = outSidePartsArray.length;
	
	for (i = 0; i < count; i++) {
		outSidePartsArray[i].setupOutSideParts();
	}
}

function configureOutSideParts(groupArray)
{
	groupArray.appendObject(OutSideParts.BlueGold);
	groupArray.appendObject(OutSideParts.BlueBonus);
	groupArray.appendObject(OutSideParts.RedGold);
	groupArray.appendObject(OutSideParts.RedBonus);
}

function isOutSidePartsVisible()
{
	return root.getBaseScene() === SceneType.FREE && SceneManager.getScreenCount() === 0;
}

var alias1 = CurrentMap._checkMapBoundaryValue;
CurrentMap._checkMapBoundaryValue = function(isEnabled) {
	outSidePartsArray = [];
	
	if (isEnabled) {
		root.getCurrentSession().setMapBoundaryValue(getDefaultMapBoundaryValue());
		configureOutSideParts(outSidePartsArray);
		setupOutSideParts();
	}
};

var alias2 = MapLayer.moveMapLayer;
MapLayer.moveMapLayer = function() {
	var i;
	var count = outSidePartsArray.length;
	
	alias2.call(this);
	
	if (!isOutSidePartsVisible()) {
		return;
	}
	
	for (i = 0; i < count; i++) {
		outSidePartsArray[i].moveOutSideParts();
	}
};

var alias3 = MapLayer.drawUnitLayer;
MapLayer.drawUnitLayer = function() {
	var i;
	var count = outSidePartsArray.length;
	
	alias3.call(this);
	
	if (!isOutSidePartsVisible()) {
		return;
	}
	
	for (i = 0; i < count; i++) {
		outSidePartsArray[i].drawOutSideParts();
	}
};

// The map unit window and terrain window are fixed at the bottom.

MapParts.UnitInfo._getPositionY = function() {
	var yBase = LayoutControl.getRelativeY(10) - 28;
	
	return root.getGameAreaHeight() - this._getWindowHeight() - yBase;
};

MapParts.UnitInfoSmall._getPositionY = function() {
	var yBase = LayoutControl.getRelativeY(10) - 28;
	
	return root.getGameAreaHeight() - this._getWindowHeight() - yBase;
};

MapParts.Terrain._getPositionY = function() {
	var yBase = LayoutControl.getRelativeY(10) - 28;
	
	return root.getGameAreaHeight() - this._getWindowHeight() - yBase;
};

var OutSideParts = {};

var BaseOutSideParts = defineObject(BaseObject,
{
	setupOutSideParts: function() {
	},
	
	moveOutSideParts: function() {
		return MoveResult.CONTINUE;
	},
	
	drawOutSideParts: function() {
		var text = this._getOutSidePartsName();
		var textui = this._getTitleTextUI();
		var color = ColorValue.KEYWORD;
		var font = textui.getFont();
		var pic = textui.getUIImage();
		var pos = this._getPos();
		var x = pos.x;
		var y = pos.y;
		
		TitleRenderer.drawTitle(pic, x, y-10, TitleRenderer.getTitlePartsWidth(), TitleRenderer.getTitlePartsHeight(), this._getCount() - 2);
		TextRenderer.drawText(x + 15, y + 12, text, -1, color, font);
		NumberRenderer.drawNumber(x + 124, y + 6, this._getOutSidePartsValue());
	},
	
	_getOutSidePartsName: function() {
		return '';
	},
	
	_getOutSidePartsValue: function() {
		return 0;
	},
	
	_getPos: function() {
		return createPos(0, 0);
	},
	
	_getTitleTextUI: function() {
		return root.queryTextUI('questreward_title');
	},
	
	_getWidth: function() {
		var width = TitleRenderer.getTitlePartsWidth() * this._getCount();
		
		return width + this._getSpace();
	},
	
	_getSpace: function() {
		return 70;
	},
	
	_getTotalWidth: function() {
		var width = TitleRenderer.getTitlePartsWidth() * this._getCount();
		
		return (width * outSidePartsArray.length) + (this._getSpace() * (outSidePartsArray.length - 1));
	},
	
	_getCount: function() {
		return 5;
	}
}
);

OutSideParts.Turn = defineObject(BaseOutSideParts,
{
	_getOutSidePartsName: function() {
		return StringTable.Signal_Turn;
	},
	
	_getOutSidePartsValue: function() {
		return root.getCurrentSession().getTurnCount();
	},
	
	_getPos: function() {
		var x = root.getGameAreaWidth() - this._getTotalWidth();
		
		x = Math.floor(x / 2);
		
		return createPos(x, 100);
	}
}
);

OutSideParts.BlueGold = defineObject(BaseOutSideParts,
{	
	frame: 0,
	_getOutSidePartsName: function() {
		return "Blue Gold";
	},
	
	_getOutSidePartsValue: function() {
		if(root.getCurrentSession().getTurnType() == TurnType.PLAYER2)
			return root.getMetaSession().getVariableTable(0).getVariable(0);
		if(root.getCurrentSession().getTurnType() == TurnType.PLAYER){
			var immGold = root.getMetaSession().getVariableTable(2).getVariable(0);
			if(root.getMetaSession().getGold() > immGold){
				this.frame = root.getMetaSession().getGold() - immGold;
				while(this.frame > 0){
					this.frame--;
					root.getMetaSession().getVariableTable(2).setVariable(0, immGold+9);
					immGold = root.getMetaSession().getVariableTable(2).getVariable(0);
					if(immGold > root.getMetaSession().getGold()){
						root.getMetaSession().getVariableTable(2).setVariable(0, root.getMetaSession().getGold());
						return root.getMetaSession().getGold();
					}
					else
						return immGold+9;
				}
			}

			if(root.getMetaSession().getGold() < immGold){
				this.frame = immGold - root.getMetaSession().getGold();
				while(this.frame > 0){
					this.frame--;
					root.getMetaSession().getVariableTable(2).setVariable(0, immGold-9);
					immGold = root.getMetaSession().getVariableTable(2).getVariable(0);
					if(immGold < root.getMetaSession().getGold()){
						root.getMetaSession().getVariableTable(2).setVariable(0, root.getMetaSession().getGold());
						return root.getMetaSession().getGold();
					}
					else
						return immGold-9;
				}
			}

			return root.getMetaSession().getGold();
		}
	},
	
	_getPos: function() {
		var x = root.getGameAreaWidth() - this._getTotalWidth();
		var y = root.getGameAreaHeight();
		var yBase = LayoutControl.getRelativeY(10)-12;

		x = Math.floor(x / 2) + (this._getWidth() * 1);
		
		return createPos(x, y - yBase);
	}
}
);

OutSideParts.BlueBonus = defineObject(BaseOutSideParts,
{	
	frame: 0,
	_getOutSidePartsName: function() {
		return "B. Income";
	},
	
	_getOutSidePartsValue: function() {
		if(root.getCurrentSession().getTurnType() == TurnType.PLAYER2)
			return root.getMetaSession().getVariableTable(1).getVariable(0);
		if(root.getCurrentSession().getTurnType() == TurnType.PLAYER){
			var immIncome =  root.getMetaSession().getVariableTable(2).getVariable(2);
			if(immIncome > root.getMetaSession().getVariableTable(1).getVariable(0)){
				this.frame = immIncome - root.getMetaSession().getVariableTable(1).getVariable(0);
				while(this.frame > 0){
					this.frame--;
					root.getMetaSession().getVariableTable(2).setVariable(2, immIncome-3);
					immIncome = root.getMetaSession().getVariableTable(2).getVariable(2);
					if(immIncome < root.getMetaSession().getVariableTable(1).getVariable(0)){
						root.getMetaSession().getVariableTable(2).setVariable(2, root.getMetaSession().getVariableTable(1).getVariable(0));
						return root.getMetaSession().getVariableTable(1).getVariable(0);
					}
					else
						return immIncome-3;
					}
		}
		if(immIncome < root.getMetaSession().getVariableTable(1).getVariable(0)){
				this.frame = root.getMetaSession().getVariableTable(1).getVariable(0) - immIncome;
				while(this.frame > 0){
					this.frame--;
					root.getMetaSession().getVariableTable(2).setVariable(2, immIncome+3);
					immIncome = root.getMetaSession().getVariableTable(2).getVariable(2);
					if(immIncome > root.getMetaSession().getVariableTable(1).getVariable(0)){
						root.getMetaSession().getVariableTable(2).setVariable(2, root.getMetaSession().getVariableTable(1).getVariable(0));
					return root.getMetaSession().getVariableTable(1).getVariable(0);
					}
					else
						return immIncome+3;
					}
				}
			return root.getMetaSession().getVariableTable(1).getVariable(0);
		}
	},
	
	_getPos: function() {
		var x = root.getGameAreaWidth() - this._getTotalWidth();
		var y = root.getGameAreaHeight();
		var yBase = LayoutControl.getRelativeY(10)-12;

		x = Math.floor(x / 2) + (this._getWidth() * 2);
		
		return createPos(x, y - yBase);
	}
}
);

OutSideParts.RedGold = defineObject(BaseOutSideParts,
{	
	frame: 0,
	_getOutSidePartsName: function() {
		return "Red Gold";
	},
	
	_getOutSidePartsValue: function() {
		if(root.getCurrentSession().getTurnType() == TurnType.PLAYER)
			return root.getMetaSession().getVariableTable(0).getVariable(1);
		if(root.getCurrentSession().getTurnType() == TurnType.PLAYER2){
			var immGold = root.getMetaSession().getVariableTable(2).getVariable(1);
			if(root.getMetaSession().getGold() > immGold){
				this.frame = root.getMetaSession().getGold() - immGold;
				while(this.frame > 0){
					this.frame--;
					root.getMetaSession().getVariableTable(2).setVariable(1, immGold+9);
					immGold = root.getMetaSession().getVariableTable(2).getVariable(1);
					if(immGold > root.getMetaSession().getGold()){
						root.getMetaSession().getVariableTable(2).setVariable(1, root.getMetaSession().getGold());
						return root.getMetaSession().getGold();
					}
					else
						return immGold+9;
				}
			}

			if(root.getMetaSession().getGold() < immGold){
				this.frame = immGold - root.getMetaSession().getGold();
				while(this.frame > 0){
					this.frame--;
					root.getMetaSession().getVariableTable(2).setVariable(1, immGold-9);
					immGold = root.getMetaSession().getVariableTable(2).getVariable(1);
					if(immGold < root.getMetaSession().getGold()){
						root.getMetaSession().getVariableTable(2).setVariable(1, root.getMetaSession().getGold());
						return root.getMetaSession().getGold();
					}
					else
						return immGold-9;
				}
			}

			return root.getMetaSession().getGold();
		}
	},
	
	_getPos: function() {
		var x = root.getGameAreaWidth() - this._getTotalWidth();
		
		x = Math.floor(x / 2) + (this._getWidth() * 1);
		
		return createPos(x, 0);
	}
}
);

OutSideParts.RedBonus = defineObject(BaseOutSideParts,
{
	_getOutSidePartsName: function() {
		return "R. Income";
	},
	
	_getOutSidePartsValue: function() {
			return root.getMetaSession().getVariableTable(1).getVariable(1);
	},
	
	_getPos: function() {
		var x = root.getGameAreaWidth() - this._getTotalWidth();
		
		x = Math.floor(x / 2) + (this._getWidth() * 2);
		
		return createPos(x, 0);
	}
}
);

})();

