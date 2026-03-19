import { Keypair, Horizon, TransactionBuilder, Networks, BASE_FEE, Contract, nativeToScVal, Address, rpc } from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);
const rpcServer = new rpc.Server(RPC_URL);

async function fundAccount(publicKey) {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    await response.json();
    console.log("Account funded:", publicKey);
  } catch (e) {
    console.error("Funding failed", e);
  }
}

const PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID = "CDNK66APDPFR4IG5DNNV2RJBZEXNMVRYGU7XKZCFV5TU7AFUPZVLBS7Y";

async function run() {
  const kp = Keypair.random();
  await fundAccount(kp.publicKey());
  
  const contract = new Contract(CONTRACT_ID);
  
  const args = [
    new Address(kp.publicKey()).toScVal(),
    nativeToScVal(BigInt(100 * 10000000), { type: "i128" }),
    nativeToScVal("test desc", { type: "string" }),
    nativeToScVal("test item", { type: "string" }),
    nativeToScVal(24, { type: "u64" }),
  ];
  
  const account = await rpcServer.getAccount(kp.publicKey());
  const builder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(contract.call("create_deal", ...args))
    .setTimeout(60);
    
  let tx = builder.build();
  
  console.log("Simulating...");
  const simResponse = await rpcServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResponse)) {
    console.error("Sim error:", simResponse.error);
    return;
  }
  
  if (simResponse.minResourceFee) {
    const feeWithMargin = (BigInt(simResponse.minResourceFee) * 120n) / 100n;
    simResponse.minResourceFee = feeWithMargin.toString();
  }
  
  tx = rpc.assembleTransaction(tx, simResponse).build();
  tx.sign(kp);
  
  console.log("Submitting...");
  const sendResponse = await rpcServer.sendTransaction(tx);
  if (sendResponse.status === "ERROR") {
    console.error("Send error:", sendResponse);
    console.error("Error Result Base64 XDR:", sendResponse.errorResult?.toXDR("base64"));
  } else {
    console.log("Success! Hash:", sendResponse.hash);
  }
}

run().catch(console.error);
