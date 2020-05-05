

/*-----------------------------------------------------------------------------------------------
  
  MP(EP)とFPの表示項目設定とウィンドウ描画設定スクリプトです。
    
  使用方法:
  ユニットやクラスにパラメータを設定してください。
  (パーセント指定可のものは数値以外に'10%'という風に
   設定する事でパーセント指定する事が可能です)

  作成者:
  o-to
  
  更新履歴:
  2016/01/06：新規作成

  2016/01/11：
  所持アイテムが満杯じゃないユニットとのアイテム交換時にエラーとなる不具合修整
  リアルタイム戦闘時、EP・FPが攻撃途中で途切れる戦闘だとモーションが狂う不具合修整
  CB氏のクラス説明スクリプトと競合しないようにEPとFPの描画を修正

  2016/07/31：
  EP、もしくはFPのみの実装したい場合の処理を追加

  2016/09/18：
  ウィンドウやゲージの描写時に画像をキャッシュしておらず、
  アプリ起動中にメモリがどんどん貯まる問題が発生していたため修正

  2017/05/17：
  Ver1.127以降にてシンプルウィンドウにEPとFPが表示されなかった問題を修正
  消費EPとFPをマイナス指定している時の表示を修正
  攻撃時にEPが使用EPを下回った際にFPが消費されていなかったため修正

  2017/05/18：
  FP消費、FP回復がEPとなっていたので修正

--------------------------------------------------------------------------*/

