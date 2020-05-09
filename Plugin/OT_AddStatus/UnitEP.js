

/*-----------------------------------------------------------------------------------------------
  
  ユニットのパラメータにMP(EP)を追加します。
    
  使用方法:
  ユニットやクラスにパラメータを設定してください。
  (パーセント指定可のものは数値以外に'10%'という風に設定する事でパーセント指定する事が可能です
   パーセント指定する場合は必ず''で囲んでください)

  ・キャラ
  {
      OT_EP : { Value:5, Growth:80, Recovery:5 }
  }
  Value     : パラメータ
  Growth    : 成長率
  Recovery  : ターン経過時のチャージ量(パーセント指定可、その場合はRecovery:'10%'という風に'で囲んで指定する)
  (上記は初期値が5、成長値が80%、毎ターン5回復の設定)
  ※各値省略時は0を指定したものと同じになります。

  ・クラス
  {
      OT_EP : { Value:5, Growth:100, Max:100, Recovery:5, MoveCost:2.0, 
                AddState:[ { Range:'0-10', State:[1], Dispel:true } ], 
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
  }
  Value      : パラメータボーナス
  Growth     : 成長値ボーナス
  Max        : クラス上限値
  Recovery   : ターン経過時のチャージ量(パーセント指定可)
  MoveCost   : 一マス移動する毎に消費する量
  AddState   : EPが特定域になった時に付加されるステートを設定
              Range : ステートが付与されるFP量を指定、'0-10%'とパーセント指定可能
              State : ステートのIDを指定、[]内にてカンマ区切りで複数指定可能
                      [(数値)]の代わりに'DEAD'を指定すると即死となります
              Dispel : trueでEP量が特定域から外れた時に自動解除
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるEPを設定(パーセント指定可)
  ※各値省略時はMaxはグローバルパラメータのOT_EP:MAXの値、
    AddStateは未設定、それ以外は0を指定したものと同じになります。
  
  ・武器
  {
      OT_EP : { Use:5, Value:100, Growth:100, Recovery:5,
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Use       : 使用時消費EP(パーセント指定可、マイナス指定で使用時回復)
  Value     : 装備時パラメータボーナス
  Growth    : 装備時成長値ボーナス
  Recovery  : ターン経過時のチャージ量(パーセント指定可)
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるEPを設定(パーセント指定可)
  ※各値省略時は0を指定したものと同じになります。
  
  ・アイテム
  {
      OT_EP : { Use:5, Value:100, Growth:100, Doping:5, Recovery:5,
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Use       : 使用時消費EP(パーセント指定可、マイナス指定で使用時回復)
  Value     : 所持時パラメータボーナス
  Growth    : 所持時成長値ボーナス
  Doping    : ドーピング時の上昇値(ドーピングアイテムのみ)
  Recovery  : ターン経過時のチャージ量(パーセント指定可)
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるEPを設定(パーセント指定可)
  ※各値省略時は0を指定したものと同じになります。
  
  ・ステート
  {
      OT_EP : { Doping:5, Recovery:5,
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Doping   : ステート付与時のパラメータボーナス
  Recovery : ステート付与時の回復量(パーセント指定可)
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるEPを設定(パーセント指定可)
  ※各値省略時は0を指定したものと同じになります。
  
  ・グローバル
  {
      OT_EP: { Max:9999 }
  }
  Max:パラメータ最大値限界
  ※省略時は30となります。

  作成者:
  o-to
  
  更新履歴:
  2016/01/06：新規作成

  2016/01/11：
  所持アイテムが満杯じゃないユニットとのアイテム交換時にエラーとなる不具合修整
  リアルタイム戦闘時、EP・FPが攻撃途中で途切れる戦闘だとモーションが狂う不具合修整

  2016/04/26:
  EP、FPの定数を修正
  
  2016/06/13：
  ツールのユーザー拡張の武器の無限化でEP、FPが消費されなかった不具合を修正

  2016/07/31：
  1.086対応、初期EP、FPが0の状態になっていたため修正
  ユニットやクラス、アイテムの設定にEPの自動回復値を実装
  EP自然回復値にミスがあったので修正

  2016/08/22：
  情報収集で仲間になったユニットのEPとFPが0になっていた不具合を修正。
  クラスの設定にてEP、FPが特定域になった時にステート付与、または死亡できる設定できるように修正

  2016/09/18：
  移動コスト(その地点に移動するために必要な移動力)に応じたEP消費量、FP消費量を設定可能に

  2016/10/03：
  追撃後にEPとFPが使用武器のEP使用量、FP使用量を下回っていたら不具合が起こる件を修正

  2017/02/05:
  forループ用に使用している変数の宣言忘れしている箇所を修正
  ※同じように宣言忘れしている別スクリプトがあった場合、意図せぬ動作が起こるため

  2017/05/17：
  Ver1.127以降にてシンプルウィンドウにEPとFPが表示されなかった問題を修正
  消費EPとFPをマイナス指定している時の表示を修正
  消費EPとFP設定時に攻撃した後のEPが使用EPを下回った際にFPが消費されていなかったため修正

  2018/03/18：
  バトル中での行動（攻撃命中、攻撃ミス、被弾、回避）によってEP・FPが回復する機能追加
  FPの移動コストが正常に動作していない不具合修正

-----------------------------------------------------------------------------------------------*/

