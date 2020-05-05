
/*--------------------------------------------------------------------------
  
  ユニットのパラメータに必殺ゲージ(FP)を追加します。

  使用方法:
  ユニットやクラスにパラメータを設定してください。
  (パーセント指定可のものは数値以外に'10%'という風に
   設定する事でパーセント指定する事が可能です)

  ・キャラ
  {
      OT_FP : { Value:5, Growth:100, Recovery:5 }
  }
  Value     : パラメータ
  Growth    : 成長率
  Recovery  : ターン経過時のチャージ量(パーセント指定可、その場合はRecovery:'10%'という風に'で囲んで指定する)
  ※各値省略時は0を指定したものと同じになります。
  
  ・クラス
  {
      OT_FP : { Value:5, Growth:100, Max:100, Recovery:5, Default:10, MoveCost:2.0, 
                AddState:[ { Range:'0-10', State:[1], Dispel:true } ],
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Value     : パラメータボーナス
  Growth    : 成長値ボーナス
  Max       : クラス上限値
  Recovery  : ターン経過時のチャージ量(パーセント指定可)
  Default   : マップ開始時初期値(パーセント指定可)
  MoveCost  : 一マス移動する毎に消費する量
  AddState  : FPが特定域になった時に付加されるステートを設定
              Range : ステートが付与されるFP量を指定、'0-10%'とパーセント指定可能
              State : ステートのIDを指定、[]内にてカンマ区切りで複数指定可能
                      [(数値)]の代わりに'DEAD'を指定すると即死となります
              Dispel : trueでFP量が特定域から外れた時に自動解除
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるFPを設定(パーセント指定可)
  ※各値省略時はMaxはグローバルパラメータのOT_FP:MAXの値、
    AddStateは未設定、それ以外は0を指定したものと同じになります。
  
  ・武器
  {
      OT_FP : { Use:5, CheckOnly:true, Value:100, Growth:100, Recovery:5,
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Use       : 使用時消費FP(パーセント指定可、CheckOnlyがfalse時にマイナス指定で使用時回復)
  CheckOnly : trueなら使用には消費FP分のFPが必要となりますが使用時のFP消費はありません
  Value     : 装備時パラメータボーナス
  Growth    : 装備時成長値ボーナス
  Recovery  : ターン経過時のチャージ量(パーセント指定可)
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるFPを設定(パーセント指定可)
  ※各値省略時は0を指定したものと同じになります。
    CheckOnlyはfalseを指定したものと同じになります。
  
  ・アイテム
  {
      OT_FP : { Use:5, CheckOnly:true, Value:100, Growth:100, Recovery:5, Doping:5,
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Use       : 使用時消費FP(パーセント指定可、CheckOnlyがfalse時にマイナス指定で使用時回復)
  CheckOnly : trueなら使用には消費FP分のFPが必要となりますが使用時のFP消費はありません
  Value     : 所持時パラメータボーナス
  Growth    : 所持時成長値ボーナス
  Recovery  : ターン経過時のチャージ量(パーセント指定可)
  Doping    : ドーピング時の上昇値(ドーピングアイテムのみ)
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるFPを設定(パーセント指定可)
  ※各値省略時は0を指定したものと同じになります。
    CheckOnlyはfalseを指定したものと同じになります。

  ・ステート
  {
      OT_FP : { Doping:5, Recovery:5,
                BattleBonus:{ Hit:5, NoHit:1, Damage:4 , Avoid:5} }
      }
  }
  Doping   : ステート付与時のパラメータボーナス
  Recovery : ステート付与時の回復量(パーセント指定可)
  BattleBonus: 攻撃命中(Hit)、攻撃ミス(NoHit)、被弾(Damage)、回避(Avoid)時に得られるFPを設定(パーセント指定可)
  ※各値省略時は0を指定したものと同じになります。

  ・グローバルパラメータ
  {
      OT_FP:{ Max:200 }
  }
  Max:パラメータ最大値限界
  ※省略時は100となります。
  
  作成者:
  o-to
  
  更新履歴:
  2016/01/06：新規作成

  2016/01/11：
  所持アイテムが満杯じゃないユニットとのアイテム交換時にエラーとなる不具合修正
  リアルタイム戦闘時、EP・FPが攻撃途中で途切れる戦闘だとモーションが狂う不具合修正

  2016/04/26:
  EP、FPの定数を修正
  
  2016/06/13：
  ツールのユーザー拡張の武器の無限化でEP、FPが消費されなかった不具合を修正
  
  2016/07/31：
  1.086対応、初期EP、FPが0の状態になっていたため修正
  ユニットやクラス、アイテムの設定にEPの自動回復値を実装

  2016/08/22：
  情報収集で仲間になったユニットのEPとFPが0になっていた不具合を修正。
  クラスの設定にてEP、FPが特定域になった時にステート付与、または死亡できる設定できるように修正

  2016/09/18：
  移動コスト(その地点に移動するために必要な移動力)に応じたEP消費量、FP消費量を設定可能に

  2016/10/03：
  追撃後にEPとFPが使用武器のEP使用量、FP使用量を下回っていたら不具合が起こる件を修正

  2016/10/17:
  アイテム使用可否に変数ミスでエラーとなっていた箇所を修正

  2017/02/05:
  forループ用に使用している変数の宣言忘れしている箇所を修正
  ※同じように宣言忘れしている別スクリプトがあった場合、意図せぬ動作が起こるため

  2017/05/17：
  Ver1.127以降にてシンプルウィンドウにEPとFPが表示されなかった問題を修正
  消費EPとFPをマイナス指定している時の表示を修正
  攻撃時にEPが使用EPを下回った際にFPが消費されていなかったため修正

  2018/03/18：
  バトル中での行動（攻撃命中、攻撃ミス、被弾、回避）によってEP・FPが回復する機能追加
  FPの移動コストが正常に動作していない不具合修正

--------------------------------------------------------------------------*/

