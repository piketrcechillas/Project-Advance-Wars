/**
 * Script by Goinza and Lady Rena.
 * Art assets edited by Leafy.
 * 
 * This script adds a new neutral faction that is hostile to all other factions.
 * The neutral faction moves during the same turn as the enemy faction.
 * 
 * To create a unit for the new faction, create a new enemy unit and add the custom parameter {neutralFaction:true}
 * 
 * You can also use the global parameters "neutralFrame" and "neutralWindow".
 * The neutralFrame parameter changes the picture that shows when the turn of the neutral faction starts. If the parameter is not specified, the default Enemy Phase graphic will be used.
 * The neutralWindow parameter changes the graphic used for the windows during the map battle windows and during the combat forecast windows. By default, the neutral faction uses the enemy colors.
 * 
 * There is also a custom parameters for each map to determine the music file of the neutral phase. If one is not selected, the enemy phase music will be used.
 * To use this, make the custom parameter "neutralMusic" in the map like this: {neutralMusic:0}, being in this example 0 the ID of the song file.
 * 
 * This parameter use as values the id of the graphic. For example: {neutralFrame:0, neutralWindow:0} would use the pics with ID 0,
 * being that neutralFrame uses the "screenframe" sub-category of the UI category, and neutralWindow uses the "menuwindow" sub-category of the UI category.
 * 
 * IMPORTANT: all the parameters that need graphics or sound files will only look for imported assets. 
 * If you want to use a song or graphic that is already in the editor, export it and import it.
 */

UnitFilterFlag.NEUTRAL = 0x08;
UnitType.NEUTRAL = 3;
TurnType.NEUTRAL = 3;

//With this, units with the neutralFaction parameter will attack any unit
var ext01 = BaseCombinationCollector._arrangeFilter;
BaseCombinationCollector._arrangeFilter = function(unit, filter) {
    var filter = ext01.call(this, unit, filter);
    return FactionControl.getUnitFilter(unit, filter);
}

//Adds the neutral list to the array if the unit is not neutral.
//Adds all lists but the neutral list to the array if the unit is neutral.
FilterControl.getListArray = function(filter) {
    var listArray = [];
    
    if (filter & UnitFilterFlag.PLAYER) {
        listArray.push(PlayerList.getSortieList());
        listArray.push(FactionControl.getNeutralList());
    }
    
    if (filter & UnitFilterFlag.ENEMY) {
        listArray.push(EnemyList.getAliveList());
    }
    
    if (filter & UnitFilterFlag.ALLY) {
        listArray.push(AllyList.getAliveList());
        listArray.push(FactionControl.getNeutralList());
    }

    if (filter & UnitFilterFlag.NEUTRAL) {
        listArray.push(PlayerList.getSortieList());
        listArray.push(AllyList.getAliveList());
        listArray.push(FactionControl.getEnemyList());
    }
    
    return listArray;	
}

//Returns the list associated with the TurnType
TurnControl.getActorList = function() {
    var list = null;
    var turnType = root.getCurrentSession().getTurnType();
    
    if (turnType === TurnType.PLAYER) {
        list = PlayerList.getSortieList();
    }
    else if (turnType === TurnType.ENEMY) {
        list = FactionControl.getEnemyList();
    }
    else if (turnType === TurnType.ALLY) {
        list = AllyList.getAliveList();
    }
    else if (turnType == TurnType.NEUTRAL) {
        list = FactionControl.getNeutralList();
    }
    
    return list;
}

//Object that is the turn of the neutral faction.
FreeAreaScene.neutralTurnObject = null;

//Returns the neutral object if it is the neutral faction's turn.
var ext02 = FreeAreaScene.getTurnObject;
FreeAreaScene.getTurnObject = function() {
        var obj = null;
        var type = root.getCurrentSession().getTurnType();
        
        if (type === TurnType.PLAYER) {
            obj = this._playerTurnObject;
        }
        else if (type === TurnType.ENEMY) {
            obj = this._enemyTurnObject;
        }
        else if (type === TurnType.ALLY) {
            obj = this._partnerTurnObject;
        }
        else if (type === TurnType.PLAYER2) {
            obj = this._partner2TurnObject;
        }
        
        return obj;
    }

