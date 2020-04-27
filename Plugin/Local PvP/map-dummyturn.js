
var DummyTurnMode = {
	WAIT: 0,
	PROCEED: 1
};
var DummyTurn = defineObject(BaseTurn,
{
	_targetUnit: null,
	_xCursorSave: 0,
	_yCursorSave: 0,
	_xAutoCursorSave: 0,
	_yAutoCursorSave: 0,
	_isPlayerActioned: false,
	_mapLineScroll: null,
	_mapEdit: null,
	_mapSequenceArea: null,
	_mapSequenceCommand: null,
	_mapCommandManager: null,
	_eventChecker: null,
	_wait: 0,
	_http: null,


	// It's called if the turn is switched.
	openTurnCycle: function() {
		//this._prepareTurnMemberData();
		//this._completeTurnMemberData();
		this._http = createObject(StatusChecker);
		this._http.createHTTPObject();
		this.changeCycleMode(DummyTurnMode.WAIT);
	},
	
	moveTurnCycle: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode === DummyTurnMode.WAIT) {
			if(!this._http.getStatus()){
				wait(200);
				return MoveResult.CONTINUE;	}
			else {
				this.changeCycleMode(DummyTurnMode.PROCEED);
				return MoveResult.END;
			}
		}
		
		
		return result;
	},


	drawTurnCycle: function() {
		var mode = this.getCycleMode();
		if (mode === DummyTurnMode.WAIT) {
			this.drawNoticeView(270, 200);		
			this._http.getStatus();
			
		}
		if (mode === DummyTurnMode.PROCEED) {
			TurnControl.turnEnd();
		}

	},
	
	drawNoticeView: function(x, y) {
		var textui = root.queryTextUI('support_title');
		var pic = textui.getUIImage();
		var width = TitleRenderer.getTitlePartsWidth();
		var height = TitleRenderer.getTitlePartsHeight();
		var count = 6;
		
		TitleRenderer.drawTitle(pic, x, y, width, height, count);
		
		x += 30;
		y += 18;
		var color = textui.getColor();
		var font = textui.getFont();
		var text = 'Waiting for the other player...';
		var infoColor = ColorValue.KEYWORD;
		var width = TextRenderer.getTextWidth(text, font) + 5;
		
		TextRenderer.drawKeywordText(x, y, text, -1, infoColor, font);
	}



})



StatusChecker = defineObject(BaseObject, {
	_http: null,

	getStatus: function() {
		
		this._http.open('GET', "http://localhost:8080/SRPGStudioServer/rest/connect/checkStatus", false);
		this._http.send();

		if(this._http.readyState == 4){
			var result = this._http.responseText;
			root.log("Current Turn:" + this._http.responseText)
			if(result == root.getMetaSession().global.playerID) 
			{
					
					this._http.abort();
					return true;
				}	

			}
		this._http.abort();
		return false;
	},


	createHTTPObject: function() {
		this._http = new ActiveXObject("Msxml2.XMLHTTP.6.0");
	}

})