(function() {

// FPの宣言
ParamType.MFP = 101;

// FPの設定がされているか
OT_isFPCustom = function(obj, paramName)
{
	if( obj == null )
	{
		return false;
	}

	if( obj.custom.OT_FP == null )
	{
		return false;
	}
	
	if( paramName == null ) {
		return true;
	}
	
	if( typeof obj.custom.OT_FP[paramName] == 'undefined' ) {
		return false;
	}
	
	return true;
};

// FP使用値を取得する
OT_GetUseFP = function(unit, value)
{
	var unitMaxFp = OT_GetMaxFP(unit);
	return OT_GetEPValue(value, unitMaxFp);
};

// オブジェのFP使用値を取得する
OT_GetItemUseFP = function(unit, obj)
{
	if(unit == null)
	{
		return 0;
	}
	
	if(!OT_isFPCustom(obj))
	{
		return 0;
	}
	
	return OT_GetUseFP(unit, obj.custom.OT_FP.Use);
};

// FPの値を正規化して取得
OT_GetFPValue = function(value, fpMax)
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
		var num = Math.floor( fpMax * (percent / 100) );

		return parseInt(num);
	}
	else if( value.match(regexNum) )
	{
		return parseInt(value);
	}
	
	return 0;
};

// 現在の残FPを取得
OT_GetNowFP = function(unit)
{
	var fp;

	if (typeof unit.custom.tmpNowFp === 'number')
	{
		fp = unit.custom.tmpNowFp;
	}
	else
	{
		fp = 0;
	}
	
	return parseInt(fp);
};

// 現在の残FPを設定
OT_SetNowFP = function(unit, fp)
{
	var max = ParamBonus.getFp(unit);
	unit.custom.tmpNowFp = OT_GetFPValue(fp, max);
	unit.custom.tmpFpChange = true;
	
	if( unit.custom.tmpNowFp > max )
	{
		unit.custom.tmpNowFp = max;
	}
	else if( unit.custom.tmpNowFp < 0 )
	{
		unit.custom.tmpNowFp = 0;
	}
};

// FP回復
OT_RecoveryNowFP = function(unit, value)
{
	var use = 0;
	var max = 0;
	
	if( unit == null || value == null )
	{
		return;
	}
	
	max = ParamBonus.getFp(unit);
	use = OT_GetFPValue( value, max );
	
	if (typeof unit.custom.tmpNowFp === 'number')
	{
		unit.custom.tmpNowFp += use;
	}
	else
	{
		unit.custom.tmpNowFp = 0;
	}

	if( unit.custom.tmpNowFp > max )
	{
		unit.custom.tmpNowFp = max;
	}
	else if( unit.custom.tmpNowFp < 0 )
	{
		unit.custom.tmpNowFp = 0;
	}
};

// FP使用
OT_UseNowFP = function(unit, value)
{
	var use = 0;
	var max = 0;
	
	if( unit == null || value == null )
	{
		return;
	}
	
	max = ParamBonus.getFp(unit);
	use = OT_GetFPValue( value, max );
	
	if (typeof unit.custom.tmpNowFp === 'number')
	{
		unit.custom.tmpNowFp -= use;
	}
	else
	{
		unit.custom.tmpNowFp = 0;
	}

	if( unit.custom.tmpNowFp > max )
	{
		unit.custom.tmpNowFp = max;
	}
	else if( unit.custom.tmpNowFp < 0 )
	{
		unit.custom.tmpNowFp = 0;
	}
};

