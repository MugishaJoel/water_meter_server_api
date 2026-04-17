const SECRET_KEY = 0xA3B1C2D3E4F56789n;
function hashMeterID(meterID) {
  let hash = 0n;
  for (let i = 0; i < meterID.length; i++) {
    hash = (hash * 131n + BigInt(meterID.charCodeAt(i))) & 0xFFFFFn; // 20 bits
  }
  return hash;
}
function secureRandom() {
  return BigInt(Math.floor(Math.random() * 128)); // 0–511 (9 bits)
}
function simpleMAC(data) {
  let mac = data ^ SECRET_KEY;
  mac ^= (mac >> 33n);
  mac *= 0xff51afd7ed558ccdn;
  mac ^= (mac >> 33n);
  return mac & 0xFFFFn;
}
function map(value, fromLow, fromHigh, toLow, toHigh) {
  return toLow + (toHigh - toLow) * (value - fromLow) / (fromHigh - fromLow);
}
function aToken(meterID, credit, tokenID) {

  if (credit > 8000 || credit <= 40) {
    console.log("credit should be in range 0.1 to 20");
    return "Failed";
  }

  let creditMapped =  Math.floor(map(credit, 40, 8000, 1, 127));
  console.log(creditMapped);

  const meterHash = hashMeterID(meterID);
  const random = secureRandom();

  let data =
      (meterHash << 28n) |                 // 20 bits
      (BigInt(creditMapped) << 21n) |      // 7 bits
      ((BigInt(tokenID) & 0x3FFFn) << 7n) |  // 14 bits
      random;                              // 7 bits

  let mac = simpleMAC(data);

  let full = (data << 16n) | mac; // 64 bits

  let encrypted = full ^ SECRET_KEY;

  let token = encrypted.toString().padStart(20,'0');
  token = token.match(/.{1,4}/g).join('-');

  return token;
}
function bToken(token) {
  let body = token.slice(0, 18).split('');
  const rounds = parseInt(token.slice(18, 20), 10);
  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < body.length; i++) {
      let j = (i * 7 + r * 11) % body.length;

      [body[i], body[j]] = [body[j], body[i]];
    }
  }
  return body.join('') + token.slice(18);
}
function final(meterNumber,amount,lastTokenId){
    return bToken(aToken(meterNumber, amount, lastTokenId).replaceAll('-','')).match(/.{1,4}/g).join('-');
}
module.exports = {final};