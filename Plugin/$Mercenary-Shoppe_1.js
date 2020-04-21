var MercLayoutMode = {
	MESSAGE: 1,
	BUYSELLSELECT: 2,
	BUY: 3,
	BUYQUESTION: 4,
	SELL: 5,
	SELLQUESTION: 6,
	GOLDCHANGE: 7,
	VISITORSELECT: 8
};

var MercLayoutResult = {
	ACTION: 0,
	NOACTION: 1
};

var MercShopScreen = defineObject(BaseScreen,
{
	_targetUnit: null,
	_shopLayout: null,
	_screenIneropData: null,
	_isSale: false,
	_nextmode: 0,
	_mercSale: null,
	_discountFactor: 0,
	_shopItemArray: null,
	_inventoryArray: null,
	_buyMercWindow: null,
	_sellItemWindow: null,
	_buySellWindow: null,
	_buyQuestionWindow: null,
	_sellQuestionWindow: null,
	_visitorSelectWindow: null,
	_currencyWindow: null,
	_keeperWindow: null,
	_itemInfoWindow: null,
	_shopMessageTable: null,
	_activeSelectWindow: null,
	_activeItemWindow: null,
	
	setScreenData: function(screenParam) {
		this._prepareScreenMemberData(screenParam);
		this._completeScreenMemberData(screenParam);
	},
	
	moveScreenCycle: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode === ShopLayoutMode.BUYSELLSELECT) {
			result = this._moveBuySellSelect();
		}
		else if (mode === ShopLayoutMode.MESSAGE) {
			result = this._moveMessage();
		}
		else if (mode === ShopLayoutMode.BUY) {
			result = this._moveBuy();
		}
		else if (mode === ShopLayoutMode.BUYQUESTION) {
			result = this._moveBuyQuestion();
		}
		// else if (mode === ShopLayoutMode.SELL) {
			// result = this._moveSell();
		// }
		// else if (mode === ShopLayoutMode.SELLQUESTION) {
			// result = this._moveSellQuestion();
		// }
		else if (mode === ShopLayoutMode.VISITORSELECT) {
			result = this._moveVisitorSelect();
		}
		
		this._moveAnimation();
	
		return result;
	},
	
	drawScreenCycle: function() {
		var width = this._getTopWindowWidth();
		var height = this._getTopWindowHeight();
		var xBase = LayoutControl.getCenterX(-1, width);
		var yBase = LayoutControl.getCenterY(-1, height);
		
		// Top
		this._keeperWindow.drawWindow(xBase, yBase);
		this._activeSelectWindow.drawWindow(xBase + this._keeperWindow.getWindowWidth(), yBase);
		this._currencyWindow.drawWindow(xBase + this._keeperWindow.getWindowWidth(), yBase + this._activeSelectWindow.getWindowHeight());
		
		if (this.getCycleMode() === ShopLayoutMode.VISITORSELECT) {
			this._visitorSelectWindow.drawWindow(xBase + this._keeperWindow.getWindowWidth(), yBase + this._activeSelectWindow.getWindowHeight());
		}
		
		// Bottom
		yBase += this._keeperWindow.getWindowHeight();
		width = this._activeItemWindow.getWindowWidth();
		this._itemInfoWindow.drawWindow(xBase + width, yBase);
		this._activeItemWindow.drawWindow(xBase, yBase);
	},
	
	drawScreenBottomText: function(textui) {
	},
	
	getScreenInteropData: function() {
		return this._screenIneropData;
	},
	
	setScreenInteropData: function(screenIneropData) {
		this._screenIneropData = screenIneropData;
	},
	
	getScreenResult: function() {
		return this._isSale ? ShopLayoutResult.ACTION : ShopLayoutResult.NOACTION;
	},
	
	getDiscountFactor: function() {
		return this._discountFactor;
	},
	
	getVisitor: function() {
		return this._targetUnit;
	},
	
	getStockVisitor: function() {
		if (this._targetUnit === null) {
			return null;
		}
		
		if (this._visitorSelectWindow === null) {
			return this._targetUnit;
		}
		
		return this._visitorSelectWindow.getSelectIndex() === 0 ? this._targetUnit : null;
	},
	
	getGold: function() {
		return root.getMetaSession().getGold();
	},
	
	setGold: function(gold) {
		root.getMetaSession().setGold(gold);
	},
	
	getGoldFromItem: function(unit) {
		return unit.custom.Price + (unit.getLv()-1 * Math.round(unit.custom.Price/10))
	},
	
	getShopItemArray: function() {
		return this._shopItemArray;
	},
	
	getInventoryArray: function() {
		return this._inventoryArray;
	},
	
	getShopLayout: function() {
		return this._shopLayout;
	},
	
	getSelectItem: function() {
		return this._activeItemWindow.getShopSelectItem();
	},

	notifyInfoItem: function(item) {
	},
	
	isStockDefault: function() {
		return root.getCurrentScene() === SceneType.BATTLESETUP || Miscellaneous.isStockAccess(this._targetUnit);
	},
	
	_prepareScreenMemberData: function(screenParam) {
		// If the unit is null, stock item is a target for purchase and sell.
		// For instance, the item is added in the stock item when purchasing it.
		// Meanwhile, if the unit is not null, some unit visited a shop, so the unit item is a target.
		// It means, the item is added at the unit item list.
		this._targetUnit = screenParam.unit;
		
		this._shopLayout = screenParam.shopLayout;
		
		// Set true if purchasing or selling has been done even once.
		this._isSale = false;
		
		this._nextmode = 0;
		this._mercSale = createObject(MercSale);
		this._mercSale.setParentShopScreen(this);
		
		this._shopItemArray = screenParam.itemArray;
		this._inventoryArray = screenParam.inventoryArray;
		this._buyMercWindow = createWindowObject(BuyMercWindow, this);
		this._sellItemWindow = createWindowObject(SellItemWindow, this);
		this._buySellWindow = createWindowObject(BuySellWindow, this);
		this._buyQuestionWindow = createWindowObject(BuyQuestionWindow, this);
		this._sellQuestionWindow = createWindowObject(SellQuestionWindow, this);
		this._visitorSelectWindow = createWindowObject(VisitorSelectWindow, this);
		this._currencyWindow = createWindowObject(ShopCurrencyWindow, this);
		this._keeperWindow = createWindowObject(MercMessageWindow, this);
		this._itemInfoWindow = createWindowObject(ItemInfoWindow, this);
		
		this._activeSelectWindow = this._buySellWindow;
		this._activeItemWindow = this._buyMercWindow;
		
		this._createShopMessageTable(this._shopLayout);
	},
	
	_completeScreenMemberData: function(screenParam) {
		this._arrangeInventoryArray();
		this._checkDiscountFactor();
		
		this._buyMercWindow.setShopWindowData();
		this._sellItemWindow.setShopWindowData();
		this._buySellWindow.setShopWindowData();
		this._buyQuestionWindow.setShopWindowData();
		this._sellQuestionWindow.setShopWindowData();
		this._visitorSelectWindow.setShopWindowData();
		
		this._currencyWindow.setShopWindowData(this.getGold());
		
		this._keeperWindow.createShopAnalyzer();
		
		this._startMessage(this._shopMessageTable.FirstMessage, ShopLayoutMode.BUYSELLSELECT);
	},
	
	_createShopMessageTable: function(shopLayout) {
		this._shopMessageTable = {};
		this._shopMessageTable.FirstMessage = "Greetings!";
		this._shopMessageTable.QuestionBuy = "Who are you after?";
		this._shopMessageTable.QuestionSell = "Nope, you shouldn't see this.";
		this._shopMessageTable.SelectQuestion = "You sure?";
		this._shopMessageTable.OtherMessage = "Change your mind?";
		this._shopMessageTable.EndBuy = "Thanks for your business.";
		this._shopMessageTable.EndSell = "You shouldn't see this...";
		this._shopMessageTable.NoGold = "You need a bit more coin.";
		this._shopMessageTable.ItemFull = "You're full up!";
		this._shopMessageTable.ForceStock = "This shouldn't happen!";
		this._shopMessageTable.NoSell = "This shouldn't happen 2.0!";
		this._shopMessageTable.NoItemBring = "YOU SHOULDN'T BE ABLE TO SELECT THIS!";
	},
	
	_arrangeInventoryArray: function() {
		var i;
		var count = this._inventoryArray.length;
		
		for (;;) {
			count = this._inventoryArray.length;
			for (i = 0; i < count; i++) {
				if (this._inventoryArray[i] === null) {
					this._cutArrayData(i);
					break;
				}
			}
			
			if (i === count) {
				break;
			}
		}
	},
	
	_checkDiscountFactor: function() {
		var factor = 100;
		var skill;
		
		if (this._targetUnit !== null) {
			// Check if a visitor to the shop has a "Discount" skill.
			skill = SkillControl.getBestPossessionSkill(this._targetUnit, SkillType.DISCOUNT);
			if (skill !== null) {
				factor = 100 - skill.getSkillValue();
			}
		}
		
		this._discountFactor = factor / 100;
	},
	
	_isStockSelectable: function() {
		if (this._targetUnit === null) {
			return false;
		}
		
		return this.isStockDefault();
	},
	
	_moveTop: function() {
		this._startMessage(this._shopMessageTable.FirstMessage, ShopLayoutMode.BUYSELLSELECT);
		return MoveResult.CONTINUE;
	},
	
	_moveBuySellSelect: function() {
		var result = this._buySellWindow.moveWindow();
			
		if (result === BuySellSelectResult.BUY) {
			if (this._buyMercWindow.getItemCount() > 0) {
				this._startMessage(this._shopMessageTable.QuestionBuy, ShopLayoutMode.BUY);
			}
		}
		else if (result === BuySellSelectResult.SELL) {
			if (this._isStockSelectable()) {
				// Enter the mode to select the "unit" or the "stock".
				this._processMode(ShopLayoutMode.VISITORSELECT);
			}
			else {
				if (this._buySellWindow.isPossessionItem()) {
					this._startMessage(this._shopMessageTable.QuestionSell, ShopLayoutMode.SELL);
				}
				else {
					this._startMessage(this._shopMessageTable.NoItemBring, ShopLayoutMode.BUYSELLSELECT);
				}
			}
		}
		else if (result === BuySellSelectResult.CANCEL) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveMessage: function() {
		if (this._keeperWindow.moveWindow() !== MoveResult.CONTINUE) {
			this._processMode(this._nextmode);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveBuy: function() {
		var input = this._buyMercWindow.moveWindow();
			
		if (input === ScrollbarInput.SELECT) {
			this._startMessage(this._shopMessageTable.SelectQuestion, ShopLayoutMode.BUYQUESTION);
		}
		else if (input === ScrollbarInput.CANCEL) {
			this._startMessage(this._shopMessageTable.OtherMessage, ShopLayoutMode.BUYSELLSELECT);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveBuyQuestion: function() {
		var result = this._buyQuestionWindow.moveWindow();
		
		if (result === BuyQuestionResult.BUY) {
			if (this._activeItemWindow._scrollbar._isItemBuyable(this._activeItemWindow.getShopSelectItem())){
				// "Buy" is selected, so purchase it.
				this._startSale(true, false);
				if (this._shopItemArray.length !== 0) {
					this._startMessage(this._shopMessageTable.EndBuy, ShopLayoutMode.BUY);
				}
				else {
					// If there is nothing to purchase, back to top.
					this._startMessage(this._shopMessageTable.OtherMessage, ShopLayoutMode.BUYSELLSELECT);
				}
			}
			else{
				MediaControl.soundDirect('operationblock');
			}
		}
		else if (result === BuyQuestionResult.CANCEL) {
			this._startMessage(this._shopMessageTable.QuestionBuy, ShopLayoutMode.BUY);
		}
		else if (result === BuyQuestionResult.NOGOLD) {
			this._startMessage(this._shopMessageTable.NoGold, ShopLayoutMode.BUY);
		}
		else if (result === BuyQuestionResult.ITEMFULL) {
			this._startMessage(this._shopMessageTable.ItemFull, ShopLayoutMode.BUY);
		}
		else if (result === BuyQuestionResult.FORCESTOCK) {
			this._startSale(true, true);
			if (this._shopItemArray.length !== 0) {
				this._startMessage(this._shopMessageTable.ForceStock, ShopLayoutMode.BUY);
			}
			else {
				this._startMessage(this._shopMessageTable.ForceStock, ShopLayoutMode.BUYSELLSELECT);
			}
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveSell: function() {
		var input = this._sellItemWindow.moveWindow();
		
		if (input === ScrollbarInput.SELECT) {
			this._startMessage(this._shopMessageTable.SelectQuestion, ShopLayoutMode.SELLQUESTION);
		}
		else if (input === ScrollbarInput.CANCEL) {
			this._startMessage(this._shopMessageTable.OtherMessage, ShopLayoutMode.BUYSELLSELECT);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveSellQuestion: function() {
		var result = this._sellQuestionWindow.moveWindow();
			
		if (result === SellQuestionResult.SELL) {
			// "Sell" is selected, so sell it.
			this._startSale(false);
			if (this._buySellWindow.isPossessionItem()) {
				this._startMessage(this._shopMessageTable.EndSell, ShopLayoutMode.SELL);
			}
			else {
				// If there is nothing to sell, back to top.
				this._startMessage(this._shopMessageTable.OtherMessage, ShopLayoutMode.BUYSELLSELECT);
			}
		}
		else if (result === SellQuestionResult.CANCEL) {
			this._startMessage(this._shopMessageTable.QuestionSell, ShopLayoutMode.SELL);
		}
		else if (result === SellQuestionResult.NOSELL) {
			this._startMessage(this._shopMessageTable.NoSell, ShopLayoutMode.SELL);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveVisitorSelect: function() {
		var result = this._visitorSelectWindow.moveWindow();
		
		if (result === VisitorSelectResult.UNIT) {
			this._sellItemWindow.updateItemArea();
			this._startMessage(this._shopMessageTable.QuestionSell, ShopLayoutMode.SELL);
		}
		else if (result === VisitorSelectResult.STOCK) {
			this._sellItemWindow.updateItemArea();
			this._startMessage(this._shopMessageTable.QuestionSell, ShopLayoutMode.SELL);
		}
		else if (result === VisitorSelectResult.CANCEL) {
			this._processMode(ShopLayoutMode.BUYSELLSELECT);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveAnimation: function() {	
		this._currencyWindow.moveWindow();
		return MoveResult.CONTINUE;
	},
	
	_getCutIndex: function(item) {
		var i, obj, n;
		var count = this._shopItemArray.length;
		
		for (i = 0; i < count; i++) {
			if (this._shopItemArray[i] !== item) {
				continue;
			}
			
			obj = this._inventoryArray[i];
		}
		
		return this._shopItemArray[i];
	},
	
	_startSale: function(isBuy, isForceStock) {
		var cutIndex, price;
		if (this._activeItemWindow._scrollbar._isItemBuyable(this._activeItemWindow.getShopSelectItem())){
			price = this._mercSale.startSale(this._activeItemWindow.getShopSelectItem());
			
			if (isBuy) {
				cutIndex = this._getCutIndex(this._activeItemWindow.getShopSelectItem());
				if (cutIndex !== -1) {
					this._cutArrayData(cutIndex);
					this._buyMercWindow.updateItemArea();
				}
			}
			
			// Change the contents of window to display gold.
			this._currencyWindow.startPriceCount(price);
			
			this._isSale = true;
			
			// When purchasing it, the item is increased, and when selling it, the item is decreased, so always call.
			this._sellItemWindow.updateItemArea();
			
			this._playSaleSound();
		}
		else{
			MediaControl.soundDirect('operationblock');
		}
	},
	
	_cutArrayData: function(cutIndex) {
		this._shopItemArray.splice(cutIndex, 1);
		// this._inventoryArray.splice(cutIndex, 1);
	},
	
	_playSaleSound: function() {
		MediaControl.soundDirect('itemsale');
	},
	
	_getTopWindowWidth: function() {
		return this._activeItemWindow.getWindowWidth() + this._itemInfoWindow.getWindowWidth();
	},
	
	_getTopWindowHeight: function() {
		return this._keeperWindow.getWindowHeight() + this._activeItemWindow.getWindowHeight();
	},
	
	_startMessage: function(text, mode) {
		this._keeperWindow.setShopMessage(text);
		this.changeCycleMode(ShopLayoutMode.MESSAGE);
		this._nextmode = mode;
	},
	
	_processMode: function(mode) {
		if (mode === ShopLayoutMode.SELLQUESTION) {
			this._activeSelectWindow = this._sellQuestionWindow;
			this._activeSelectWindow.resetShopIndex();
			this._activeSelectWindow.setShopActive(true);
			this._activeItemWindow = this._sellItemWindow;
			this._activeItemWindow.setShopActive(false);
		}
		else if (mode === ShopLayoutMode.BUYQUESTION) {
			this._activeSelectWindow = this._buyQuestionWindow;
			this._activeSelectWindow.resetShopIndex();
			this._activeSelectWindow.setShopActive(true);
			this._activeItemWindow = this._buyMercWindow;
			this._activeItemWindow.setShopActive(false);
		}
		else if (mode === ShopLayoutMode.BUYSELLSELECT) {
			this._activeSelectWindow = this._buySellWindow;
			this._activeSelectWindow.setShopActive(true);
			this._itemInfoWindow.setInfoItem(null);
			this._activeItemWindow.hideShopCursor();
		}
		else if (mode === ShopLayoutMode.BUY) {
			this._activeSelectWindow = this._buySellWindow;
			this._activeSelectWindow.setShopActive(false);
			this._activeItemWindow = this._buyMercWindow;
			this._activeItemWindow.setShopActive(true);
			// this._itemInfoWindow.setInfoItem(this._buyMercWindow.getShopSelectItem());
		}
		else if (mode === ShopLayoutMode.SELL) {
			this._activeSelectWindow = this._buySellWindow;
			this._activeSelectWindow.setShopActive(false);
			this._activeItemWindow = this._sellItemWindow;
			this._activeItemWindow.setShopActive(true);
			// this._itemInfoWindow.setInfoItem(this._sellItemWindow.getShopSelectItem());
		}
		else if (mode === ShopLayoutMode.VISITORSELECT) {
			this._activeSelectWindow.setShopActive(false);
			this._visitorSelectWindow.setShopActive(true);
		}
		
		this._nextmode = 0;
		this.changeCycleMode(mode);
	}
}
);


var MercSale = defineObject(BaseObject,
{
	_parentShopScreen: null,
	
	startSale: function(unit) {
		var price = this._getPrice(unit)
		
		this._pushUnit(unit);
		
		this._setPrice(price);
		
		return price;
	},
	
	setParentShopScreen: function(parentShopScreen) {
		this._parentShopScreen = parentShopScreen;
	},
	
	_pushUnit: function(unit) {
		// The item of BaseData cannot be used as itself, so duplicate it with root.duplicateItem.
		var unit2 = root.getObjectGenerator().generateUnitFromBaseUnit(unit)
		unit2.setSortieState(SortieType.UNSORTIE)
		unit2.setAliveState(AliveType.ALIVE)
	},
	
	_getPrice: function(unit) {
		var price;
		
		price = unit.custom.Price + (unit.getLv()-1 * Math.round(unit.custom.Price/10))
		price = Math.floor(price * this._parentShopScreen.getDiscountFactor());
		price *= -1;
		
		return price;
	},
	
	_setPrice: function(price) {
		this._parentShopScreen.setGold(this._parentShopScreen.getGold() + price);
	}
}
);

var BuyMercWindow = defineObject(ShopItemWindow,
{
	_availableArray: null,
	
	getScrollbarObject: function() {
		return MercScrollbar;
	},
	
	updateItemArea: function() {
		var itemArray = this.getParentInstance().getShopItemArray();
		
		// If the inventory is set, the item disappears, so save the scroll position.
		this._scrollbar.saveScroll();
		
		this._scrollbar.setObjectArray(itemArray);
		this._scrollbar.resetAvailableData();
		
		this._scrollbar.restoreScroll();
	}
}
);

var MercScrollbar = defineObject(BaseScrollbar,
{
	_availableArray: null,
	
	drawScrollContent: function(x, y, object, isSelect, index) {
		var textui = this.getParentTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		var item = object;
		var arr = this.getParentInstance().getParentInstance().getInventoryArray();
		
		if (!this._availableArray[index]) {
			// Dim the item which doesn't satisfy the condition.
			color = ColorValue.DISABLE;
		}
		TextRenderer.drawText(x,y,item.getName(),200,color,font)
		NumberRenderer.drawRightNumber(x+Math.round(this.getParentInstance().getWindowWidth()*0.75),y,this._getPrice(item))
	},
	
	resetAvailableData: function() {
		var i, unit;
		var length = this._objectArray.length;
		
		this._availableArray = [];
		
		for (i = 0; i < length; i++) {
			unit = this._objectArray[i];
			if (unit !== null) {
				this._availableArray.push(this._isItemBuyable(unit));
			}
		}
	},
	
	getObjectWidth: function() {
		return ItemRenderer.getShopItemWidth();
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
	},
	
	_isItemBuyable: function(unit) {
		var i;
		for (i = 0; i < PlayerList.getAliveList().getCount(); i++){
			if (PlayerList.getAliveList().getData(i).getId() === unit.getId()){
				return false;
			}
		}
		return true;
	},
	
	_getPrice: function(unit) {
		var price = this.getParentInstance().getParentInstance().getGoldFromItem(unit);
		
		return Math.floor(price * this.getParentInstance().getDiscountFactor());
	}
}
);

MarshalCommand.Recruit = defineObject(MarshalBaseCommand,
{
	_shopData: null,
	_shopLayoutScreen: null,
	
	checkCommand: function() {
		var screenParam = this._createScreenParam();
			
		if (screenParam.unit === null) {
			return false;
		}
		
		this._shopLayoutScreen = createObject(MercShopScreen);
		this._shopLayoutScreen.setScreenInteropData(null);
		SceneManager.addScreen(this._shopLayoutScreen, screenParam);
		
		return true;
	},
	
	isMarshalScreenCloesed: function() {
		return SceneManager.isScreenClosed(this._shopLayoutScreen);
	},
	
	getInfoWindowType: function() {
		return MarshalInfoWindowType.UNIT;
	},
	
	getCommandName: function() {
		return "Recruit"
	},
	
	getMarshalDescription: function() {
		return StringTable.Marshal_Shop;
	},
	
	setShopData: function(shopData) {
		this._shopData = shopData;
	},
	
	_createScreenParam: function() {
		var screenParam = ScreenBuilder.buildShopLayout();
		var shopData = this._shopData;
		
		screenParam.unit = this._unitSelectWindow.getFirstUnit();
		screenParam.shopLayout = null
		screenParam.itemArray = []
		for (var l = 0; l < root.getBaseData().getPlayerList().getCount(); l++){
			if (root.getBaseData().getPlayerList().getData(l).custom.Buyable){
				screenParam.itemArray.push(root.getBaseData().getPlayerList().getData(l))
			}
		}
		
		for (var i = 0; i < screenParam.itemArray.length; i++){
			for (var m = 0; m < PlayerList.getAliveList().getCount(); m++){
				if (screenParam.itemArray[i].getId() === PlayerList.getAliveList().getData(m).getId()){
					screenParam.itemArray.splice(i,1)
				}
			}
		}
		screenParam.inventoryArray = []
		for (var j = 0; i < screenParam.itemArray.length; j++){
			screenParam.inventoryArray.push(1)
		}
		return screenParam;
	}
}
);

MarshalCommandWindow._appendRecruit = function(groupArray) {
	var i, shopData;
	var list = root.getCurrentSession().getCurrentMapInfo().getShopDataList();
	var count = list.getCount();
	
	for (i = 0; i < count; i++) {
		shopData = list.getData(i);
		if (shopData.isShopDisplayable()) {
			groupArray.appendObject(MarshalCommand.Recruit);
			groupArray[groupArray.length - 1].setShopData(shopData);
		}
	}
};

var REC001 = MarshalCommandWindow._configureMarshalItem;
MarshalCommandWindow._configureMarshalItem = function(groupArray) {
	REC001.call(this,groupArray)
	
	if (root.getCurrentScene() == SceneType.REST){
		groupArray.appendObject(MarshalCommand.Recruit)
	}
};

var MercMessageWindow = defineObject(BaseWindow,
{
	_message: null,
	_messageAnalyzer: null,
	
	createShopAnalyzer: function() {
		var messageAnalyzerParam = this._createMessageAnalyzerParam();
		
		this._messageAnalyzer = createObject(MessageAnalyzer);
		this._messageAnalyzer.setMessageAnalyzerParam(messageAnalyzerParam);
	},
	
	setShopMessage: function(text) {
		if (text === '') {
			text = ' ';
		}
		
		// Normally, this._messageAnalyzer.moveMessage doesn't return a control unless pressing decision,
		// but prevent it with "\at control character".
		this._messageAnalyzer.setMessageAnalyzerText('\\at[1]' + text);
	},
	
	moveWindowContent: function() {
		if (this._messageAnalyzer.moveMessageAnalyzer() !== MoveResult.CONTINUE) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
		this._drawKeeperFace(x, y);
		
		// When the shop owner's message continues over several pages, it looks strange,
		// so these strings shouldn't be specified at the func.
		// Several pages are not good, so the argument is not specified in associated with a cursor.
		this._messageAnalyzer.drawMessageAnalyzer(x + GraphicsFormat.FACE_WIDTH + 10, y + 10, -1, -1, null);
	},
	
	getWindowWidth: function() {
		return 445;
	},
	
	getWindowHeight: function() {
		return DefineControl.getFaceWindowHeight();
	},
	
	getWindowXPadding: function() {
		return DefineControl.getFaceXPadding();
	},
	
	getWindowYPadding: function() {
		return DefineControl.getFaceYPadding();
	},
	
	getWindowTextUI: function() {
		return root.queryTextUI('face_window');
	},
	
	getWindowUI: function() {
		return root.queryTextUI('face_window').getUIImage();
	},
	
	_drawKeeperFace: function(x, y) {
		// var handle = null;
		
		// ContentRenderer.drawFaceFromResourceHandle(x, y, handle);
	},
	
	_createMessageAnalyzerParam: function() {
		var textui = this.getWindowTextUI();
		var messageAnalyzerParam = StructureBuilder.buildMessageAnalyzerParam();
		
		messageAnalyzerParam.color = textui.getColor();
		messageAnalyzerParam.font = textui.getFont();
		messageAnalyzerParam.messageSpeedType = SpeedType.DIRECT;
		
		return messageAnalyzerParam;
	}
}
);