// 現在のMaxFP(外部参照用)を取得
OT_GetMaxFP = function(unit)
{
	var fp;

	if (typeof unit.custom.tmpMaxFp === 'number')
	{
		fp = unit.custom.tmpMaxFp;
	}
	else
	{
		fp = 0;
	}
	
	return parseInt(fp);
};

// 現在のMaxFP(外部参照用)を設定
OT_SetMaxFP = function(unit, fp)
{
	unit.custom.tmpMaxFp = fp;
};

// 使用FP(文字)を取得
OT_GetStringUseFP = function(obj)
{
	if( obj == null )
	{
		return 0;
	}
	
	if( !OT_isFPCustom(obj) )
	{
		return 0;
	}
	
	if( obj.custom.OT_FP.Use == null )
	{
		return 0;
	}

	var regex = /^(\-?)([0-9]+)(\%?)$/;
	if (typeof obj.custom.OT_FP.Use === 'number')
	{
		fp = obj.custom.OT_FP.Use;
	}
	else if(obj.custom.OT_FP.Use.match(regex))
	{
		fp = obj.custom.OT_FP.Use;
	}
	else
	{
		fp = 0;
	}
	
	return '' + fp;
};

// 戦闘時取得FPを取得
OT_GetBattleBonusFP = function(unit, weapon)
{
	var i, count, item, n, id;
	var d = 0;
	var arr = [];
	var BattleBonusFP = {
		  Hit:0
		, NoHit:0
		, Damage:0
		, Avoid:0
	};

	var unitClass = unit.getClass();
	// 攻撃時に取得するFP
	if( OT_isFPCustom(unitClass, 'BattleBonus') ) {
		BattleBonusFP.Hit    += OT_GetUseFP(unit, unitClass.custom.OT_FP.BattleBonus.Hit);
		BattleBonusFP.NoHit  += OT_GetUseFP(unit, unitClass.custom.OT_FP.BattleBonus.NoHit);
		BattleBonusFP.Damage += OT_GetUseFP(unit, unitClass.custom.OT_FP.BattleBonus.Damage);
		BattleBonusFP.Avoid  += OT_GetUseFP(unit, unitClass.custom.OT_FP.BattleBonus.Avoid);
	}

	if (weapon !== null) {
		if( OT_isFPCustom(weapon, 'BattleBonus') ) {
			BattleBonusFP.Hit    += OT_GetUseFP(unit, weapon.custom.OT_FP.BattleBonus.Hit);
			BattleBonusFP.NoHit  += OT_GetUseFP(unit, weapon.custom.OT_FP.BattleBonus.NoHit);
			BattleBonusFP.Damage += OT_GetUseFP(unit, weapon.custom.OT_FP.BattleBonus.Damage);
			BattleBonusFP.Avoid  += OT_GetUseFP(unit, weapon.custom.OT_FP.BattleBonus.Avoid);
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
				if( OT_isFPCustom(item, 'BattleBonus') ) {
					BattleBonusFP.Hit    += OT_GetUseFP(unit, item.custom.OT_FP.BattleBonus.Hit);
					BattleBonusFP.NoHit  += OT_GetUseFP(unit, item.custom.OT_FP.BattleBonus.NoHit);
					BattleBonusFP.Damage += OT_GetUseFP(unit, item.custom.OT_FP.BattleBonus.Damage);
					BattleBonusFP.Avoid  += OT_GetUseFP(unit, item.custom.OT_FP.BattleBonus.Avoid);
				}
			}
		}
	}

	var i, state;
	var list = unit.getTurnStateList();
	var count = list.getCount();
	
	for (i = 0; i < count; i++) {
		state = list.getData(i).getState();
		
		if( OT_isFPCustom(state, 'BattleBonus') ) {
			BattleBonusFP.Hit    += OT_GetUseFP(unit, state.custom.OT_FP.BattleBonus.Hit);
			BattleBonusFP.NoHit  += OT_GetUseFP(unit, state.custom.OT_FP.BattleBonus.NoHit);
			BattleBonusFP.Damage += OT_GetUseFP(unit, state.custom.OT_FP.BattleBonus.Damage);
			BattleBonusFP.Avoid  += OT_GetUseFP(unit, state.custom.OT_FP.BattleBonus.Avoid);
		}
	}

	return BattleBonusFP;
};

// FPチャージ量(ユニット、クラス、アイテム)を取得
OT_GetFPRecovery = function(unit)
{
	return OT_GetFPRecoveryBonus(unit, unit) + OT_GetFPRecoveryBonus(unit, unit.getClass()) + OT_GetFPRecoveryItemBonus(unit);
	//return this.getClassUnitValue(unit, index) + this.getUnitTotalParamBonus(unit, index) + StateControl.getStateParameter(unit, index);
};