(function() {

// EPの宣言
ParamType.MEP = 100;

// EPの設定がされているか
OT_isEPCustom = function(obj, paramName)
{
	if( obj == null )
	{
		return false;
	}
	
	if( obj.custom.OT_EP == null )
	{
		return false;
	}
	
	if( paramName == null ) {
		return true;
	}
	
	if( typeof obj.custom.OT_EP[paramName] == 'undefined' ) {
		return false;
	}
	
	return true;
};

// EP使用値を取得する
OT_GetUseEP = function(unit, value)
{
	var unitMaxEp = OT_GetMaxEP(unit);
	return OT_GetEPValue(value, unitMaxEp);
};

// オブジェのEP使用値を取得する
OT_GetItemUseEP = function(unit, obj)
{
	if(unit == null || obj == null)
	{
		return 0;
	}
	
	if(!OT_isEPCustom(obj))
	{
		return 0;
	}
	
	return OT_GetUseEP(unit, obj.custom.OT_EP.Use);
};

// EPの値を正規化して取得
OT_GetEPValue = function(value, epMax)
{
	if( value == null )
	{
		return 0;
	}
	
	if (typeof value === 'number') {
		return parseInt(value);
	}
	
	var regex = /^([\-]*[0-9]+)\%$/;
	var regexNum = /^([\-]*[0-9]+)$/;
	if(value.match(regex))
	{
		var percent = parseInt(RegExp.$1);
		var num = Math.floor( epMax * (percent / 100) );

		return parseInt(num);
	}
	else if( value.match(regexNum) )
	{
		return parseInt(value);
	}
	
	return 0;
};

// 現在の残EPを取得
OT_GetNowEP = function(unit)
{
	var ep;

	if (typeof unit.custom.tmpNowEp === 'number')
	{
		ep = unit.custom.tmpNowEp;
	}
	else
	{
		ep = 0;
	}
	
	return parseInt(ep);
};

// 現在の残EPを設定
OT_SetNowEP = function(unit, ep)
{
	var max = ParamBonus.getEp(unit);
	unit.custom.tmpNowEp = OT_GetEPValue(ep, max);
	unit.custom.tmpEpChange = true;
	
	if( unit.custom.tmpNowEp > max )
	{
		unit.custom.tmpNowEp = max;
	}
	else if( unit.custom.tmpNowEp < 0 )
	{
		unit.custom.tmpNowEp = 0;
	}
};

// EP回復
OT_RecoveryNowEP = function(unit, value)
{
	var use = 0;
	var max = 0;
	
	if( unit == null || value == null )
	{
		return;
	}
	
	max = ParamBonus.getEp(unit);
	use = OT_GetEPValue( value, max );
	
	if (typeof unit.custom.tmpNowEp === 'number')
	{
		unit.custom.tmpNowEp += use;
	}
	else
	{
		unit.custom.tmpNowEp = 0;
	}

	if( unit.custom.tmpNowEp > max )
	{
		unit.custom.tmpNowEp = max;
	}
	else if( unit.custom.tmpNowEp < 0 )
	{
		unit.custom.tmpNowEp = 0;
	}
};

// EP使用
OT_UseNowEP = function(unit, value)
{
	var use = 0;
	var max = 0;
	
	if( unit == null || value == null )
	{
		return;
	}
	
	max = ParamBonus.getEp(unit);
	use = OT_GetEPValue( value, max );
	
	if (typeof unit.custom.tmpNowEp === 'number')
	{
		unit.custom.tmpNowEp -= use;
	}
	else
	{
		unit.custom.tmpNowEp = 0;
	}

	if( unit.custom.tmpNowEp > max )
	{
		unit.custom.tmpNowEp = max;
	}
	else if( unit.custom.tmpNowEp < 0 )
	{
		unit.custom.tmpNowEp = 0;
	}
};

// 現在のMaxEP(外部参照用)を取得
OT_GetMaxEP = function(unit)
{
	var ep;

	if (typeof unit.custom.tmpMaxEp === 'number')
	{
		ep = unit.custom.tmpMaxEp;
	}
	else
	{
		ep = 0;
	}
	
	return parseInt(ep);
};

// 現在のMaxEP(外部参照用)を設定
OT_SetMaxEP = function(unit, ep)
{
	unit.custom.tmpMaxEp = ep;
};

// 使用EP(文字)を取得
OT_GetStringUseEP = function(obj)
{
	if( obj == null )
	{
		return 0;
	}
	
	if( !OT_isEPCustom(obj) )
	{
		return 0;
	}
	
	if( obj.custom.OT_EP.Use == null )
	{
		return 0;
	}

	var regex = /^(\-?)([0-9]+)(\%?)$/;
	if (typeof obj.custom.OT_EP.Use === 'number')
	{
		ep = obj.custom.OT_EP.Use;
	}
	else if(obj.custom.OT_EP.Use.match(regex))
	{
		ep = obj.custom.OT_EP.Use;
	}
	else
	{
		ep = 0;
	}
	
	return '' + ep;
};

// 戦闘時取得EPを取得
OT_GetBattleBonusEP = function(unit, weapon)
{
	var i, count, item, n, id;
	var d = 0;
	var arr = [];
	var BattleBonusEP = {
		  Hit:0
		, NoHit:0
		, Damage:0
		, Avoid:0
	};

	var unitClass = unit.getClass();
	// 攻撃時に取得するEP
	if( OT_isEPCustom(unitClass, 'BattleBonus') ) {
		BattleBonusEP.Hit    += OT_GetUseEP(unit, unitClass.custom.OT_EP.BattleBonus.Hit);
		BattleBonusEP.NoHit  += OT_GetUseEP(unit, unitClass.custom.OT_EP.BattleBonus.NoHit);
		BattleBonusEP.Damage += OT_GetUseEP(unit, unitClass.custom.OT_EP.BattleBonus.Damage);
		BattleBonusEP.Avoid  += OT_GetUseEP(unit, unitClass.custom.OT_EP.BattleBonus.Avoid);
	}

	if (weapon !== null) {
		if( OT_isEPCustom(weapon, 'BattleBonus') ) {
			BattleBonusEP.Hit    += OT_GetUseEP(unit, weapon.custom.OT_EP.BattleBonus.Hit);
			BattleBonusEP.NoHit  += OT_GetUseEP(unit, weapon.custom.OT_EP.BattleBonus.NoHit);
			BattleBonusEP.Damage += OT_GetUseEP(unit, weapon.custom.OT_EP.BattleBonus.Damage);
			BattleBonusEP.Avoid  += OT_GetUseEP(unit, weapon.custom.OT_EP.BattleBonus.Avoid);
		}
	}
	
	count = UnitItemControl.getPossessionItemCount(unit);
	for (i = 0; i < count; i++) {
		item = UnitItemControl.getItem(unit, i);
		if (item !== null && !item.isWeapon()) {
			id = item.getId();
			if (arr.indexOf(id) !== -1) {
				continue;
			}
			arr.push(id);
			
			// ItemControl.isItemUsableを呼び出すことで、
			// 使用が許可されていないユニットに対しての補正は無効にしている。
			if (ItemControl.isItemUsable(unit, item)) {
				if( OT_isEPCustom(item, 'BattleBonus') ) {
					BattleBonusEP.Hit    += OT_GetUseEP(unit, item.custom.OT_EP.BattleBonus.Hit);
					BattleBonusEP.NoHit  += OT_GetUseEP(unit, item.custom.OT_EP.BattleBonus.NoHit);
					BattleBonusEP.Damage += OT_GetUseEP(unit, item.custom.OT_EP.BattleBonus.Damage);
					BattleBonusEP.Avoid  += OT_GetUseEP(unit, item.custom.OT_EP.BattleBonus.Avoid);
				}
			}
		}
	}

	var i, state;
	var list = unit.getTurnStateList();
	var count = list.getCount();
	
	for (i = 0; i < count; i++) {
		state = list.getData(i).getState();
		
		if( OT_isEPCustom(state, 'BattleBonus') ) {
			BattleBonusEP.Hit    += OT_GetUseEP(unit, state.custom.OT_EP.BattleBonus.Hit);
			BattleBonusEP.NoHit  += OT_GetUseEP(unit, state.custom.OT_EP.BattleBonus.NoHit);
			BattleBonusEP.Damage += OT_GetUseEP(unit, state.custom.OT_EP.BattleBonus.Damage);
			BattleBonusEP.Avoid  += OT_GetUseEP(unit, state.custom.OT_EP.BattleBonus.Avoid);
		}
	}

	return BattleBonusEP;
};

// EPチャージ量(ユニット、クラス、アイテム)を取得
OT_GetEPRecovery = function(unit)
{
	return OT_GetEPRecoveryBonus(unit, unit) + OT_GetEPRecoveryBonus(unit, unit.getClass()) + OT_GetEPRecoveryItemBonus(unit);
	//return this.getClassUnitValue(unit, index) + this.getUnitTotalParamBonus(unit, index) + StateControl.getStateParameter(unit, index);
};

// EPチャージ量(ユニット、クラス、アイテム、ステート)を取得
OT_GetEPRecoveryAll = function(unit)
{
	return OT_GetEPRecovery(unit) + StateControl.getEpValue(unit);
	//return this.getClassUnitValue(unit, index) + this.getUnitTotalParamBonus(unit, index) + StateControl.getStateParameter(unit, index);
};

// オブジェ毎のEPチャージ量を取得
OT_GetEPRecoveryBonus = function(unit, obj)
{
	var Ep;
	var max = ParamBonus.getEp(unit);
	
	if( !OT_isEPCustom(obj) ) return 0;
	
	if (obj.custom.OT_EP.Recovery != null)
	{
		Ep = OT_GetEPValue( obj.custom.OT_EP.Recovery, max );
	}
	else
	{
		Ep = 0;
	}
	
	return Ep;
};

// 所持品のEPチャージ量を取得
OT_GetEPRecoveryItemBonus = function(unit)
{
	var i, count, item, n, id;
	var d = 0;
	var weapon = ItemControl.getEquippedWeapon(unit);
	var arr = [];
	
	if (weapon !== null) {
		d += OT_GetEPRecoveryBonus(unit, weapon);
	}
	
	count = UnitItemControl.getPossessionItemCount(unit);
	for (i = 0; i < count; i++) {
		item = UnitItemControl.getItem(unit, i);
		if (item !== null && !item.isWeapon()) {
			id = item.getId();
			if (arr.indexOf(id) !== -1) {
				continue;
			}
			arr.push(id);
			
			n = OT_GetEPRecoveryBonus(unit, item);
			// ItemControl.isItemUsableを呼び出すことで、
			// 使用が許可されていないユニットに対しての補正は無効にしている。
			if (n !== 0 && ItemControl.isItemUsable(unit, item)) {
				d += n;
			}
		}
	}
	
	return d;
};

// 移動によるEPコストを取得
OT_GetMoveCostEP = function(obj, movePoint)
{
	if( obj == null )
	{
		return 0;
	}
	
	if( !OT_isEPCustom(obj) )
	{
		return 0;
	}

	var cost = 0;
	if( typeof obj.custom.OT_EP.MoveCost === 'number' )
	{
		cost = Math.floor(obj.custom.OT_EP.MoveCost * movePoint);
	}
	
	return cost;
};

UnitParameter.MEP = defineObject(BaseUnitParameter,
{	
	getUnitValue: function(unit) {
		var ep;
		
		if( !OT_isEPCustom(unit) ) return 0;

		if (typeof unit.custom.OT_EP.Value === 'number') {
			ep = unit.custom.OT_EP.Value;
		}
		else {
			ep = 0;
		}
		
		return ep;
	},
	
	setUnitValue: function(unit, value) {
		if( !OT_isEPCustom(unit) )
		{
			unit.custom.OT_EP = {};
		}

		unit.custom.OT_EP.Value = value;
	},

	// 毎ターン毎のEP回復量を取得
	getUnitRecoveryValue: function(unit) {
		var ep;
		
		if( !OT_isEPCustom(unit) ) return 0;

		var value = unit.custom.OT_EP.Recovery;
		if (typeof value === 'number') {
			ep = value;
		} else if(typeof value === 'string') {
			var regex = /^([\-]*[0-9]+)\%$/;
			var regexNum = /^([\-]*[0-9]+)$/;
			
			if(value.match(regex)) {
				ep = value;
			} else if(value.match(regexNum)) {
				ep = parseInt(value);
			} else {
				ep = 0;
			}
		} else {
			ep = 0;
		}
		
		return ep;
	},

	// 毎ターン毎のFP回復量を設定
	setUnitRecoveryValue: function(unit, value) {
		if( !OT_isEPCustom(unit) )
		{
			unit.custom.OT_EP = {};
		}

		unit.custom.OT_EP.Recovery = value;
	},

	// objはユニットやクラス、武器など
	getParameterBonus: function(obj) {
		var ep;
		
		if( obj == null ) return 0;

		if( !OT_isEPCustom(obj) ) return 0;
		
		if (typeof obj.custom.OT_EP.Value === 'number')
		{
			ep = obj.custom.OT_EP.Value;
		}
		else
		{
			ep = 0;
		}
		
		return ep;
	},
	
	// objはユニットやクラス、武器など
	getGrowthBonus: function(obj) {
		var ep;
		
		if( obj == null ) return 0;

		if( !OT_isEPCustom(obj) ) return 0;

		if (typeof obj.custom.OT_EP.Growth === 'number') {
			ep = obj.custom.OT_EP.Growth;
		}
		else {
			ep = 0;
		}
		
		return ep;
	},
	
	// objは、CommandParameterChange、Item、State、TurnStateのいずれかになる
	getDopingParameter: function(obj) {
		var ep;
		
		if( obj == null ) return 0;

		try
		{
			// TurnStateならgetState()が正常に処理される
			var state = obj.getState();
			var turn = state.getTurn() - obj.getTurn();
			if( !OT_isEPCustom(state) ) return 0;
			
			if (typeof state.custom.OT_EP.Doping === 'number') {
				ep = state.custom.OT_EP.Doping;
				
				if( ep > 0 )
				{
					ep = ep - ( state.getTurnChangeValue() * turn );
				}
				else if( ep < 0 )
				{
					ep = ep + ( state.getTurnChangeValue() * turn );
				}
			}
			else {
				ep = 0;
			}
		}
		catch (e)
		{
			// TurnState以外ならgetState()が必ず失敗するため下記の処理をする
			if (typeof obj.custom !== 'object') {
				return 0;
			}
			
			if( !OT_isEPCustom(obj) ) return 0;
	
			if (typeof obj.custom.OT_EP.Doping === 'number') {
				ep = obj.custom.OT_EP.Doping;
			}
			else {
				ep = 0;
			}
		}

		return ep;
	},
	
	getMaxValue: function(unit) {
		var epMax;
		
		if (root.getUserExtension().isClassLimitEnabled())
		{
			if ( OT_isEPCustom(unit.getClass()) && typeof unit.getClass().custom.OT_EP.Max === 'number')
			{
				epMax = unit.getClass().custom.OT_EP.Max;
			}
			else if ( root.getMetaSession().global.OT_EP != null && typeof root.getMetaSession().global.OT_EP.Max === 'number')
			{
				epMax = root.getMetaSession().global.OT_EP.Max;
			}
			else
			{
				epMax = 99;
			}
		}
		else
		{
			if ( root.getMetaSession().global.OT_EP != null && typeof root.getMetaSession().global.OT_EP.Max === 'number')
			{
				epMax = root.getMetaSession().global.OT_EP.Max;
			}
			else
			{
				epMax = 99;
			}
		}
		
		return epMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},

	getParameterType: function() {
		return ParamType.MEP;
	},

	getParameterName: function() {
		return OT_EPFrameSetting.Name;
	}
}
);

// キャラのEP最大値(クラスやアイテムの加算ボーナス込)を取得
ParamBonus.getEp = function(unit)
{
	var n = this.getBonus(unit, ParamType.MEP);
	
	// 外部参照用の値を保持
	OT_SetMaxEP(unit, n);
	return n;
};

// キャラのEP最大値(ユニットとクラスの合計)を取得
ParamBonus.getEpClassUnit = function(unit)
{
	var i, typeTarget, n;
	var index = -1;
	var count = ParamGroup.getParameterCount();
	var type = ParamType.MEP;
	
	for (i = 0; i < count; i++) {
		typeTarget = ParamGroup.getParameterType(i);
		if (type === typeTarget) {
			index = i;
			break;
		}
	}
	
	if (index === -1) {
		return 0;
	}
	
	n = ParamGroup.getClassUnitValue(unit, index);
	if (n < 0) {
		n = 0;
	}
	return n;
};

// 値が範囲内である事を確認
OT_isValueInRange = function(nowValue, maxValue, range)
{
	if( typeof range !== 'string' )
	{
		return false;
	}
	
	var regex = /^([0-9]+)\-([0-9]+)\%$/;
	var regexNum = /^([0-9]+)\-([0-9]+)$/;

	if (range.match(regex))
	{
		var min = parseInt(RegExp.$1);
		var max = parseInt(RegExp.$2);
		var MinPercent = Math.floor( maxValue * (min / 100) );
		var MaxPercent = Math.floor( maxValue * (max / 100) );

		if( MinPercent <= nowValue && nowValue <= MaxPercent )
		{
			return true;
		}
	}
	else if(range.match(regexNum))
	{
		var min = parseInt(RegExp.$1);
		var max = parseInt(RegExp.$2);

		if( min <= nowValue && nowValue <= max )
		{
			return true;
		}
	}
	
	return false;
};

// ユニットメニューでEPが表示されるようにする
var alias1 = ParamGroup._configureUnitParameters;
ParamGroup._configureUnitParameters = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.insertObject(UnitParameter.MEP, 1);
};

// 武器の装備可否を決定するメソッドに、EP消費量を追加する
var alias2 = ItemControl.isWeaponAvailable;
ItemControl.isWeaponAvailable = function(unit, item) {
	var i, count, n, id;
	var d = 0;
	var arr = [];
	var weapon = item;
	var result = alias2.call(this, unit, weapon);
	
	if (!result)
	{
		// 装備できないため続行しない
		return false;
	}
	
	var unitEp = OT_GetNowEP(unit);
	
	// MaxEPは外部参照用のものを取得しないと無限ループで落ちてしまう
	var unitMaxEp = OT_GetMaxEP(unit);

	var weaponEp = 0;
	if ( OT_isEPCustom(weapon) )
	{
		weaponEp = OT_GetEPValue( weapon.custom.OT_EP.Use, unitMaxEp );
	}

	if(weaponEp > 0)
	{
		if(typeof unit.custom.tmpMoveEP === 'number')
		{
			weaponEp += unit.custom.tmpMoveEP;
		}
	}
		
	// 武器を装備できるのは、ユニットのEPが武器の消費EPを上回っていることが条件とする
	return unitEp >= weaponEp;
};

/*
// ユニット登場時にEPをセットする(廃止)
var alias5 = Miscellaneous.setupFirstUnit;
Miscellaneous.setupFirstUnit = function(unit)
{
	alias5.call(this, unit);
	
	unit.custom.tmpNowEp = ParamBonus.getEp(unit);
	unit.custom.tmpUseEP = 0;
};
*/

// アイテム装備時のEPを調整
var alias6 = ItemControl.updatePossessionItem;
ItemControl.updatePossessionItem = function(unit)
{
	alias6.call(this, unit);

	var scene = root.getCurrentScene();
	
	// シーンがFREEでもEVENTでもない場合は、常にEPが最大EPとなる。
	// これを確認しなければ、マップ上でのアイテム交換や、イベントのアイテム増減でEPが変化する。
	if (scene !== SceneType.FREE && scene !== SceneType.EVENT) {
		unit.custom.tmpNowEp = ParamBonus.getEp(unit);
	}
	
	// EPが最大EPを超えないようにする
	OT_SetNowEP(unit, OT_GetNowEP(unit));
};

// ステートによるEP自動回復
var alias7 = RecoveryAllFlowEntry._completeMemberData;
RecoveryAllFlowEntry._completeMemberData = function(turnChange)
{
	var result = alias7.call(this, turnChange);
	var unit, recoveryValue;
	var list = TurnControl.getActorList();
	var count = list.getCount();

	var commandCount = 0;
	var isSkipMode = CurrentMap.isTurnSkipMode();
	var generator = this._dynamicEvent.acquireEventGenerator();

	for (var i = 0 ; i < count; i++) {
		unit = list.getData(i);

		recoveryValue = OT_GetEPRecovery(unit);
		recoveryValue += StateControl.getEpValue(unit);

		OT_RecoveryNowEP(unit, recoveryValue);


		// EPが指定範囲内ならステート付与したい場合
		if( OT_isEPCustom(unit.getClass()) )
		{
			var add = unit.getClass().custom.OT_EP.AddState;
			var nowEP = OT_GetNowEP(unit);
			var unitMaxEp = ParamBonus.getEp(unit);

			if(typeof add === 'object')
			{
				var list2 = root.getBaseData().getStateList();
				var length = add.length;
				for(var j = 0; j < length; j++)
				{
					var obj = add[j];
					var length2 = obj['State'].length;

					if(OT_isValueInRange(nowEP, unitMaxEp, obj['Range']))
					{
						if(obj['State'] == 'DEAD')
						{
							generator.damageHit(unit, this._getTurnDamageAnime(), 9999, DamageType.FIXED, {}, isSkipMode);
							commandCount++;
							break;
						}

						for(var h=0 ; h<length2 ; h++)
						{
							var state = list2.getDataFromId(obj['State'][h]);
							StateControl.arrangeState(unit, state, IncreaseType.INCREASE);
						}
					}
					else if(obj.Dispel == true)
					{
						for(var h=0 ; h<length2 ; h++)
						{
							var state = list2.getDataFromId(obj['State'][h]);
							StateControl.arrangeState(unit, state, IncreaseType.DECREASE);
						}
					}
				}
			}
		}
	}

	if (commandCount !== 0) {
		return this._dynamicEvent.executeDynamicEvent();
	}

	AW_BuidingEffect();
	return result;
};

// EP自然回復値を取得
StateControl.getEpValue = function(unit) {
	var i, state;
	var list = unit.getTurnStateList();
	var count = list.getCount();
	var recoveryValue = 0;
	
	for (i = 0; i < count; i++) {
		state = list.getData(i).getState();
		
		if ( OT_isEPCustom(state) )
		{
			recoveryValue += OT_GetEPValue(state.custom.OT_EP.Recovery, ParamBonus.getEp(unit));
		}
	}
	
	return recoveryValue;
};

// アイテム紛失時にEP最大値の調整を行う
var alias8 = ItemControl.deleteItem;
ItemControl.deleteItem = function(unit, item)
{
	var result = alias8.call(this, unit, item);
	
	ItemControl.updatePossessionItem(unit);
	
	return result;
};

// アイテムの使用可否を決定するメソッドに、EP消費量を追加する
var alias9 = ItemControl.isItemUsable;
ItemControl.isItemUsable = function(unit, item) {
	var result = alias9.call(this, unit, item);
	
	if (!result)
	{
		// 使用できないため続行しない
		return false;
	}
	
	var unitEp = OT_GetNowEP(unit);
	
	// MaxEPは外部参照用のものを取得しないと無限ループで落ちてしまう
	var unitMaxEp = OT_GetMaxEP(unit);
	var itemEp = 0;
	
	if ( OT_isEPCustom(item) )
	{
		itemEp = OT_GetEPValue( item.custom.OT_EP.Use, unitMaxEp );
	}

	if(itemEp > 0)
	{
		if(typeof unit.custom.tmpMoveEP === 'number')
		{
			itemEp += unit.custom.tmpMoveEP;
		}
	}

	// ユニットのEPがアイテムの消費EPを上回っていることが条件とする
	return unitEp >= itemEp;
};

// アイテム使用時にEPを消費
var alias10 = ItemUseParent.decreaseItem;
ItemUseParent.decreaseItem = function() {
	alias10.call(this);
	
	var unit = this._itemTargetInfo.unit;
	var item = this._itemTargetInfo.item;
	var unitEp = OT_GetNowEP(unit);
	var unitMaxEp = ParamBonus.getEp(unit);
	var weaponEp = 0;

	if( OT_isEPCustom(item) )
	{
		itemEp = OT_GetEPValue( item.custom.OT_EP.Use, unitMaxEp );
		OT_UseNowEP(unit, itemEp);
	}
};

// 拠点の設定で回復許可がある時は出撃選択時に味方のEPを全快にしておく
var alias11 = UnitProvider.recoveryPrepareUnit;
UnitProvider.recoveryPrepareUnit = function(unit)
{
	alias11.call(this, unit);
	OT_SetNowEP(unit, ParamBonus.getEp(unit));
};

// テストメンバーユニットや増援ユニットのEPを全快にする
var alias12 = ScriptCall_AppearEventUnit;
ScriptCall_AppearEventUnit = function(unit)
{
	alias12.call(this, unit);
	OT_SetNowEP(unit, ParamBonus.getEp(unit));
};

// マップに最初から配置されてるキャラのEPを全快にする
var alias13 = OpeningEventFlowEntry._checkUnitParameter;
OpeningEventFlowEntry._checkUnitParameter = function() {
	alias13.call(this);
	
	var i, j, list, unit, listCount, count;
	var listArray = FilterControl.getAliveListArray(UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY);
	
	listCount = listArray.length;
	for (i = 0; i < listCount; i++) {
		list = listArray[i];
		count = list.getCount();
		for (j = 0; j < count; j++) {
			unit = list.getData(j);
			OT_SetNowEP(unit, ParamBonus.getEp(unit));
		}
	}
	
	list = root.getCurrentSession().getGuestList();
	count = list.getCount();
	for (j = 0; j < count; j++) {
		unit = list.getData(j);
		OT_SetNowEP(unit, ParamBonus.getEp(unit));
	}
};

// 情報収集で仲間になるキャラは一度もEPの調整がされていないため
// 出撃キャラ選択、ユニット情報選択時に補正する
var alias14 = UnitSortieScreen.setScreenData;
UnitSortieScreen.setScreenData = function(screenParam) {
	alias14.call(this, screenParam);
	
	var i, unit;
	var list = PlayerList.getMainList();
	var count = list.getCount();
	
	for (i = 0; i < count; i++) {
		unit = list.getData(i);
		
		if( unit.custom.tmpEpChange != true)
		{
			//root.log(unit.getName());
			OT_SetNowEP(unit, ParamBonus.getEp(unit));
		}
	}
};

var alias15 = MarshalScreen.setScreenData;
MarshalScreen.setScreenData = function(screenParam) {
	alias15.call(this, screenParam);
	
	var i, unit;
	var list = PlayerList.getMainList();
	var count = list.getCount();
	
	for (i = 0; i < count; i++) {
		unit = list.getData(i);
		
		if( unit.custom.tmpEpChange != true)
		{
			//root.log(unit.getName());
			OT_SetNowEP(unit, ParamBonus.getEp(unit));
		}
	}
};

// 戦闘時に攻撃を行う際にEPが足りるかを判定する
var alias200 = VirtualAttackControl.isAttackContinue;
VirtualAttackControl.isAttackContinue = function(virtualAttackUnit)
{
	var i, count;
	var weapon = virtualAttackUnit.weapon;
	var result = alias200.call(this, virtualAttackUnit);

	// 攻撃不可のため続行しない
	if( result == false )
	{
		return false;
	}

	var unit = virtualAttackUnit.unitSelf;
	var unitEp = OT_GetNowEP(unit);
	var unitMaxEp = ParamBonus.getEp(unit);
	var weaponEp = 0;

	if( OT_isEPCustom(weapon) )
	{
		weaponEp = OT_GetEPValue( weapon.custom.OT_EP.Use, unitMaxEp );
		
		// 消費EPが足りない時は攻撃不可
		if(unitEp < weaponEp + unit.custom.tmpUseEP)
		{
			return false;
		}
	}

	return true;
};

// 戦闘時に攻撃を行う度に消費EPを加算
var alias201 = NormalAttackOrderBuilder._createAndRegisterAttackEntry;
NormalAttackOrderBuilder._createAndRegisterAttackEntry = function(virtualActive, virtualPassive) {
	var attackEntry = alias201.call(this, virtualActive, virtualPassive);
	
	var weapon = virtualActive.weapon;
	if (weapon !== null) {
		var unit = virtualActive.unitSelf;
		var targetUnit = virtualPassive.unitSelf;
		var unitMaxEp = ParamBonus.getEp(unit);
		var weaponEp = 0;
	
		if( OT_isEPCustom(weapon) )
		{
			weaponEp = OT_GetEPValue( weapon.custom.OT_EP.Use, unitMaxEp );
			unit.custom.tmpUseEP += weaponEp;
		}

		// 攻撃時に取得するEP
		var bonus = OT_GetBattleBonusEP(unit, weapon);
		if( attackEntry.isHit ) {
			unit.custom.tmpUseEP -= bonus.Hit;
		} else {
			unit.custom.tmpUseEP -= bonus.NoHit;
		}

		// 防御時に取得するEP
		var bonus = OT_GetBattleBonusEP(targetUnit, weapon);
		if( attackEntry.isHit ) {
			targetUnit.custom.tmpUseEP -= bonus.Damage;
		} else {
			targetUnit.custom.tmpUseEP -= bonus.Avoid;
		}
	}

	return attackEntry;
};

// 戦闘完了後にFPを減らす
var alias202 = PreAttack._doEndAction;
PreAttack._doEndAction = function()
{
	alias202.call(this);
	
	var active  = this.getActiveUnit();
	var passive = this.getPassiveUnit();
	
	OT_UseNowEP(active, active.custom.tmpUseEP );
	OT_UseNowEP(passive, passive.custom.tmpUseEP);
	//root.log('_endVirtualAttack'+active.getName()+active.custom.tmpUseFP);
	//root.log('_endVirtualAttack'+passive.getName()+passive.custom.tmpUseFP);

	active.custom.tmpUseEP  = 0;
	passive.custom.tmpUseEP = 0;
};

// VirtualAttack作成時に使用EPを追加する
var alias203 = VirtualAttackControl.createVirtualAttackUnit;
VirtualAttackControl.createVirtualAttackUnit = function(unitSelf, targetUnit, isSrc, attackInfo)
{
	var virtualAttack = alias203.call(this, unitSelf, targetUnit, isSrc, attackInfo);
	
	unitSelf.custom.tmpUseEP = 0;
	
	return virtualAttack;
};

// 移動時EP消費(仮)
// 各キャラ移動時の処理
// この時に移動コストを取得する
var alias300 = SimulateMove.startMove;
SimulateMove.startMove = function(unit, moveCource)
{
	alias300.call(this, unit, moveCource);

	var objClass = unit.getClass();
	if( OT_isEPCustom(objClass) )
	{
		if( typeof objClass.custom.OT_EP.MoveCost === 'number' )
		{
			// 消費移動力を保存
			this._saveMostResentMov(unit, moveCource);
			var cost = objClass.custom.OT_EP.MoveCost;
			unit.custom.tmpMoveEP = Math.floor(unit.getMostResentMov() * cost);
			//root.log(unit.custom.tmpMoveEP);
		}
	}
};

// プレイヤー行動時
var alias301 = MapSequenceCommand._doLastAction;
MapSequenceCommand._doLastAction = function()
{
	var result = alias301.call(this);
	var p = 0;

	if(typeof this._targetUnit.custom.tmpMoveEP === 'number')
	{
		p = this._targetUnit.custom.tmpMoveEP;
	}
	
	if (result === 0 || result === 1) {
		//root.log(this._targetUnit.getName());
		//root.log(p);
		OT_UseNowEP(this._targetUnit, p);
	}
	
	delete this._targetUnit.custom.tmpMoveEP;
	return result;
};

// 再移動用
var alias302 = RepeatMoveFlowEntry.moveFlowEntry;
RepeatMoveFlowEntry.moveFlowEntry = function()
{
	var result = alias302.call(this);
	if (result === MoveResult.END) {
		this._mapSequenceArea.UseEP();
	}
	
	return result;
};

MapSequenceArea.UseEP = function()
{
	var p = 0;

	if(typeof this._targetUnit.custom.tmpMoveEP === 'number')
	{
		p = this._targetUnit.custom.tmpMoveEP;
	}

	//root.log(this._targetUnit.getName());
	//root.log(p);
	OT_UseNowEP(this._targetUnit, p);
	delete this._targetUnit.custom.tmpMoveEP;
};

// 敵移動時スキップ専用
var alias303 = SimulateMove.skipMove;
SimulateMove.skipMove = function(unit, moveCource)
{
	var objClass = unit.getClass();
	if( OT_isEPCustom(objClass) )
	{
		if( typeof objClass.custom.OT_EP.MoveCost === 'number' )
		{
			// 消費移動力を保存
			this._saveMostResentMov(unit, moveCource);
			var cost = objClass.custom.OT_EP.MoveCost;
			unit.custom.tmpMoveEP = Math.floor(unit.getMostResentMov() * cost);
			//root.log(unit.custom.tmpEP);
		}
	}

	alias303.call(this, unit, moveCource);
};

// 敵移動専用
var alias304 = MoveAutoAction.enterAutoAction;
MoveAutoAction.enterAutoAction = function()
{
	var result = alias304.call(this);
	
	var p = 0;
	if(typeof this._unit.custom.tmpMoveEP === 'number')
	{
		p = this._unit.custom.tmpMoveEP;
	}

	OT_UseNowEP(this._unit, p);
	delete this._unit.custom.tmpMoveEP;

	return result;
};

// 敵AIの行動決定時の制御
// 公式のソースでは第一チェック時に攻撃に使用する武器と相手、第二チェック時に移動地点を決定するが
// 第一チェックでは消費EPがEP残量を超えない地点が無い場合はその武器での行動はしないように制御、
// 第二チェックでは消費EPがEP残量を超える地点に移動しないように制御する
var alias305 = CombinationSelector._getTotalScore;
CombinationSelector._getTotalScore = function(unit, combination)
{
	var totalScore = alias305.call(this, unit, combination);

	// 移動EPコスト+攻撃時のEPコストがEP残量を上回る場合はその行動はしないようにする
	if( OT_isEPCustom(combination.item) )
	{
		var unitEp = OT_GetNowEP(unit);
		var unitMaxEp = OT_GetMaxEP(unit);

		// 第一チェックではposIndexが0である
		if( combination.posIndex == 0 )
		{
			// 第一チェック時はどの地点で行動してもEP残量がマイナスになる行動を除外する
			count = combination.costArray.length;
			for (var i = 0; i < count; i++) {
				var costData = combination.costArray[i];
				var useEP = OT_GetEPValue( combination.item.custom.OT_EP.Use, unitMaxEp ) + OT_GetMoveCostEP(unit.getClass(), costData.movePoint);
				
				if(unitEp - useEP >= 0)
				{
					return totalScore;
				}
			}
			return -1;
		}
		else
		{
			// 第二チェック時はEP残量がマイナスになる地点に移動するものを除外する
			var useEP = OT_GetEPValue( combination.item.custom.OT_EP.Use, unitMaxEp ) + OT_GetMoveCostEP(unit.getClass(), combination.movePoint);

			if(unitEp - useEP < 0)
			{
				return -1;
			}
		}
	}
	
	return totalScore;
};

})();
