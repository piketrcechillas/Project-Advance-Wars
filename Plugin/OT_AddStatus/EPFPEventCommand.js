
/*--------------------------------------------------------------------------
  
  EP、FPの最大値、現在値の変更、毎ターンのEP・FP回復量の変更、
  EP、FPの最大値、現在値を取得するイベントを追加します。
    
  使用方法:
  ■EP最大値変更
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandChengeMaxEP(0);
    
    のように記述します。
    「オリジナルデータ」タブの「ユニット」でユニットを指定し、
    「数値1」に加減算に使う値を設定します。
    コード内の引数に渡す値による挙動は下記の通りです。
    
    0:加算
    1:減算
    2:乗算
    3:除算
    4:剰余
    5:代入
    
    拠点、戦闘準備で使用した場合は現EPは最大値になるように修正されます。

  ■FP最大値変更
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandChengeMaxFP(0);
    
    のように記述します。
    
    それ以外の設定についてはEP最大値変更と同じです。
    EPと違い拠点、戦闘準備で使用しても現FPが最大値を上回らない限り、変動しません。

  ■EP現在値変更
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandChengeEP(0);
    
    のように記述します。
    
    それ以外の設定についてはEP最大値変更と同じです。

  ■FP現在値変更
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandChengeFP(0);
    
    のように記述します。
    
    それ以外の設定についてはEP最大値変更と同じです。

  ■ターン毎のEP回復量変更
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandChengeRecoveryEP(0);
    
    のように記述します。
    
    それ以外の設定についてはEP最大値変更と同じです。
    ※ユニットに設定されている回復量がパーセント指定の場合、
      パーセント量の変動となります。（Recovery:'10%'だと加算値を5に指定した場合、Recovery:'15%'に変更される）

  ■ターン毎のFP回復量変更
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandChengeRecoveryFP(0);
    
    のように記述します。
    
    それ以外の設定についてはターン毎のEP回復量変更と同じです。

  ■EP現在値取得
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandGetEP();
    
    のように記述します。
    
    「オリジナルデータ」タブの「ユニット」でユニットを指定し、
    「スクリプト」タブの「戻り値を変数で受け取る」をチェックして格納先の変数を指定してください。

  ■FP現在値取得
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandGetFP();
    
    のように記述します。
    
    「オリジナルデータ」タブの「ユニット」でユニットを指定し、
    「スクリプト」タブの「戻り値を変数で受け取る」をチェックして格納先の変数を指定してください。

  ■EP最大値取得
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandGetMaxEP(0);
    
    のように記述します。
    
    「オリジナルデータ」タブの「ユニット」でユニットを指定し、
    「スクリプト」タブの「戻り値を変数で受け取る」をチェックして格納先の変数を指定してください。
    
    コード内の引数に渡す値による挙動は下記の通りです。
    0:ユニットに設定されてる最大値を取得（アイテムやクラス補正前の値）
    1:アイテムやクラスによる補正込みでの最大値を取得

  ■FP最大値取得
    イベントコマンドの「スクリプトの実行」で「コード実行」にチェックし、コードに
    
    OT_CommandGetMaxFP(0);
    
    のように記述します。
    
    「オリジナルデータ」タブの「ユニット」でユニットを指定し、
    「スクリプト」タブの「戻り値を変数で受け取る」をチェックして格納先の変数を指定してください。
    
    コード内の引数に渡す値による挙動は下記の通りです。
    0:ユニットに設定されてる最大値を取得（アイテムやクラス補正前の値）
    1:アイテムやクラスによる補正込みでの最大値を取得
    
  作成者:
  o-to

  2019/06/16：
  新規作成
  イベントコマンドの「スクリプトの実行」にて
  EP、FPの最大値、現在値の変更、毎ターンのEP・FP回復量の変更、
  EP、FPの最大値、現在値を取得する方法を追加
  
--------------------------------------------------------------------------*/

EPFP_DefineValue = {
	  ADD   : 0
	, SUB   : 1
	, MUL   : 2
	, DIV   : 3
	, MOD   : 4
	, EXC   : 5
};