//Creates the neutral faction turn.
var ext03 = FreeAreaScene._prepareSceneMemberData;
FreeAreaScene._prepareSceneMemberData = function() {
    ext03.call(this);
    this._neutralTurnObject = createObject(EnemyTurn);
}

//When the Ally Phase ends, it begins the Neutral Phase
TurnChangeEnd._startNextTurn = function() {
	var nextTurnType;
	var turnType = root.getCurrentSession().getTurnType();
	
	this._checkActorList();
	
	if (turnType === TurnType.PLAYER) {
		nextTurnType = TurnType.ENEMY;
	}
	else if (turnType === TurnType.ENEMY) {
		nextTurnType = TurnType.ALLY;
	}
	else if (turnType === TurnType.ALLY){
		nextTurnType = TurnType.NEUTRAL;
	}
	else{
		nextTurnType = TurnType.PLAYER;
	}
	
	root.getCurrentSession().setTurnType(nextTurnType);
}

//Returns the pic of the neutral frame if the unit is part of the neutral faction.
var ext04 = TurnMarkFlowEntry._getTurnFrame;
TurnMarkFlowEntry._getTurnFrame = function() {
    var pic = ext04.call(this);
    var turnType = root.getCurrentSession().getTurnType();

    if (turnType == TurnType.NEUTRAL) {
        pic = root.getMetaSession().global.neutralFrame!=null ? root.getBaseData().getUIResourceList(UIType.SCREENFRAME, false).getDataFromId(root.getMetaSession().global.neutralFrame) : root.queryUI('enemyturn_frame');
    }

    return pic;
}

//Returns the pic of the neutral window if the unit is part of the neutral faction.
EasyAttackWindow._drawWindowInternal = function(x, y, width, height) {
    var pic = null;
    var textui = this.getWindowTextUI();
    
    if (textui !== null) {
        pic = textui.getUIImage();
    }
    
    if (pic !== null) {
        if (FactionControl.getUnitType(this._unit) == UnitType.NEUTRAL && root.getMetaSession().global.neutralWindow!=null) {
            pic = root.getBaseData().getUIResourceList(UIType.MENUWINDOW, false).getDataFromId(root.getMetaSession().global.neutralWindow);
        }
        WindowRenderer.drawStretchWindow(x, y, width, height, pic);
    }
}

//Returns the pic of the neutral window if the unit is part of the neutral faction.
PosBaseWindow._drawWindowInternal = function(x, y, width, height) {
    var pic = null;
    var textui = this.getWindowTextUI();
    
    if (textui !== null) {
        pic = textui.getUIImage();
    }
    
    if (pic !== null) {
        if (FactionControl.getUnitType(this._unit) == UnitType.NEUTRAL && root.getMetaSession().global.neutralWindow!=null) {
            pic = root.getBaseData().getUIResourceList(UIType.MENUWINDOW, false).getDataFromId(root.getMetaSession().global.neutralWindow);
        }
        WindowRenderer.drawStretchWindow(x, y, width, height, pic);
    }
}

//Only show the Neutral Phase graphic if there are neutral units.
var ext07 = BaseTurnLogoFlowEntry._isTurnGraphicsDisplayable
BaseTurnLogoFlowEntry._isTurnGraphicsDisplayable = function() {
    var displayable, count;
    turnType = root.getCurrentSession().getTurnType();
    if (turnType == TurnType.NEUTRAL) {
        count = FactionControl.getNeutralList().getCount();
        displayable = count > 0;
    }
    else {
        displayable = ext07.call(this)
    }
    
    return displayable;
}

//Adds music for neutral units
BaseTurnLogoFlowEntry._changeMusic = function() {
    var handle;
    var handleActive = root.getMediaManager().getActiveMusicHandle();
    var mapInfo = root.getCurrentSession().getCurrentMapInfo();
    var turnType = root.getCurrentSession().getTurnType();
    
    if (turnType === TurnType.PLAYER) {
        handle = mapInfo.getPlayerTurnMusicHandle();
    }
    else if (turnType === TurnType.ALLY) {
        handle = mapInfo.getAllyTurnMusicHandle();
    }
    else if (turnType == TurnType.ENEMY) {
        handle = mapInfo.getEnemyTurnMusicHandle();
    }
    else {
        var id = mapInfo.custom.neutralMusic!=null ? mapInfo.custom.neutralMusic : -1;
        handle = id>=0 ? root.createResourceHandle(false, id, 0, 0, 0) : mapInfo.getEnemyTurnMusicHandle();
    }
    
    // Play only if it's music which differs from the current music.
    if (!handle.isEqualHandle(handleActive)) {
        MediaControl.resetMusicList();
        MediaControl.musicPlayNew(handle);
    }
}

