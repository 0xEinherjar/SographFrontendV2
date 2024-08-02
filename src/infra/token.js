import { ethers, Contract, isError, Block } from "ethers";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
import { useModeratorStore } from "../store/moderator.js";
import tokenAbi from "../json/Token.json";
const { formatToNumber } = useUtils();

export default class Token {
  static tokenContract;
  static provider;
  static rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  async init(window) {
    if (window.ethereum == null) {
      Token.provider = new ethers.JsonRpcProvider(Token.rpc);
    } else {
      Token.provider = new ethers.BrowserProvider(window.ethereum);
    }

    Token.tokenContract = new Contract(
      tokenAbi.address,
      tokenAbi.abi,
      Token.provider
    );
  }

  async decimals() {
    try {
      const transaction = await Token.tokenContract.decimals();
      return { success: true, data: formatToNumber(transaction) };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async approve({ address, amount }) {
    try {
      const signer = await Token.provider.getSigner();
      const transaction = await Token.tokenContract
        .connect(signer)
        .approve(address, amount);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async faucet(amount = 2000) {
    try {
      const signer = await Token.provider.getSigner();
      const transaction = await Token.tokenContract
        .connect(signer)
        .mint(amount);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async balanceOfParticipant() {
    try {
      const moderatorStore = useModeratorStore();
      const { moderator } = storeToRefs(moderatorStore);
      const transaction = await Token.tokenContract.balanceOf(
        moderator.value.wallet
      );
      const result = formatToNumber(transaction);
      const decimalTransaction = await this.decimals();
      const data = result / 10 ** decimalTransaction.data;
      return { success: true, data: data };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }
}
