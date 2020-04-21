ItemRenderer.drawMercAlpha = function(x, y, item, color, font, isDrawLimit, alpha) {
		var interval = this._getItemNumberInterval();
		var iconWidth = GraphicsFormat.ICON_WIDTH + 5;
		var length = this._getTextLength();
		var handle = item.getIconResourceHandle();
		var graphicsRenderParam = StructureBuilder.buildGraphicsRenderParam();
		
		graphicsRenderParam.alpha = alpha;
		GraphicsRenderer.drawImageParam(x, y, handle, GraphicsType.ICON, graphicsRenderParam);
		
		TextRenderer.drawAlphaText(x + iconWidth, y + ContentLayout.KEYWORD_HEIGHT, item.custom.unit, length, color, alpha, font);
		
		if (isDrawLimit) {
			this.drawItemLimit(x + iconWidth + interval, y, item, alpha);
		}
	}

UnitCommand.Shop.isCommandDisplayable = function() {
		if(root.getCurrentSession().getCurrentMapInfo().custom.aw)
			return false;



		var event = this._getEvent();
		
		return event !== null && event.isEvent() && Miscellaneous.isItemAccess(this.getCommandTarget());
	}



ItemRenderer.drawMercItem = function(x, y, item, color, font, gold, amount) {
		ItemRenderer.drawMerc(x, y, item, color, font, false);
		this.drawAmount(x + 140, y, item, color, font, amount);
		//ItemRenderer.drawItemLimit(x + 225, y, item, 255);
		NumberRenderer.drawNumber(x + 285, y, gold);
	}

ItemRenderer.drawMerc = function(x, y, item, color, font, isDrawLimit) {
		this.drawMercAlpha(x, y, item, color, font, isDrawLimit, 255);
	}
