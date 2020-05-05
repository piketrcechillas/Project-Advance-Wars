  var AssistCommandMode = {
        SELECT: 0,
        ASSIST: 1
    }

 AssistUnitCommand = defineObject(UnitListCommand, {
        _posSelector: null,
        _movName: null,

        openCommand: function() {
            this._prepareCommandMemberData();
            this._completeCommandMemberData();
        },

        moveCommand: function() {
            var mode = this.getCycleMode();
            var result = MoveResult.CONTINUE;

            if (mode === AssistCommandMode.SELECT) {
                result = this._moveSelect();
            }
            else if (mode === AssistCommandMode.ASSIST) {
                result = this._moveAssist();
            }

            return result;
        },

        drawCommand: function() {
            var mode = this.getCycleMode();

            if (mode === AssistCommandMode.SELECT) {
                this._drawSelect();
            }
        },

        isCommandDisplayable: function() {
        },

        getCommandName: function() {
        },

        isRepeatMoveAllowed: function() {
            return false;
        },

        _prepareCommandMemberData: function() {
            this._posSelector = createObject(PosSelector);
        },

        _completeCommandMemberData: function() {
            var unit = this.getCommandTarget();
            var filter = this._getUnitFilter();
            var indexArray = this._getMoveArray(this.getCommandTarget());

            this._posSelector.setUnitOnly(unit, ItemControl.getEquippedWeapon(unit), indexArray, PosMenuType.Default, filter);
            this._posSelector.setFirstPos();
            this._posSelector.includeFusion();

            this.changeCycleMode(AssistCommandMode.SELECT);
        },

        _moveSelect: function() {
            var result = this._posSelector.movePosSelector();

            if (result === PosSelectorResult.SELECT) {
                if (this._isPosSelectable()) {
                    this.changeCycleMode(AssistCommandMode.ASSIST);
                }
            }
            else if (result === PosSelectorResult.CANCEL) {
                this._posSelector.endPosSelector();
                return MoveResult.END;
            }

            return MoveResult.CONTINUE;
        },

        _moveAssist: function() {
            //Abstract function
        },

        _drawSelect: function() {
            this._posSelector.drawPosSelector();
        },

        _getMoveArray: function(unit) {
            var i, x, y, targetUnit;
            var indexArray = [];

            for (i = 0; i < DirectionType.COUNT; i++) {
                x = unit.getMapX() + XPoint[i];
                y = unit.getMapY() + YPoint[i];
                targetUnit = PosChecker.getUnitFromPos(x, y);
                if (targetUnit!==null && targetUnit.getUnitType()==UnitType.PLAYER && this._isMovable(unit, targetUnit)) {
                    indexArray.push(CurrentMap.getIndex(x, y));                
                }
            }
            return indexArray;
        },

        //Returns true if the movement skill commands can be used. Otherwise, returns false
        _isMovable: function(unit, targetUnit) {        
            //Abstract function
        },

        _isPosSelectable: function () {
            var unit = this._posSelector.getSelectorTarget(true);

            return unit !== null && Miscellaneous.isItemAccess(unit);
        },

        _getUnitFilter: function () {
            return FilterControl.getNormalFilter(this.getCommandTarget().getUnitType());
        }

    })


UnitCommand.Resupply = defineObject(AssistUnitCommand, {
        _movName: "Resupply",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            AW_Replenish(targetUnit);

            this.endCommandAction();
            return MoveResult.END;
        },

        isCommandDisplayable: function() {
			var result = false;
			var unit = this.getCommandTarget();
			if(unit.getClass().getName() == "APC" && SurroundChecker(unit)){
				result = true;
			}

			return result;
		},
	
		getCommandName: function() {
			return "Resupply";
		},

        _isMovable: function(unit, targetUnit) {
            return true;
        }
    })

SurroundChecker = function(unit) {
			var tag = false;
			var x = unit.getMapX();
			var y = unit.getMapY();
			var unitType = unit.getUnitType();
			var unit1 = PosChecker.getUnitFromPos(x-1, y);
			var unit2 = PosChecker.getUnitFromPos(x, y-1);
			var unit3 = PosChecker.getUnitFromPos(x+1, y);
			var unit4 = PosChecker.getUnitFromPos(x, y+1);

			if(unit1 != null) {
				if(unit1.getUnitType() == unitType)
					tag = true;
			}
			if(unit2 != null) {
				if(unit2.getUnitType() == unitType)
					tag = true;
			}
			if(unit3 != null) {
				if(unit3.getUnitType() == unitType)
					tag = true;
			}
			if(unit4 != null) {
				if(unit4.getUnitType() == unitType)
					tag = true;
			}
	return tag;
}