// FPチャージ量(ユニット、クラス、アイテム、ステート)を取得
OT_GetFPRecoveryAll = function(unit)
{
	return OT_GetFPRecovery(unit) + StateControl.getFpValue(unit);
	//return this.getClassUnitValue(unit, index) + this.getUnitTotalParamBonus(unit, index) + StateControl.getStateParameter(unit, index);
};

// オブジェ毎のFPチャージ量を取得
OT_GetFPRecoveryBonus = function(unit, obj)
{
	var fp;
	var max = ParamBonus.getFp(unit);
	
	if( !OT_isFPCustom(obj) ) return 0;
	
	if (obj.custom.OT_FP.Recovery != null)
	{
		fp = OT_GetFPValue( obj.custom.OT_FP.Recovery, max );
	}
	else
	{
		fp = 0;
	}
	
	return fp;
};

// 所持品のFPチャージ量を取得
OT_GetFPRecoveryItemBonus = function(unit)
{
	var i, count, item, n, id;
	var d = 0;
	var weapon = ItemControl.getEquippedWeapon(unit);
	var arr = [];
	
	if (weapon !== null) {
		d += OT_GetFPRecoveryBonus(unit, weapon);
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
			
			n = OT_GetFPRecoveryBonus(unit, item);
			// ItemControl.isItemUsableを呼び出すことで、
			// 使用が許可されていないユニットに対しての補正は無効にしている。
			if (n !== 0 && ItemControl.isItemUsable(unit, item)) {
				d += n;
			}
		}
	}
	
	return d;
};

// マップ開始時のFP初期値を取得
OT_GetDefaultFP = function(unit)
{
	if( !OT_isFPCustom(unit.getClass()) )
	{
		return 0;
	}
	
	return OT_GetFPValue(unit.getClass().custom.OT_FP.Default, ParamBonus.getFp(unit));
};

// 参照のみかを取得
OT_GetCheckOnlyFP = function(obj)
{
	var fp;

	if ( !OT_isFPCustom(obj) )
	{
		return false;
	}
	
	if( typeof obj.custom.OT_FP.CheckOnly != 'boolean' )
	{
		return false;
	}
	
	return obj.custom.OT_FP.CheckOnly;
};

// 移動によるFPコストを取得
OT_GetMoveCostFP = function(obj, movePoint)
{
	if( obj == null )
	{
		return 0;
	}
	
	if( !OT_isFPCustom(obj) )
	{
		return 0;
	}

	var cost = 0;
	if( typeof obj.custom.OT_FP.MoveCost === 'number' )
	{
		cost = Math.floor(obj.custom.OT_FP.MoveCost * movePoint);
	}
	
	return cost;
};