(function() {
// EPゲージ素材や表記名の宣言
OT_EPFrameSetting = {
	  Name          : 'Energy'
	, Material      : 'OT_AddStatus'
	, GaugeImg      : 'Gauge.png'
	, GaugeImgID    : 1
	, GaugeImgX     : 8
	, GaugeImgY     : -38
	, GaugeImgWidth : 100
	, DrawSide      : true
	, FontColor     : 0x00ffff
	, UseString     : '消費'
	, RecoveryString: '回復'
	, TextX         : 0
	, TextY         : 0
};

// FPゲージ素材や表記名の宣言
OT_FPFrameSetting = {
	  Name          : 'FP'
	, Material      : 'OT_AddStatus'
	, GaugeImg      : 'Gauge.png'
	, GaugeImgID    : 2
	, GaugeImgX     : 8
	, GaugeImgY     : -24
	, GaugeImgWidth : 100
	, DrawSide      : true
	, FontColor     : 0xffa000
	, CheckString   : 'で使用可'
	, UseString     : '消費'
	, RecoveryString: '回復'
	, TextX         : 0
	, TextY         : 0
};

// フレーム素材の宣言
OT_EnergyFrameSetting = {
	  Material      : 'OT_AddStatus'
	, WindowImg     : 'window.png'
	, WindowWidth   : 300
	, WindowHeight  : 32
};

// マップ内でのフレーム素材の宣言
OT_SimpleFrameSetting = {
	  Material        : 'OT_AddStatus'
	, WindowImg       : 'window2.png'
	, WindowHeight    : 24
	, GaugeImg        : 'Gauge2.png'
	, GaugeImgX       : 54
	, GaugeImgY       : 5
	, GaugeImgWidth   : 60
	, GaugeImgEpID    : 1
	, GaugeImgFpID    : 2
};

// キャッシュ用のデータ
var OT_Image_AddStatusUnitMenuWindow = null;
var OT_Image_AddStatusUnitMenuEP     = null;
var OT_Image_AddStatusUnitMenuFP     = null;
var OT_Image_AddStatusSimpleWindow   = null;
var OT_Image_AddStatusSimpleGauge    = null;

// ゲーム開始時に画像データを保持しておく
var aliasSetup = SetupControl.setup
SetupControl.setup = function()
{
	aliasSetup.call(this);
	if(OT_Image_AddStatusUnitMenuWindow == null) OT_Image_AddStatusUnitMenuWindow = root.getMaterialManager().createImage(OT_EnergyFrameSetting.Material, OT_EnergyFrameSetting.WindowImg);
	if(OT_Image_AddStatusSimpleWindow == null)   OT_Image_AddStatusSimpleWindow   = root.getMaterialManager().createImage(OT_SimpleFrameSetting.Material, OT_SimpleFrameSetting.WindowImg);
	if(OT_Image_AddStatusSimpleGauge == null)    OT_Image_AddStatusSimpleGauge    = root.getMaterialManager().createImage(OT_SimpleFrameSetting.Material, OT_SimpleFrameSetting.GaugeImg);
	if(OT_Image_AddStatusUnitMenuEP == null)     OT_Image_AddStatusUnitMenuEP     = root.getMaterialManager().createImage(OT_EPFrameSetting.Material, OT_EPFrameSetting.GaugeImg);
	if(OT_Image_AddStatusUnitMenuFP == null)     OT_Image_AddStatusUnitMenuFP     = root.getMaterialManager().createImage(OT_FPFrameSetting.Material, OT_FPFrameSetting.GaugeImg);
};

// EP・FP用のウィンドウを作成する
var alias900 = UnitMenuTopWindow.drawWindow;
UnitMenuTopWindow.drawWindow = function(x, y)
{
	var width = OT_EnergyFrameSetting.WindowWidth;
	var height = OT_EnergyFrameSetting.WindowHeight;
	
	WindowRenderer.drawStretchWindow(x, y - height, width, height + 2, OT_Image_AddStatusUnitMenuWindow);

	alias900.call(this, x, y);
};

// ユニットにカーソルを当てた時のミニウィンドウにEPとFPを表示
var alias901 = UnitSimpleRenderer.drawContentEx;
UnitSimpleRenderer.drawContentEx = function(x, y, unit, textui, mhp)
{
	alias901.call(this, x, y, unit, textui, mhp);

	var width = MapParts.UnitInfo._getWindowWidth();
	var height = OT_SimpleFrameSetting.WindowHeight;
	
	var d = root.getGameAreaHeight() / 2;

	x -= DefineControl.getFaceXPadding();
	y -= DefineControl.getFaceYPadding();
	if(d < y)
	{
		y -= height;
	}
	else
	{
		y += MapParts.UnitInfo._getWindowHeight();
	}
	WindowRenderer.drawStretchWindow(x, y, width-150, height, OT_Image_AddStatusSimpleWindow);
	
	x += 15;
	if(typeof UnitParameter.MEP !== 'undefined')
	{
		ContentRenderer.drawUnitEpZoneSimple(x, y, unit, OT_Image_AddStatusSimpleGauge);
		//x += MapParts.UnitInfo._getWindowWidth() / 2;
	}
	//if(typeof UnitParameter.MFP !== 'undefined')
	//{
		//ContentRenderer.drawUnitFpZoneSimple(x, y, unit, OT_Image_AddStatusSimpleGauge);
	//}
};

// EPゲージ描写(シンプル版)
ContentRenderer.drawUnitEpZoneSimple = function(x, y, unit, pic) {
	var ep = OT_GetNowEP(unit);
	var mep = ParamBonus.getEp(unit);

	this.drawEpSimple(x, y, ep, mep);
	x += OT_SimpleFrameSetting.GaugeImgX;
	y += OT_SimpleFrameSetting.GaugeImgY;
	//this.drawGauge(x + 64, y, ep, mep, OT_SimpleFrameSetting.GaugeImgEpID, OT_SimpleFrameSetting.GaugeImgWidth, pic);
};

// EP数値描写(シンプル版)
ContentRenderer.drawEpSimple = function(x, y, ep, maxEp) {
	var textEp = UnitParameter.MEP.getParameterName();
	var dx = [0, 60];
	
	TextRenderer.drawSignText(x + dx[0], y, textEp);
	NumberRenderer.drawNumber(x + dx[1], y, ep);
};

// FPゲージ描写(シンプル版)
ContentRenderer.drawUnitFpZoneSimple = function(x, y, unit, pic) {
	var fp = OT_GetNowFP(unit);
	var mfp = ParamBonus.getFp(unit);
	
	//this.drawFpSimple(x, y, fp, mfp);
	//x += OT_SimpleFrameSetting.GaugeImgX;
	//y += OT_SimpleFrameSetting.GaugeImgY;
	//this.drawGauge(x, y, fp, mfp, OT_SimpleFrameSetting.GaugeImgFpID, OT_SimpleFrameSetting.GaugeImgWidth, pic);
};

// FP数値描写(シンプル版)
ContentRenderer.drawFpSimple = function(x, y, fp, maxFp) {
	var textFp = UnitParameter.MFP.getParameterName();
	var dx = [0, 5];

	TextRenderer.drawSignText(x + dx[0], y+1, textFp);
	NumberRenderer.drawNumber(x + dx[1], y, fp);
};

//メニューにEPを表示
var alias2 = UnitMenuTopWindow.drawWindowContent;
UnitMenuTopWindow.drawWindowContent = function(x, y) {
	alias2.call(this, x, y);
	
	if(typeof UnitParameter.MEP !== 'undefined')
	{
		this._drawUnitEp(x, y);
	}
};

// EP描写
UnitMenuTopWindow._drawUnitEp = function(xBase, yBase) {
	var x = xBase + OT_EPFrameSetting.GaugeImgX;
	var y = yBase + OT_EPFrameSetting.GaugeImgY+8;
	
	ContentRenderer.drawUnitEpZone(x, y, this._unit, OT_Image_AddStatusUnitMenuEP);
};

// ゲージ描写
ContentRenderer.drawUnitEpZone = function(x, y, unit, pic) {
	var ep = OT_GetNowEP(unit);
	var mep = ParamBonus.getEp(unit);
	var rep = OT_GetEPRecoveryAll(unit);
	var x2,y2;
	
	if( !OT_FPFrameSetting.DrawSide )
	{
		x2 = x;
		y2 = y + 20;
	}
	else
	{
		x  = x;
		y  = y;
		x2 = x + 160;
		y2 = y + 6;
	}
	
	this.drawEp(x, y, ep, mep, rep);
	this.drawGauge(x2, y2, ep, mep, OT_EPFrameSetting.GaugeImgID, OT_EPFrameSetting.GaugeImgWidth, pic);
};

// 数値描写
ContentRenderer.drawEp = function(x, y, ep, maxEp, RecoveryEp) {
	var textEp = UnitParameter.MEP.getParameterName();
	var textSlash = '/';
	//var textRecovery = '(' + RecoveryEp + ')';
	var dx = [0, 64, 80, 118, 106];
	var textui = InfoWindow.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();
	
	TextRenderer.drawSignText(x + dx[0], y, textEp);
	NumberRenderer.drawNumber(x + dx[1], y, ep);
	TextRenderer.drawSignText(x + dx[2], y, textSlash);
	NumberRenderer.drawNumber(x + dx[3], y, maxEp);
	//TextRenderer.drawKeywordText(x + dx[4], y+1, textRecovery, -1, OT_EPFrameSetting.FontColor, font);
};

// アイテム名の下に消費EPを表示
var alias3 = ItemListScrollbar.drawScrollContent;
ItemListScrollbar.drawScrollContent = function(x, y, object, isSelect, index)
{
	alias3.call(this, x, y, object, isSelect, index);

	if(typeof UnitParameter.MEP !== 'undefined')
	{
		var color = OT_EPFrameSetting.FontColor;
		var color2 = 0x000000;
		var textui = this.getParentTextUI();
		var font = textui.getFont();
		var iconWidth = GraphicsFormat.ICON_WIDTH + 5;
		var height = 13;
		var numEP = OT_GetStringUseEP(object);
		var text = '';
		if(numEP != 0)
		{
			var regex = /^(\-?)([0-9]+\%?)$/;
			if(numEP.match(regex))
			{
				var mainasu = RegExp.$1;
				var val = RegExp.$2;
				if( mainasu == '-' )
				{
					text = OT_EPFrameSetting.Name + val + OT_EPFrameSetting.RecoveryString;
				}
				else
				{
					text = OT_EPFrameSetting.Name + val + OT_EPFrameSetting.UseString;
				}
			}
			
			x += OT_EPFrameSetting.TextX;
			y += OT_EPFrameSetting.TextY;
			TextRenderer.drawKeywordText(x + iconWidth + 1, y + height +1, text, -1, color2, font);
			TextRenderer.drawKeywordText(x + iconWidth, y + height, text, -1, color, font);
		}
	}
};

//メニューにFPを表示
var alias4 = UnitMenuTopWindow.drawWindowContent;
UnitMenuTopWindow.drawWindowContent = function(x, y) {
	alias4.call(this, x, y);
	
	if(typeof UnitParameter.MFP !== 'undefined')
	{
		//this._drawUnitFp(x, y);
	}
};

// FP描写
UnitMenuTopWindow._drawUnitFp = function(xBase, yBase) {
	var x = xBase + OT_FPFrameSetting.GaugeImgX;
	var y = yBase + OT_FPFrameSetting.GaugeImgY;
	
	ContentRenderer.drawUnitFpZone(x, y, this._unit, OT_Image_AddStatusUnitMenuFP);
};

// ゲージ描写
ContentRenderer.drawUnitFpZone = function(x, y, unit, pic) {
	var fp = OT_GetNowFP(unit);
	var mfp = ParamBonus.getFp(unit);
	var rfp = OT_GetFPRecoveryAll(unit);
	var x2,y2;
	
	if( !OT_FPFrameSetting.DrawSide )
	{
		x2 = x;
		y2 = y + 20;
	}
	else
	{
		x  = x;
		y  = y;
		x2 = x + 160;
		y2 = y + 6;
	}

	this.drawFp(x, y, fp, mfp, rfp);
	this.drawGauge(x2, y2, fp, mfp, OT_FPFrameSetting.GaugeImgID, OT_FPFrameSetting.GaugeImgWidth, pic);
};

// 数値描写
ContentRenderer.drawFp = function(x, y, fp, maxFp, RecoveryFp) {
	var textFp = UnitParameter.MFP.getParameterName();
	var textSlash = '/';
	var textRecovery = '(' + RecoveryFp + ')';
	var dx = [0, 64, 80, 118, 106];
	var textui = InfoWindow.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();

	TextRenderer.drawSignText(x + dx[0], y+1, textFp);
	NumberRenderer.drawNumber(x + dx[1], y, fp);
	TextRenderer.drawSignText(x + dx[2], y, textSlash);
	NumberRenderer.drawNumber(x + dx[3], y, maxFp);
	TextRenderer.drawKeywordText(x + dx[4], y+1, textRecovery, -1, OT_FPFrameSetting.FontColor, font);
};

// アイテム名の下に消費FPを表示
var alias5 = ItemListScrollbar.drawScrollContent;
ItemListScrollbar.drawScrollContent = function(x, y, object, isSelect, index)
{
	alias5.call(this, x, y, object, isSelect, index);
	if(typeof UnitParameter.MFP !== 'undefined')
	{
		var color = OT_FPFrameSetting.FontColor;
		var color2 = 0x000000;
		var textui = this.getParentTextUI();
		var font = textui.getFont();
		var iconWidth = GraphicsFormat.ICON_WIDTH + 5;
		var height = 13;
		var numEP = 0;
		var numFP = OT_GetStringUseFP(object);
		var text = '';
		
		if(typeof OT_GetStringUseEP !== 'undefined') numEP = OT_GetStringUseEP(object);
	
		// EPが存在していたら右側にずらす
		if(numEP != 0)
		{
			iconWidth += 75;
		}
	
		if(numFP != 0)
		{
			var regex = /^(\-?)([0-9]+\%?)$/;
			if(numFP.match(regex))
			{
				var mainasu = RegExp.$1;
				var val = RegExp.$2;
				if( mainasu == '-' )
				{
					// FPチェックのみならばマイナス指定しても表示されない
					if( OT_GetCheckOnlyFP(object) )
					{
						text = ''
					}
					else
					{
						text = OT_FPFrameSetting.Name + val + OT_FPFrameSetting.RecoveryString;
					}
				}
				else
				{
					if( OT_GetCheckOnlyFP(object) )
					{
						text = OT_FPFrameSetting.Name + val + OT_FPFrameSetting.CheckString;
					}
					else
					{
						text = OT_FPFrameSetting.Name + val + OT_FPFrameSetting.UseString;
					}
				}
			}
		
			x += OT_FPFrameSetting.TextX;
			y += OT_FPFrameSetting.TextY;
			TextRenderer.drawKeywordText(x + iconWidth + 1, y + height +1, text, -1, color2, font);
			TextRenderer.drawKeywordText(x + iconWidth, y + height, text, -1, color, font);
		}
	}
};

var ailas6 = UnitStatusScrollbar._isParameterDisplayable;
UnitStatusScrollbar._isParameterDisplayable = function(index)
{
	// ユニットメニューでの表示ではEPを取り除く
	if (ParamGroup.getParameterType(index) === ParamType.MEP) {
		return false;
	}

	// ユニットメニューでの表示ではFPを取り除く
	if (ParamGroup.getParameterType(index) === ParamType.MFP) {
		return false;
	}

	return ailas6.call(this, index);
};

})();