// EPの最大値を変更する
function OT_CommandChengeMaxEP(type) {
	var i, item, count;
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	var weapon = content.getItem();
	var value = content.getValue(0);
	
	if (unit === null) {
		return;
	}
	
	var nowValue = UnitParameter.MEP.getUnitValue(unit);
	switch(type) {
		case EPFP_DefineValue.ADD:
			nowValue += value;
			break;
			
		case EPFP_DefineValue.SUB:
			nowValue -= value;
			break;
			
		case EPFP_DefineValue.MUL:
			nowValue *= value;
			break;
			
		case EPFP_DefineValue.DIV:
			nowValue /= value;
			break;
			
		case EPFP_DefineValue.MOD:
			nowValue %= value;
			break;
			
		case EPFP_DefineValue.EXC:
			nowValue = value;
			break;
	}
	nowValue = Math.floor(nowValue);
	var scene = root.getBaseScene();
	UnitParameter.MEP.setUnitValue(unit, nowValue);
	
	// 戦闘準備画面、ステージ開始前のイベントならば全回復しておく
	var setEP = OT_GetNowEP(unit);
	if (Miscellaneous.isPrepareScene() && DataConfig.isBattleSetupRecoverable()) {
		setEP = ParamBonus.getEp(unit);
	}

	// 最大EPに合わせて現EPを再設定
	OT_SetNowEP(unit, setEP);
}

// FPの最大値を変更する
function OT_CommandChengeMaxFP(type) {
	var i, item, count;
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	var weapon = content.getItem();
	var value = content.getValue(0);
	
	if (unit === null) {
		return;
	}
	
	var nowValue = UnitParameter.MFP.getUnitValue(unit);
	switch(type) {
		case EPFP_DefineValue.ADD:
			nowValue += value;
			break;
			
		case EPFP_DefineValue.SUB:
			nowValue -= value;
			break;
			
		case EPFP_DefineValue.MUL:
			nowValue *= value;
			break;
			
		case EPFP_DefineValue.DIV:
			nowValue /= value;
			break;
			
		case EPFP_DefineValue.MOD:
			nowValue %= value;
			break;
			
		case EPFP_DefineValue.EXC:
			nowValue = value;
			break;
	}
	nowValue = Math.floor(nowValue);
	UnitParameter.MFP.setUnitValue(unit, nowValue);
	
	// 最大FPに合わせて現FPを再設定
	OT_SetNowFP(unit, OT_GetNowFP(unit));
}

// EPの現在値を変更する
function OT_CommandChengeEP(type) {
	var i, item, count;
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	var weapon = content.getItem();
	var value = content.getValue(0);
	
	if (unit === null) {
		return;
	}
	
	var nowValue = OT_GetNowEP(unit);
	switch(type) {
		case EPFP_DefineValue.ADD:
			nowValue += value;
			break;
			
		case EPFP_DefineValue.SUB:
			nowValue -= value;
			break;
			
		case EPFP_DefineValue.MUL:
			nowValue *= value;
			break;
			
		case EPFP_DefineValue.DIV:
			nowValue /= value;
			break;
			
		case EPFP_DefineValue.MOD:
			nowValue %= value;
			break;
			
		case EPFP_DefineValue.EXC:
			nowValue = value;
			break;
	}
	nowValue = Math.floor(nowValue);
	OT_SetNowEP(unit, nowValue);
}

// FPの現在値を変更する
function OT_CommandChengeFP(type) {
	var i, item, count;
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	var weapon = content.getItem();
	var value = content.getValue(0);
	
	if (unit === null) {
		return;
	}
	
	var nowValue = OT_GetNowFP(unit);
	switch(type) {
		case EPFP_DefineValue.ADD:
			nowValue += value;
			break;
			
		case EPFP_DefineValue.SUB:
			nowValue -= value;
			break;
			
		case EPFP_DefineValue.MUL:
			nowValue *= value;
			break;
			
		case EPFP_DefineValue.DIV:
			nowValue /= value;
			break;
			
		case EPFP_DefineValue.MOD:
			nowValue %= value;
			break;
			
		case EPFP_DefineValue.EXC:
			nowValue = value;
			break;
	}
	nowValue = Math.floor(nowValue);
	OT_SetNowFP(unit, nowValue);
}