UnitParameter.MFP = defineObject(BaseUnitParameter,
{	
	getUnitValue: function(unit) {
		var fp;
		
		if( !OT_isFPCustom(unit) ) return 0;

		if (typeof unit.custom.OT_FP.Value === 'number') {
			fp = unit.custom.OT_FP.Value;
		}
		else {
			fp = 0;
		}
		
		return fp;
	},
	
	setUnitValue: function(unit, value) {
		if( !OT_isFPCustom(unit) )
		{
			unit.custom.OT_FP = {};
		}

		unit.custom.OT_FP.Value = value;
	},

	// 毎ターン毎のFP回復量を取得
	getUnitRecoveryValue: function(unit) {
		var fp;
		
		if( !OT_isFPCustom(unit) ) return 0;

		var value = unit.custom.OT_FP.Recovery;
		if (typeof value === 'number') {
			fp = value;
		} else if(typeof value === 'string') {
			var regex = /^([\-]*[0-9]+)\%$/;
			var regexNum = /^([\-]*[0-9]+)$/;
			
			if(value.match(regex)) {
				fp = value;
			} else if(value.match(regexNum)) {
				fp = parseInt(value);
			} else {
				fp = 0;
			}
		} else {
			fp = 0;
		}
		
		return fp;
	},

	// 毎ターン毎のFP回復量を設定
	setUnitRecoveryValue: function(unit, value) {
		if( !OT_isFPCustom(unit) )
		{
			unit.custom.OT_FP = {};
		}

		unit.custom.OT_FP.Recovery = value;
	},

	// objはユニットやクラス、武器など
	getParameterBonus: function(obj) {
		var fp;
		
		if( obj == null ) return 0;

		if( !OT_isFPCustom(obj) ) return 0;
		
		if (typeof obj.custom.OT_FP.Value === 'number')
		{
			fp = obj.custom.OT_FP.Value;
		}
		else
		{
			fp = 0;
		}
		
		return fp;
	},
	
	// objはユニットやクラス、武器など
	getGrowthBonus: function(obj) {
		var fp;
		
		if( obj == null ) return 0;

		if( !OT_isFPCustom(obj) ) return 0;

		if (typeof obj.custom.OT_FP.Growth === 'number') {
			fp = obj.custom.OT_FP.Growth;
		}
		else {
			fp = 0;
		}
		
		return fp;
	},
	
	// objは、CommandParameterChange、Item、State、TurnStateのいずれかになる
	getDopingParameter: function(obj) {
		var fp;
		
		if( obj == null ) return 0;

		try
		{
			// TurnStateならgetState()が正常に処理される
			var state = obj.getState();
			var turn = state.getTurn() - obj.getTurn();
			if( !OT_isFPCustom(state) ) return 0;
	
			if (typeof state.custom.OT_FP.Doping === 'number') {
				fp = state.custom.OT_FP.Doping;

				if( fp > 0 )
				{
					fp = fp - ( state.getTurnChangeValue() * turn );
				}
				else if( fp < 0 )
				{
					fp = fp + ( state.getTurnChangeValue() * turn );
				}
			}
			else {
				fp = 0;
			}
		}
		catch (e)
		{
			// TurnState以外ならgetState()が必ず失敗するため下記の処理をする
			if (typeof obj.custom !== 'object') {
				return 0;
			}
			
			if( !OT_isFPCustom(obj) ) return 0;
	
			if (typeof obj.custom.OT_FP.Doping === 'number') {
				fp = obj.custom.OT_FP.Doping;
			}
			else {
				fp = 0;
			}
		}
		
		return fp;
	},
	
	getMaxValue: function(unit) {
		var fpMax;
		
		if (root.getUserExtension().isClassLimitEnabled())
		{
			if ( OT_isFPCustom(unit.getClass()) && typeof unit.getClass().custom.OT_FP.Max === 'number')
			{
				fpMax = unit.getClass().custom.OT_FP.Max;
			}
			else if( root.getMetaSession().global.OT_FP != null && typeof root.getMetaSession().global.OT_FP.Max === 'number')
			{
				fpMax = root.getMetaSession().global.OT_FP.Max;
			}
			else
			{
				fpMax = 100;
			}
		}
		else
		{
			if ( root.getMetaSession().global.OT_FP != null && typeof root.getMetaSession().global.OT_FP.Max === 'number')
			{
				fpMax = root.getMetaSession().global.OT_FP.Max;
			}
			else
			{
				fpMax = 100;
			}
		}
		
		return fpMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},

	getParameterType: function() {
		return ParamType.MFP;
	},

	getParameterName: function() {
		return OT_FPFrameSetting.Name;
	}
}
);

// キャラのFP最大値(クラスやアイテムの加算ボーナス込)を取得
ParamBonus.getFp = function(unit)
{
	var n = this.getBonus(unit, ParamType.MFP);
	
	// 外部参照用の値を保持
	OT_SetMaxFP(unit, n);
	return n;
};

// キャラのFP最大値(ユニットとクラスの合計)を取得
ParamBonus.getFpClassUnit = function(unit)
{
	var i, typeTarget, n;
	var index = -1;
	var count = ParamGroup.getParameterCount();
	var type = ParamType.MFP;
	
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
		//root.log(range);
		//root.log(MinPercent+':'+MaxPercent);

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

// ユニットメニューでFPが表示されるようにする
var alias1 = ParamGroup._configureUnitParameters;
ParamGroup._configureUnitParameters = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.insertObject(UnitParameter.MFP, 2);
};

// 武器の装備可否を決定するメソッドに、FP消費量を追加する
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
	
	var unitFp = OT_GetNowFP(unit);
	
	// MaxFPは外部参照用のものを取得しないと無限ループで落ちてしまう
	var unitMaxFp = OT_GetMaxFP(unit);
	
	var weaponFp = 0;
	if ( OT_isFPCustom(weapon) )
	{
		weaponFp = OT_GetFPValue( weapon.custom.OT_FP.Use, unitMaxFp );
	}
	
	if(weaponFp > 0)
	{
		if(typeof unit.custom.tmpMoveFP === 'number')
		{
			weaponFp += unit.custom.tmpMoveFP;
		}
	}
	
	// 武器を装備できるのは、ユニットのFPが武器の消費FPを上回っていることが条件とする
	return unitFp >= weaponFp;
};

/*
// ユニット登場時にFPをセットする
var alias5 = Miscellaneous.setupFirstUnit;
Miscellaneous.setupFirstUnit = function(unit)
{
	alias5.call(this, unit);
	
	unit.custom.tmpNowFp = OT_GetDefaultFP(unit);
	unit.custom.tmpUseFp = 0;
};
*/

