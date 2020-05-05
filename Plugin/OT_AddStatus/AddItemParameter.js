/*-----------------------------------------------------------------------------------------------
  
  EP��FP�̉񕜃A�C�e���B
    
  �g�p���@:
  ���g�p���鎖��EP�AFP���񕜂���A�C�e��
  �A�C�e���̎�ނ��uHP�񕜁v�ɂ��ĉ��L�̃p�����[�^��ݒ肵�Ă��������B
  {
       OT_EP : { UseRecovery:5 }
     , OT_FP : { UseRecovery:5 }
  }
  �l���}�C�i�X�ɂ���ƑΏۂ�EP�AFP������܂��B

  �쐬��:
  o-to

  �X�V����:
  2017/06/25:
  2016/12/05�ɖ₢���킹�ŎQ�l�p�ɑ��������̂��蒼�����Č��J
  
--------------------------------------------------------------------------*/

(function() {

function getChildParameter(customP, child)
{
	if( customP == null )
	{
		return null;
	}
	
	if( customP[child] == null )
	{
		return null;
	}
	
	return customP[child];
};

var alias1 = RecoveryItemAvailability.isItemAllowed;
RecoveryItemAvailability.isItemAllowed = function(unit, targetUnit, item)
{
	var result = alias1.call(this, unit, targetUnit, item);
	var recoveryEP = getChildParameter(item.custom.OT_EP, 'UseRecovery');
	var recoveryFP = getChildParameter(item.custom.OT_FP, 'UseRecovery');

	if(recoveryEP === null && recoveryFP === null)
	{
		return result;
	}

	var nowEP = OT_GetNowEP(targetUnit);
	var nowFP = OT_GetNowEP(targetUnit);
	var maxEP = OT_GetMaxEP(targetUnit);
	var maxFP = OT_GetMaxFP(targetUnit);
	
	if(nowEP == maxEP && nowFP == maxFP)
	{
		return result;
	}
	
	return true;
};

var alias2 = RecoveryItemUse.enterMainUseCycle;
RecoveryItemUse.enterMainUseCycle = function(itemUseParent)
{
	var result = alias2.call(this, itemUseParent);
	
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	var item = itemTargetInfo.item;
	var unit = itemTargetInfo.unit;
	var targetUnit = itemTargetInfo.targetUnit;
	var value = 0;
	var recoveryEP = getChildParameter(item.custom.OT_EP, 'UseRecovery');
	var recoveryFP = getChildParameter(item.custom.OT_FP, 'UseRecovery');

	if(recoveryEP !== null)
	{
		recoveryEP += Calculator.calculateRecoveryItemPlus(unit, targetUnit, item);
		OT_RecoveryNowEP(itemTargetInfo.targetUnit, recoveryEP);
	}
	
	if(recoveryFP !== null)
	{
		recoveryFP += Calculator.calculateRecoveryItemPlus(unit, targetUnit, item);
		OT_RecoveryNowFP(itemTargetInfo.targetUnit, recoveryFP);
	}

	return result;
};

// �GAP�p(�񕜂��K�v��)
var alias3 = RecoveryItemAI._getScore;
RecoveryItemAI._getScore = function(unit, combination)
{
	var score = alias3.call(this, unit, combination);
	var item = combination.item;
	var targetUnit = combination.targetUnit;
	var recoveryEP = getChildParameter(item.custom.OT_EP, 'UseRecovery');
	var recoveryFP = getChildParameter(item.custom.OT_FP, 'UseRecovery');
	
	var basePoint;
	var nowEP = OT_GetNowEP(targetUnit);
	var nowFP = OT_GetNowEP(targetUnit);
	var maxEP = OT_GetMaxEP(targetUnit);
	var maxFP = OT_GetMaxFP(targetUnit);
	
	if(recoveryEP !== null)
	{
		// HP�̌��肪���������j�b�g�قǗD�悳���
		basePoint = Math.floor(maxEP * 0.25);
		if (nowEP < basePoint) {
			score += 10;
		}
		
		basePoint = Math.floor(maxEP * 0.5);
		if (nowEP < basePoint) {
			score += 5;
		}
		
		basePoint = Math.floor(maxEP * 0.75);
		if (nowEP < basePoint) {
			score += 5;
		}
	}

	if(recoveryFP !== null)
	{
		// HP�̌��肪���������j�b�g�قǗD�悳���
		basePoint = Math.floor(maxFP * 0.25);
		if (nowFP < basePoint) {
			score += 10;
		}
		
		basePoint = Math.floor(maxFP * 0.5);
		if (nowFP < basePoint) {
			score += 5;
		}
		
		basePoint = Math.floor(maxFP * 0.75);
		if (nowFP < basePoint) {
			score += 5;
		}
	}
	
	return score;
};

// �GAP�p
var alias4 = RecoveryItemAI._getValue;
RecoveryItemAI._getValue = function(unit, combination)
{
	var value = alias4.call(this, unit, combination);
	var n = 0;
	var targetUnit = combination.targetUnit;
	var item = combination.item;
	var plus = Calculator.calculateRecoveryItemPlus(unit, combination.targetUnit, combination.item);
	var recoveryEP = getChildParameter(item.custom.OT_EP, 'UseRecovery');
	var recoveryFP = getChildParameter(item.custom.OT_FP, 'UseRecovery');
	var maxEP = OT_GetMaxEP(targetUnit);
	var maxFP = OT_GetMaxFP(targetUnit);

	if(recoveryEP !== null)
	{
		n = recoveryEP + plus;
		if (n > maxEP) {
			n = maxEP;
		}
		value += n;
	}

	if(recoveryFP !== null)
	{
		n = recoveryFP + plus;
		if (n > maxFP) {
			n = maxFP;
		}
		value += n;
	}
		
	return value;
};

})();