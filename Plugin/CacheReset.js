

(function(){

var CACHE_MAX_SIZE = 100;

var alias1 = CacheControl.createCacheGraphics;
CacheControl.createCacheGraphics = function(width, height, pic) {
	root.log("Cache size: " + this._cacheArray.length)
	if (this._cacheArray.length >= CACHE_MAX_SIZE) {
		this.clearCache();
	}

	return alias1.call(this, width, height, pic);
};

})();