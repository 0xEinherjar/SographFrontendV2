import { ethers, Contract, isError, Block } from "ethers";
import { useUtils } from "../composables/utils.js";
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
}
