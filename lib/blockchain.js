
const params = {
  LAST_POW_BLOCK: 182700, // 345600
  RAMP_TO_BLOCK: 960,
  LAST_SEESAW_BLOCK: 200000
};

const avgBlockTime = 40; // (40 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 960

const blocksPerWeek = blocksPerDay * 7; // 6720

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 29220

const blocksPerYear = blocksPerDay * 365.25; // 350640

const mncoins = 500000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};

const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let ret = 0.0;

  if (nHeight > params.LAST_SEESAW_BLOCK) {
    return blockValue / 100 * 65;
  }

  if (nHeight < params.RAMP_TO_BLOCK) {
    ret = 0;
  } else if (nHeight <= 28799 && nHeight >= params.RAMP_TO_BLOCK) {
    ret = blockValue / 5;
  } else if (nHeight <= 57599 && nHeight >= 28800) {
    ret = blockValue / 4;
  } else if (nHeight <= 86399 && nHeight >= 57600) {
    ret = blockValue / 3;
  } else if (nHeight <= params.LAST_POW_BLOCK && nHeight >= 86400) {
    ret = blockValue / 2;
  } else if (nHeight > params.LAST_POW_BLOCK) {
    let mNodeCoins = nMasternodeCount * 500000;
    if (mNodeCoins === 0) {
      ret = 0;
    } else {
      if (mNodeCoins <= (nMoneySupply * 0.01) && mNodeCoins > 0) {
        ret = blockValue * 0.90;
      } else {
        ret = blockValue * 0.01;
      }
    }
  }

  return ret;
};

const getSubsidy = (nHeight = 1) => {
  let nSubsidy = 0.0;
  let nSlowSubsidy = 50.0;

  if (nHeight === 1) {
    nSubsidy = 489720.00;
  } else if (nHeight < params.RAMP_TO_BLOCK / 2) {
    nSlowSubsidy /= params.RAMP_TO_BLOCK;
    nSlowSubsidy *= nHeight;
  } else if (nHeight < params.RAMP_TO_BLOCK) {
    nSlowSubsidy /= params.RAMP_TO_BLOCK;
    nSlowSubsidy *= nHeight;
  } else if (nHeight <= 86399 && nHeight >= params.RAMP_TO_BLOCK) {
    nSubsidy = 50;
  } else if (nHeight <= 172799 && nHeight >= 86400) {
    nSubsidy = 43.75;
  } else if (nHeight <= 259199 && nHeight >= 172800) {
    nSubsidy = 37.5;
  } else if (nHeight <= 345600 && nHeight >= 259200) {
    nSubsidy = 31.25;

    // POS Year 1
  } else if (nHeight <= 431999 && nHeight > 345600) {
    nSubsidy = 25;
  } else if (nHeight <= 518399 && nHeight >= 432000) {
    nSubsidy = 21.875;
  } else if (nHeight <= 604799 && nHeight >= 518400) {
    nSubsidy = 18.750;
  } else if (nHeight <= 691199 && nHeight >= 604800) {
    nSubsidy = 15.625;

    // POS Year 2
  } else if (nHeight <= 777599 && nHeight >= 691200) {
    nSubsidy = 12.50;
  } else if (nHeight <= 863999 && nHeight >= 777600) {
    nSubsidy = 10.938;
  } else if (nHeight <= 950399 && nHeight >= 864000) {
    nSubsidy = 9.375;
  } else if (nHeight <= 1036799 && nHeight >= 950400) {
    nSubsidy = 7.812;

    // POS Year 3
  } else if (nHeight <= 1123199 && nHeight >= 1036800) {
    nSubsidy = 6.250;
  } else if (nHeight <= 1209599 && nHeight >= 1123200) {
    nSubsidy = 5.469;
  } else if (nHeight <= 1295999 && nHeight >= 1209600) {
    nSubsidy = 4.688;
  } else if (nHeight <= 1382399 && nHeight >= 1296000) {
    nSubsidy = 3.906;

    // POS Year 4
  } else if (nHeight <= 1468799 && nHeight >= 1382400) {
    nSubsidy = 3.125;
  } else if (nHeight <= 1555199 && nHeight >= 1468800) {
    nSubsidy = 2.734;
  } else if (nHeight <= 1641599 && nHeight >= 1555200) {
    nSubsidy = 2.344;
  } else if (nHeight <= 1727999 && nHeight >= 1641600) {
    nSubsidy = 1.953;

  } else if (nHeight > 1728000) {
    nSubsidy = 1.625;
  } else {
    nSubsidy = 0;
  }

  return nHeight >= params.RAMP_TO_BLOCK ? nSubsidy : nSlowSubsidy;
};

const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * 18.1 ) / mncoins) * 100.0;
};

const isAddress = (s) => {
  return typeof (s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof (s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof (s) === 'string' && s.length === 64;
};

/**
 * How we identify if a raw transaction is Proof Of Stake & Masternode reward
 * @param {String} rpctx The transaction hash string.
 */
const isRewardRawTransaction = (rpctx) => {
  return rpctx.vin.length == 1 &&
    rpctx.vout.length == 3 && // @todo it's possible for reward to have >3 outputs. Ex: "159ff849ae833c3abd05a7b36c5ecc7c4a808a8f1ef292dad0b02875009e009e" on Bulwark Coin (governance)
    // First vout is always in this format
    rpctx.vout[0].value == 0.0 &&
    rpctx.vout[0].n == 0 &&
    rpctx.vout[0].scriptPubKey &&
    rpctx.vout[0].scriptPubKey.type == "nonstandard";

}

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getSubsidy,
  getROI,
  isAddress,
  isBlock,
  isPoS,
  isTX,
  isRewardRawTransaction
};