//Ensures that neutral units can't go through enemy units and viceversa
var ext08 = TurnChangeEnd._startNextTurn;
TurnChangeEnd._startNextTurn = function() {
    var session = root.getCurrentSession();
    var turnType = session.getTurnType();
    if (turnType==TurnType.ENEMY) {
        this._removeUnpassableTiles(FactionControl.getNeutralList());
    }
    else if (turnType==TurnType.NEUTRAL) {
        this._removeUnpassableTiles(FactionControl.getEnemyList());
    }

    ext08.call(this);

    turnType = session.getTurnType();
    if (turnType==TurnType.ENEMY) {
        this._assignUnpassableTiles(FactionControl.getNeutralList());
    }
    else if (turnType==TurnType.NEUTRAL) {
        this._assignUnpassableTiles(FactionControl.getEnemyList());
    }
}

TurnChangeEnd._assignUnpassableTiles = function(list) {
    var session = root.getCurrentSession();
    var unit;
    var unpassable = root.createResourceHandle(true, 0, 0, 6, 0);

    for (var i=0; i<list.getCount(); i++) {
        unit = list.getData(i);
        unit.custom.oldTerrain = session.getMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), false);
        session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, unpassable);
    }
}

TurnChangeEnd._removeUnpassableTiles = function(list) {
    var session = root.getCurrentSession();
    var unit;
    var oldTerrain;

    for (var i=0; i<list.getCount(); i++) {
        unit = list.getData(i);
        oldTerrain = unit.custom.oldTerrain;
        session.setMapChipGraphicsHandle(unit.getMapX(), unit.getMapY(), true, oldTerrain);
    }
}

FactionControl = {

    getUnitType: function(unit) {
        if (unit.custom.neutralFaction!=null && unit.custom.neutralFaction) {
            return UnitType.NEUTRAL;
        }
        else {
            return unit.getUnitType();
        }
    },

    getUnitFilter: function(unit, filter) {
        if (unit.custom.neutralFaction!=null && unit.custom.neutralFaction) {
            return UnitFilterFlag.NEUTRAL;
        }
        else {
            return filter;
        }
    },

    getNeutralList: function() {
        var enemyList = EnemyList.getAliveList();
        var neutralArray = [];
        var neutralList;

        for (var i=0; i<enemyList.getCount(); i++) {
            if (this.getUnitType(enemyList.getData(i))==UnitType.NEUTRAL) {
                neutralArray.push(enemyList.getData(i));
            }
        }

        neutralList = StructureBuilder.buildDataList();
        neutralList.setDataArray(neutralArray);
        
        return neutralList;
    },

    getEnemyList: function() {
        var enemyList = EnemyList.getAliveList();
        var enemyArray = [];

        for (var i=0; i<enemyList.getCount(); i++) {
            if (this.getUnitType(enemyList.getData(i))==UnitType.ENEMY) {
                enemyArray.push(enemyList.getData(i));
            }
        }

        enemyList = StructureBuilder.buildDataList();
        enemyList.setDataArray(enemyArray);

        return enemyList;
    },

    getEnemyAndNeutralList: function() {
        var enemyList = this.getEnemyList();
        var neutralList = this.getNeutralList();
        var enemyNeutralArray = [];
        var enemyNeutralList;

        for (var i=0; i<enemyList.getCount(); i++) {
            enemyNeutralArray.push(enemyList.getData(i));
        }

        for (var i=0; i<neutralList.getCount(); i++) {
            enemyNeutralArray.push(neutralList.getData(i));
        }

        enemyNeutralList = StructureBuilder.buildDataList();
        enemyNeutralList.setDataArray(enemyNeutralArray);

        return enemyNeutralList;
    }

}