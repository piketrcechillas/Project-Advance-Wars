


var CommandActionType = {
	NEWGAME: 0,
	CONTINUE: 1,
	ENDGAME: 2,
	
	UNITSORTIE: 10,
	UNITMARSHAL: 11,
	COMMUNICATION: 12,
	SHOP: 13,
	BONUS: 14,
	BATTLESTART: 15,
	LOAD: 16,
	SAVE: 17,
	
	CONFIG: 20,
	OBJECTIVE: 21,
	TALKCHECK: 22,
	UNITSUMMARY: 23,
	SKILL: 24,
	SWITCH: 25,
	VARIABLE: 26,
	TURNEND: 27,
	
	EXTRA: 30,
	RECOLLECTION: 31,
	CHARACTER: 32,
	WORD: 33,
	GALLERY: 34,
	SOUNDROOM: 35,
	
	QUEST: 40,
	IMAGETALK: 41,
	NEXT: 42,
	SHOPLIST: 43,
	EXPERIENCEDISTRIBUTION: 44,

	UPLOAD: 99,
	DOWNLOAD: 100,
	TEST: 101,

	DEPLOY: 102
};


MapCommand.Download = defineObject(BaseListCommand,
{
	openCommand: function() {
		var MapInfo = root.getCurrentSession().getCurrentMapInfo();
		var list = MapInfo.getListFromUnitGroup(UnitGroup.ENEMYEVENT)
		var count = list.getCount();
		var enemyUnit = list.getData(0);		
		var http = new ActiveXObject("Microsoft.XMLHTTP");
		var generator = createObject(DynamicEvent);
		var Dynamo = generator.acquireEventGenerator();
		var animeData = root.getBaseData().getEffectAnimationList(true).getDataFromID(15);
   		http.open('GET', "http://localhost:8080/SRPGStudioServer/rest/connect/download", true);

    	http.send('');


    	root.log(http.readyState);

 
    	if(http.readyState == 4){
    		root.log("Response code: " + http.status);
    		dynamicAnime = createObject(DynamicAnime);
    		dynamicAnime.startDynamicAnime(animeData, posX, posY);
    		var text = http.responseText;
    		var posX = text.substr(0, text.indexOf(' '));
    		var posY = text.substr(text.indexOf(' ') + 1);
    		targetUnit = root.getObjectGenerator().generateUnitFromBaseUnit(enemyUnit);
    		targetUnit.setInvisible(true);
    		targetUnit.setMapX(posX);
			targetUnit.setMapY(posY);
			var Pixx = LayoutControl.getPixelX(targetUnit.getMapX());
			var Pixy = LayoutControl.getPixelY(targetUnit.getMapY());
			var pos = LayoutControl.getMapAnimationPos(Pixx, Pixy, animeData);
			
			Dynamo.animationPlay(animeData, pos.x, pos.y, false, AnimePlayType.SYNC, 9999);
			Dynamo.execute();


			targetUnit.setInvisible(false);
    		root.log(http.responseText);
    	}
      

    	http.onreadystatechange = function(){
    		root.log(this.status);
    		if(this.readyState == 4 && this.status == 200)
  				root.log("Done");
		}
	},
	
	moveCommand: function() {
		return MoveResult.END;
	},
	
	drawCommand: function() {
	},

	getCommandName: function() {
		return "Download";
	},
	
	_saveCursor: function() {
		var playerTurnObject = SceneManager.getActiveScene().getTurnObject();
		
		playerTurnObject.setAutoCursorSave(false);
	}
}
);


MapCommand.Upload = defineObject(BaseListCommand,
{
	openCommand: function() {
		var http = new ActiveXObject("Microsoft.XMLHTTP");
		var list = EnemyList.getAliveList();
		var count = list.getCount();
		var enemyUnit = list.getData(0);
		var x = enemyUnit.getMapX();
		var y = enemyUnit.getMapY();
   		http.open('GET', "http://localhost:8080/SRPGStudioServer/rest/connect/upload?x=" + x + "&y=" + y, true);


    	http.send('');


    	root.log(http.readyState);

 
    	if(http.readyState == 4){
    		root.log("Response code: " + http.status);
    		root.log(http.responseText)
    	}
      

    	http.onreadystatechange = function(){

    		root.log(this.status);
    		if(this.readyState == 4 && this.status == 200)
  				root.log("Done");
		}

	},
	
	moveCommand: function() {
		return MoveResult.END;
	},
	
	drawCommand: function() {
	},

	getCommandName: function() {
		return "Upload";
	},
	
	_saveCursor: function() {
		var playerTurnObject = SceneManager.getActiveScene().getTurnObject();
		
		playerTurnObject.setAutoCursorSave(false);
	}
}
);