// EPの回復量を変更する
function OT_CommandChengeRecoveryEP(type) {
	var i, item, count;
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	var weapon = content.getItem();
	var value = content.getValue(0);
	
	if (unit === null) {
		return;
	}
	
	var nowRecovery = UnitParameter.MEP.getUnitRecoveryValue(unit);
	if (typeof nowRecovery === 'number') {
		switch(type) {
			case EPFP_DefineValue.ADD:
				nowRecovery += value;
				break;
				
			case EPFP_DefineValue.SUB:
				nowRecovery -= value;
				break;
				
			case EPFP_DefineValue.MUL:
				nowRecovery *= value;
				break;
				
			case EPFP_DefineValue.DIV:
				nowRecovery /= value;
				break;
				
			case EPFP_DefineValue.MOD:
				nowRecovery %= value;
				break;
				
			case EPFP_DefineValue.EXC:
				nowRecovery = value;
				break;
		}
		nowRecovery = Math.floor(nowRecovery);
	} else if(typeof nowRecovery == 'string') {
		var regex = /^([\-]*[0-9]+)\%$/;
		var percent = 0;
		if(nowRecovery.match(regex)) {
			percent = parseInt(RegExp.$1);
		} else {
			return;
		}
		
		switch(type) {
			case EPFP_DefineValue.ADD:
				percent += value;
				break;
				
			case EPFP_DefineValue.SUB:
				percent -= value;
				break;
				
			case EPFP_DefineValue.MUL:
				percent *= value;
				break;
				
			case EPFP_DefineValue.DIV:
				percent /= value;
				break;
				
			case EPFP_DefineValue.MOD:
				percent %= value;
				break;
				
			case EPFP_DefineValue.EXC:
				percent = value;
				break;
		}
		percent = Math.floor(percent);
		nowRecovery = percent + '%';
	}
	
	UnitParameter.MEP.setUnitRecoveryValue(unit, nowRecovery);
}

// FPの回復量を変更する
function OT_CommandChengeRecoveryFP(type) {
	var i, item, count;
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	var weapon = content.getItem();
	var value = content.getValue(0);
	
	if (unit === null) {
		return;
	}
	
	var nowRecovery = UnitParameter.MFP.getUnitRecoveryValue(unit);
	if (typeof nowRecovery === 'number') {
		switch(type) {
			case EPFP_DefineValue.ADD:
				nowRecovery += value;
				break;
				
			case EPFP_DefineValue.SUB:
				nowRecovery -= value;
				break;
				
			case EPFP_DefineValue.MUL:
				nowRecovery *= value;
				break;
				
			case EPFP_DefineValue.DIV:
				nowRecovery /= value;
				break;
				
			case EPFP_DefineValue.MOD:
				nowRecovery %= value;
				break;
				
			case EPFP_DefineValue.EXC:
				nowRecovery = value;
				break;
		}
		nowRecovery = Math.floor(nowRecovery);
	} else if(typeof nowRecovery == 'string') {
		var regex = /^([\-]*[0-9]+)\%$/;
		var percent = 0;
		if(nowRecovery.match(regex)) {
			percent = parseInt(RegExp.$1);
		} else {
			return;
		}
		
		switch(type) {
			case EPFP_DefineValue.ADD:
				percent += value;
				break;
				
			case EPFP_DefineValue.SUB:
				percent -= value;
				break;
				
			case EPFP_DefineValue.MUL:
				percent *= value;
				break;
				
			case EPFP_DefineValue.DIV:
				percent /= value;
				break;
				
			case EPFP_DefineValue.MOD:
				percent %= value;
				break;
				
			case EPFP_DefineValue.EXC:
				percent = value;
				break;
		}
		percent = Math.floor(percent);
		nowRecovery = percent + '%';
	}
	UnitParameter.MFP.setUnitRecoveryValue(unit, nowRecovery);
}


// EPの現在値を取得する
function OT_CommandGetEP() {
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	
	if (unit === null) {
		return;
	}
	return OT_GetNowEP(unit);
}

// FPの現在値を取得する
function OT_CommandGetFP() {
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	
	if (unit === null) {
		return;
	}
	return OT_GetNowFP(unit);
}

// EPの最大値を取得する
function OT_CommandGetMaxEP(type) {
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	
	if (unit === null) {
		return;
	}

	var nowValue = 0;
	switch(type) {
		case 1:
			nowValue = ParamBonus.getEp(unit);
			break;
			
		default:
			nowValue = UnitParameter.MEP.getUnitValue(unit);
			break;
	}
	
	return nowValue;
}

// FPの最大値を取得する
function OT_CommandGetMaxFP(type) {
	var content = root.getEventCommandObject().getOriginalContent();
	var unit = content.getUnit();
	
	if (unit === null) {
		return;
	}
	
	var nowValue = 0;
	switch(type) {
		case 1:
			nowValue = ParamBonus.getFp(unit);
			break;
			
		default:
			nowValue = UnitParameter.MFP.getUnitValue(unit);
			break;
	}
	
	return nowValue;
}
