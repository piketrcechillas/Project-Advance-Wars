
/*--------------------------------------------------------------------------
  
  ユニットのステータス欄の表示項目、
  レベルアップ時の項目の行数列数を調整するスクリプトです。
  
  公式の1.048対応に付き廃止
  
  作成者:
  o-to
  
  更新履歴:
  2016/01/06：新規作成
  2016/01/11：廃止
  
--------------------------------------------------------------------------*/

(function() {
/*
OT_MinUnitItemCount = 5;

// 非表示項目の設定
OT_SetDisableStatus = function()
{
	var disableStatus = {};
	
	OT_isStatusInCheck(disableStatus, ParamType.MHP);
	OT_isStatusInCheck(disableStatus, ParamType.MEP );
	OT_isStatusInCheck(disableStatus, ParamType.MFP );

	return disableStatus;
};

// パラメータが定義されていることを確認して非表示リストに挿入
OT_isStatusInCheck = function(disableStatus, status)
{
	if( typeof status === 'undefined' )
	{
		return;
	}

	disableStatus[status] = true;
};

// ユニットステータスの表示部分の構成部分
UnitMenuBottomWindow._createStatusEntry = function(unit) {
	var i;
	var count = ParamGroup.getParameterCount();
	var statusEntry = StructureBuilder.buildStatusEntry();
	var disableStatus = OT_SetDisableStatus();
	
	statusEntry.typeArray = [];
	statusEntry.paramArray = [];
	
	for (i = 0; i < count; i++) {
		// 除外項目があった場合、ユニットメニューのステータス欄に表示しない
		if( disableStatus[ParamGroup.getParameterType(i)] == true )
		{
			continue;
		}
		
		statusEntry.typeArray.push(ParamGroup.getParameterName(i));
		
		// ボーナスも加算する
		statusEntry.paramArray.push(ParamGroup.getLastValue(unit, i));
	}
	
	return statusEntry;
};

// ステータス画面に表示させるときの並び方を調整
UnitMenuBottomWindow._setStatusArea = function(unit) {
	var statusEntry = this._createStatusEntry(unit);
	
	// 3つ目の引数は列数、4つ目の引数は行数
	this._statusScrollbar.setStatusFromParam(statusEntry.typeArray, statusEntry.paramArray, 2, 5);
};


// レベルアップ時の項目列数
StatusScrollbar.getDefaultCol = function() {
	return 3;
};

// レベルアップ時の項目行数
StatusScrollbar.getDefaultRow = function() {
	return 4;
};

// アイテム欄のEP表示用
ItemRenderer.getItemHeight = function() {
	return 32;
};

// 現状の公式ソースではアイテム欄の高さを高めると
// ユニットステータスの欄が小さくなってしまうため、こちらで処理
DataConfig.getMinUnitItemCount = function()
{
	var max = DataConfig.getMaxUnitItemCount();
	
	if( max < OT_MinUnitItemCount )
	{
		return max;
	}
	
	return OT_MinUnitItemCount;
};

var alias1 = DefineControl.getVisibleUnitItemCount;
DefineControl.getVisibleUnitItemCount = function()
{
	var count = alias1.call(this);
	
	if( count < DataConfig.getMinUnitItemCount() )
	{
		count = DataConfig.getMinUnitItemCount();
	}
	
	return count;
};
*/
})();
