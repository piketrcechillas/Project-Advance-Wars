LoadSaveScrollbar.drawScrollContent = function(x, y, object, isSelect, index) {
		var width = this.getObjectWidth();
		var height = this.getObjectHeight();
		var pic = this._getWindowTextUI().getUIImage();
		
		WindowRenderer.drawStretchWindow(x, y, width, height, pic);
		
		x += DefineControl.getWindowXPadding();
		y += DefineControl.getWindowYPadding();
		
		if (object.isCompleteFile() || object.getMapInfo() !== null) {
			this._drawMain(x, y, object, index);
		}
		else {
			this._drawEmptyFile(x, y, index);
		}
		
		this._drawFileTitle(x, y, index);
	}