// アイテム装備時のFPを調整
var alias6 = ItemControl.updatePossessionItem;
ItemControl.updatePossessionItem = function(unit)
{
	alias6.call(this, unit);

	var scene = root.getCurrentScene();
	
	// シーンがFREEでもEVENTでもない場合は、常にFPがデフォルトFPとなる。
	// これを確認しなければ、マップ上でのアイテム交換や、イベントのアイテム増減でFPが変化する。
	if (scene !== SceneType.FREE && scene !== SceneType.EVENT) {
		unit.custom.tmpNowFp = OT_GetDefaultFP(unit);
	}
	
	// FPが最大FPを超えないようにする
	OT_SetNowFP(unit, OT_GetNowFP(unit));
};

// 毎ターンFP自動チャージ
var alias7 = RecoveryAllFlowEntry._completeMemberData;
RecoveryAllFlowEntry._completeMemberData = function(turnChange)
{
	var result = alias7.call(this, turnChange);
	var i, unit, recoveryValue;
	var list = TurnControl.getActorList();
	var count = list.getCount();
	
	var commandCount = 0;
	var isSkipMode = CurrentMap.isTurnSkipMode();
	var generator = this._dynamicEvent.acquireEventGenerator();

	for (i = 0 ; i < count; i++) {
		unit = list.getData(i);
		recoveryValue = OT_GetFPRecovery(unit);
		recoveryValue += StateControl.getFpValue(unit);

		OT_RecoveryNowFP(unit, recoveryValue);

		// FPが指定範囲内ならステート付与したい場合
		if( OT_isFPCustom(unit.getClass()) )
		{
			var add = unit.getClass().custom.OT_FP.AddState;
			var nowFP = OT_GetNowFP(unit);
			var unitMaxFp = ParamBonus.getFp(unit);

			if(typeof add === 'object')
			{
				var list2 = root.getBaseData().getStateList();
				var length = add.length;
				for(var j = 0; j < length; j++)
				{
					var obj = add[j];
					var length2 = obj['State'].length;

					//root.log(nowFP + ':' + unitMaxFp);
					if(OT_isValueInRange(nowFP, unitMaxFp, obj['Range']))
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

	return result;
};

// FP自然回復値を取得
StateControl.getFpValue = function(unit) {
	var i, state;
	var list = unit.getTurnStateList();
	var count = list.getCount();
	var recoveryValue = 0;
	
	for (i = 0; i < count; i++) {
		state = list.getData(i).getState();
		
		if ( OT_isFPCustom(state) )
		{
			recoveryValue += OT_GetFPValue(state.custom.OT_FP.Recovery, ParamBonus.getFp(unit));
		}
	}
	
	return recoveryValue;
};

// アイテム紛失時にFP最大値の調整を行う
var alias8 = ItemControl.deleteItem;
ItemControl.deleteItem = function(unit, item)
{
	var result = alias8.call(this, unit, item);
	
	ItemControl.updatePossessionItem(unit);
	
	return result;
};

// アイテムの使用可否を決定するメソッドに、FP消費量を追加する
var alias9 = ItemControl.isItemUsable;
ItemControl.isItemUsable = function(unit, item) {
	var result = alias9.call(this, unit, item);
	if (!result)
	{
		// 使用できないため続行しない
		return false;
	}
	
	var unitFp = OT_GetNowFP(unit);
	
	// MaxFPは外部参照用のものを取得しないと無限ループで落ちてしまう
	var unitMaxFp = OT_GetMaxFP(unit);
	
	var itemFp = 0;
	if ( OT_isFPCustom(item) )
	{
		itemFp = OT_GetFPValue( item.custom.OT_FP.Use, unitMaxFp );
	}

	if(itemFp > 0)
	{
		if(typeof unit.custom.tmpMoveFP === 'number')
		{
			itemFp += unit.custom.tmpMoveFP;
		}
	}
	
	// ユニットのFPがアイテムの消費FPを上回っていることが条件とする
	return unitFp >= itemFp;
};

// アイテム使用時にFPを消費
var alias10 = ItemUseParent.decreaseItem;
ItemUseParent.decreaseItem = function() {
	alias10.call(this);
	
	var unit = this._itemTargetInfo.unit;
	var item = this._itemTargetInfo.item;

	if( !OT_GetCheckOnlyFP(item) )
	{
		var unitFp = OT_GetNowFP(unit);
		var unitMaxFp = ParamBonus.getFp(unit);
		var weaponFp = 0;
		
		if( OT_isFPCustom(item) )
		{
			itemFp = OT_GetFPValue( item.custom.OT_FP.Use, unitMaxFp );
			OT_UseNowFP(unit, itemFp);
		}
	}
};

// 拠点の設定で回復許可がある時は出撃選択時に味方のFPを全快にしておく
var alias11 = UnitProvider.recoveryPrepareUnit;
UnitProvider.recoveryPrepareUnit = function(unit)
{
	alias11.call(this, unit);
	OT_SetNowFP(unit, OT_GetDefaultFP(unit));
};

// テストメンバーユニットや増援ユニットのFPを全快にする
var alias12 = ScriptCall_AppearEventUnit;
ScriptCall_AppearEventUnit = function(unit)
{
	alias12.call(this, unit);
	OT_SetNowFP(unit, OT_GetDefaultFP(unit));
};

// マップに最初から配置されてるキャラのFPを全快にする
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
			OT_SetNowFP(unit, OT_GetDefaultFP(unit));
		}
	}
	
	list = root.getCurrentSession().getGuestList();
	count = list.getCount();
	for (j = 0; j < count; j++) {
		unit = list.getData(j);
		OT_SetNowFP(unit, OT_GetDefaultFP(unit));
	}
};

// 情報収集で仲間になるキャラは一度もFPの調整がされていないため
// 出撃キャラ選択、ユニット情報選択時に補正する
var alias14 = UnitSortieScreen.setScreenData;
UnitSortieScreen.setScreenData = function(screenParam) {
	alias14.call(this, screenParam);
	
	var i, unit;
	var list = PlayerList.getMainList();
	var count = list.getCount();
	
	for (i = 0; i < count; i++) {
		unit = list.getData(i);
		
		if( unit.custom.tmpFpChange != true)
		{
			OT_SetNowFP(unit, OT_GetDefaultFP(unit));
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
		
		if( unit.custom.tmpFpChange != true)
		{
			OT_SetNowFP(unit, OT_GetDefaultFP(unit));
		}
	}
};

// 戦闘時に攻撃を行う際にFPが足りるかを判定する
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
	var unitFp = OT_GetNowFP(unit);
	var unitMaxFp = ParamBonus.getFp(unit);
	var weaponFp = 0;

	if( OT_isFPCustom(weapon) )
	{
		weaponFp = OT_GetFPValue( weapon.custom.OT_FP.Use, unitMaxFp );
		
		// 消費FPが足りない時は攻撃不可
		if( unitFp < weaponFp + unit.custom.tmpUseFP)
		{
			return false;
		}
	}

	return true;
};

// 戦闘時に攻撃を行う度に消費FPを加算
var alias201 = NormalAttackOrderBuilder._createAndRegisterAttackEntry;
NormalAttackOrderBuilder._createAndRegisterAttackEntry = function(virtualActive, virtualPassive) {
	var attackEntry = alias201.call(this, virtualActive, virtualPassive);
	
	var weapon = virtualActive.weapon;
	if (weapon !== null) {
		var unit = virtualActive.unitSelf;
		var targetUnit = virtualPassive.unitSelf;
		
		if( !OT_GetCheckOnlyFP(weapon) )
		{
			var unitFp = OT_GetNowFP(unit);
			var unitMaxFp = ParamBonus.getFp(unit);
			var weaponFp = 0;
		
			if( OT_isFPCustom(weapon) )
			{
				weaponFp = OT_GetFPValue( weapon.custom.OT_FP.Use, unitMaxFp );
				unit.custom.tmpUseFP += weaponFp;
			}
		}
		
		// 攻撃時に取得するFP
		var bonus = OT_GetBattleBonusFP(unit, weapon);
		if( attackEntry.isHit ) {
			unit.custom.tmpUseFP -= bonus.Hit;
		} else {
			unit.custom.tmpUseFP -= bonus.NoHit;
		}

		// 防御時に取得するFP
		var bonus = OT_GetBattleBonusFP(targetUnit, weapon);
		if( attackEntry.isHit ) {
			targetUnit.custom.tmpUseFP -= bonus.Damage;
		} else {
			targetUnit.custom.tmpUseFP -= bonus.Avoid;
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
	
	OT_UseNowFP(active, active.custom.tmpUseFP );
	OT_UseNowFP(passive, passive.custom.tmpUseFP);

	//root.log('_endVirtualAttack'+active.getName()+active.custom.tmpUseFP);
	//root.log('_endVirtualAttack'+passive.getName()+passive.custom.tmpUseFP);

	active.custom.tmpUseFP  = 0;
	passive.custom.tmpUseFP = 0;
};

// VirtualAttack作成時に使用FPを追加する
var alias203 = VirtualAttackControl.createVirtualAttackUnit;
VirtualAttackControl.createVirtualAttackUnit = function(unitSelf, targetUnit, isSrc, attackInfo)
{
	var virtualAttack = alias203.call(this, unitSelf, targetUnit, isSrc, attackInfo);
	
	unitSelf.custom.tmpUseFP = 0;
	
	//root.log('createVirtualAttackUnit'+unitSelf.getName());
	return virtualAttack;
};

// 移動時FP消費(仮)
// 各キャラ移動時の処理
// この時に移動コストを取得する
var alias300 = SimulateMove.startMove;
SimulateMove.startMove = function(unit, moveCource)
{
	alias300.call(this, unit, moveCource);

	var objClass = unit.getClass();
	if( OT_isFPCustom(objClass) )
	{
		if( typeof objClass.custom.OT_FP.MoveCost === 'number' )
		{
			// 消費移動力を保存
			this._saveMostResentMov(unit, moveCource);
			var cost = objClass.custom.OT_FP.MoveCost;
			unit.custom.tmpMoveFP = Math.floor(unit.getMostResentMov() * cost);
			//root.log(unit.custom.tmpMoveFP);
		}
	}
};

// プレイヤー行動時
var alias301 = MapSequenceCommand._doLastAction;
MapSequenceCommand._doLastAction = function()
{
	var result = alias301.call(this);
	var p = 0;

	if(typeof this._targetUnit.custom.tmpMoveFP === 'number')
	{
		p = this._targetUnit.custom.tmpMoveFP;
	}
	
	if (result === 0 || result === 1) {
		//root.log(this._targetUnit.getName());
		//root.log(p);
		OT_UseNowFP(this._targetUnit, p);
	}
	
	delete this._targetUnit.custom.tmpMoveFP;
	return result;
};

// 再移動用
var alias302 = RepeatMoveFlowEntry.moveFlowEntry;
RepeatMoveFlowEntry.moveFlowEntry = function()
{
	var result = alias302.call(this);
	if (result === MoveResult.END) {
		this._mapSequenceArea.UseFP();
	}
	
	return result;
};

MapSequenceArea.UseFP = function()
{
	var p = 0;

	if(typeof this._targetUnit.custom.tmpMoveFP === 'number')
	{
		p = this._targetUnit.custom.tmpMoveFP;
	}

	//root.log(this._targetUnit.getName());
	//root.log(p);
	OT_UseNowFP(this._targetUnit, p);
	delete this._targetUnit.custom.tmpMoveFP;
};

// 敵移動時スキップ専用
var alias303 = SimulateMove.skipMove;
SimulateMove.skipMove = function(unit, moveCource)
{
	var objClass = unit.getClass();
	if( OT_isFPCustom(objClass) )
	{
		if( typeof objClass.custom.OT_FP.MoveCost === 'number' )
		{
			// 消費移動力を保存
			this._saveMostResentMov(unit, moveCource);
			var cost = objClass.custom.OT_FP.MoveCost;
			unit.custom.tmpMoveFP = Math.floor(unit.getMostResentMov() * cost);
			//root.log(unit.custom.tmpFP);
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
	if(typeof this._unit.custom.tmpMoveFP === 'number')
	{
		p = this._unit.custom.tmpMoveFP;
	}

	OT_UseNowFP(this._unit, p);
	delete this._unit.custom.tmpMoveFP;

	return result;
};

// 敵AIの行動決定時の制御
// 公式のソースでは第一チェック時に攻撃に使用する武器と相手、第二チェック時に移動地点を決定するが
// 第一チェックでは消費FPがFP残量を超えない地点が無い場合はその武器での行動はしないように制御、
// 第二チェックでは消費FPがFP残量を超える地点に移動しないように制御する
var alias305 = CombinationSelector._getTotalScore;
CombinationSelector._getTotalScore = function(unit, combination)
{
	var totalScore = alias305.call(this, unit, combination);

	// 移動FPコスト+攻撃時のFPコストがFP残量を上回る場合はその行動はしないようにする
	if( OT_isFPCustom(combination.item) )
	{
		var unitFp = OT_GetNowFP(unit);
		var unitMaxFp = OT_GetMaxFP(unit);

		// 第一チェックではposIndexが0である
		if( combination.posIndex == 0 )
		{
			// 第一チェック時はどの地点で行動してもFP残量がマイナスになる行動を除外する
			count = combination.costArray.length;
			for (var i = 0; i < count; i++) {
				var costData = combination.costArray[i];
				var useFP = OT_GetFPValue( combination.item.custom.OT_FP.Use, unitMaxFp ) + OT_GetMoveCostFP(unit.getClass(), costData.movePoint);
				
				if(unitFp - useFP >= 0)
				{
					return totalScore;
				}
			}
			return -1;
		}
		else
		{
			// 第二チェック時はFP残量がマイナスになる地点に移動するものを除外する
			var useFP = OT_GetFPValue( combination.item.custom.OT_FP.Use, unitMaxFp ) + OT_GetMoveCostFP(unit.getClass(), combination.movePoint);

			if(unitFp - useFP < 0)
			{
				return -1;
			}
		}
	}
	
	return totalScore;
};

})();
