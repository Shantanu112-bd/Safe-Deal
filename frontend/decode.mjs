import { xdr } from "@stellar/stellar-sdk";

const resultXdr = "AAAAAAABAu7////6AAAAAA==";
const result = xdr.TransactionResult.fromXDR(resultXdr, "base64");
console.log(JSON.stringify(result, null, 2));
