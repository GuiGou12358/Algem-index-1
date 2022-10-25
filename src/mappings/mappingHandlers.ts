import { Account, Stake, Unstake, Claim, AddLiquidity, DepositLP } from "../types";
import {
  FrontierEvmEvent,
  FrontierEvmCall,
} from "@subql/frontier-evm-processor";

import { BigNumber } from "ethers";

// Setup types from ABI

type StakedEventArgs = [string, BigNumber] & {
  user: string;
  val: BigNumber;
};
/*

type StakeCallArgs = [string, BigNumber] & {
  user: string;
 _amount: BigNumber;
};

type UnstakeCallArgs = [BigNumber] & {
    _amount: BigNumber;
};

type ClaimCallArgs = [BigNumber] & {
    _amount: BigNumber;
};

type AddLiquidityCallArgs = [BigNumber] & {
    _amounts: BigNumber[];
    _autoStake: boolean;
};

type DepositLPCallArgs = [BigNumber] & {
    _amount: BigNumber;
};
*/


export async function handleEvmEventStaked(
  event: FrontierEvmEvent<StakedEventArgs>
): Promise<void> {

   await logger.info("---------- Staked(address indexed user, uint256 val) --------- ");
   await logger.info(event.transactionHash);
   await logger.info(event.address);
   const targettedAddress = "0x70d264472327b67898c919809a9dc4759b6c0f27";

   if (event.address == targettedAddress){
       await logger.info("Correct contract");
   } else {
       await logger.info("Other contract");
       return;
    }

   await logger.info(event.topics[0]);
   await logger.info(event.topics[1]);
   await logger.info(event.args); // undefined ?!?
   await logger.info(event.args.user); // doesn't work ?!?
   await logger.info(event.args.val); // doesn't work ?!?

   //const user = event.args.user;
   const user = event.topics[1];
   const userAccount = await Account.get(user.toString());
   if (!userAccount) {
      await new Account(user.toString()).save();
   }

  const stake = new Stake(event.transactionHash);
  stake.accountId = user;
  stake.amount = event.args.val.toBigInt();
  await stake.save();
}

/*
export async function handleEvmCallStake(
  event: FrontierEvmCall<StakeCallArgs>
): Promise<void> {

   await logger.info("---------- Stake ---------------------------------------------- ");
   await logger.info(event.hash);
   await logger.info(event.from);
   await logger.info(event.to);

   if (event.to != "0x70d264472327b67898c919809a9dc4759b6c0f27"){
       await logger.info("---------------------------------------------------------------------------------");
       await logger.info("Other contract");
       await logger.info("---------------------------------------------------------------------------------");
       return;
   }

   const user = event.from;
   const userAccount = await Account.get(user.toString());
   if (!userAccount) {
      await new Account(user.toString()).save();
   }

  const stake = new Stake(event.hash);
  stake.accountId = user;
  //await logger.info(event.args._amount);   // doesn't work ?!?
  //stake.amount = BigNumber.from(event.data).toBigInt();   // doesn't work ?!?
  await stake.save();

}



export async function handleEvmCallUnstake(
  event: FrontierEvmCall<UnstakeCallArgs>
): Promise<void> {

   await logger.info("---------- Unstake ---------------------------------------------- ");
   await logger.info(event.hash);
   await logger.info(event.from);
   await logger.info(event.to);

   if (event.to != "0x70d264472327b67898c919809a9dc4759b6c0f27"){
       await logger.info("---------------------------------------------------------------------------------");
       await logger.info("Other contract");
       await logger.info("---------------------------------------------------------------------------------");
       return;
   }

   const user = event.from;
   const userAccount = await Account.get(user.toString());
   if (!userAccount) {
      await new Account(user.toString()).save();
   }

  const unstake = new Unstake(event.hash);
  unstake.accountId = user;
  await logger.info(event.args._amount);   // doesn't work ?!?
  //unstake.amount = event.args._amount.toBigInt();   // doesn't work ?!?
  await unstake.save();

}

export async function handleEvmCallClaim(
  event: FrontierEvmCall<ClaimCallArgs>
): Promise<void> {

   await logger.info("---------- Claim ---------------------------------------------- ");
   await logger.info(event.hash);
   await logger.info(event.from);
   await logger.info(event.to);

   if (event.to != "0x70d264472327b67898c919809a9dc4759b6c0f27"){
       await logger.info("---------------------------------------------------------------------------------");
       await logger.info("Other contract");
       await logger.info("---------------------------------------------------------------------------------");
       return;
   }

   const user = event.from;
   const userAccount = await Account.get(user.toString());
   if (!userAccount) {
      await new Account(user.toString()).save();
   }

  const claim = new Claim(event.hash);
  claim.accountId = user;
  await logger.info("amount:" + event.args._amount);   // doesn't work ?!?
  //claim.amount = event.args._amount.toBigInt();   // doesn't work ?!?
  await claim.save();

}

export async function handleEvmCallAddLiquidity(
  event: FrontierEvmCall<AddLiquidityCallArgs>
): Promise<void> {

   await logger.info("---------- Add Liquidity ---------------------------------------------- ");
   await logger.info(event.hash);
   await logger.info(event.from);
   await logger.info(event.to);
   let adapter;
   if (event.to == "0x8d4f87a8f688af04e9e3023c8846c3f6c64f410e"){
    // KaglaAdapter
    adapter = "Kagla";
   } else if (event.to == "0x29774f72d921d1f5c591ab68de532a528a4288b4"){
    // SiriusAdapter
    adapter = "Sirius";
   } else {
    await logger.info("---------------------------------------------------------------------------------");
    await logger.info("Other contract");
    await logger.info("---------------------------------------------------------------------------------");
    return;
   }

   const user = event.from;
   const userAccount = await Account.get(user.toString());
   if (!userAccount) {
      await new Account(user.toString()).save();
   }

  const addLiquidity = new AddLiquidity(event.hash);
  addLiquidity.accountId = user;
  addLiquidity.adapter = adapter;

  await logger.info(event.args._autoStake);   // doesn't work ?!?
  await logger.info(event.args._amounts);   // doesn't work ?!?
  //addLiquidity.amounts = event.args._amounts.toBigInt();
  await addLiquidity.save();

}


export async function handleEvmCallDepositLP(
  event: FrontierEvmCall<DepositLPCallArgs>
): Promise<void> {

   await logger.info("---------- Deposit LP ---------------------------------------------- ");
   await logger.info(event.hash);
   await logger.info(event.from);
   await logger.info(event.to);
      let adapter;
      if (event.to == "0x8d4f87a8f688af04e9e3023c8846c3f6c64f410e"){
       // KaglaAdapter
       adapter = "Kagla";
      } else if (event.to == "0x29774f72d921d1f5c591ab68de532a528a4288b4"){
       // SiriusAdapter
       adapter = "Sirius";
      } else {
       await logger.info("---------------------------------------------------------------------------------");
       await logger.info("Other contract");
       await logger.info("---------------------------------------------------------------------------------");
       return;
      }


   const user = event.from;
   const userAccount = await Account.get(user.toString());
   if (!userAccount) {
      await new Account(user.toString()).save();
   }

  const depositLP = new DepositLP(event.hash);
  depositLP.accountId = user;
  depositLP.adapter = adapter;
  await logger.info(event.args._amount); // doesn't work ?!?
  //depositLP.amount = event.args._amount.toBigInt();
  await depositLP.save();

}
*/
