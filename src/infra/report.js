import { ethers, Contract, isError } from "ethers";
import votingAbi from "../contracts/Voting.json";

export default class Report {
  static contract;
  static provider;
  static rpc = "https://sepolia.base.org";

  async init() {
    Report.provider = new ethers.JsonRpcProvider(Report.rpc);
    Report.contract = this._getContract(votingAbi);
  }

  setProvider(provider) {
    Report.provider = new ethers.BrowserProvider(provider);
  }

  _getContract(abi) {
    return new Contract(abi.address, abi.abi, Report.provider);
  }

  async _executeContractMethod(contract, method, args = [], errorMessage = "") {
    try {
      const signer = await Report.provider.getSigner();
      const transaction = await contract.connect(signer)[method](...args);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      return this._handleError(error, errorMessage);
    }
  }

  _handleError(error, defaultMsg) {
    if (isError(error, "CALL_EXCEPTION")) {
      return { success: false, message: error.reason || defaultMsg };
    }
    return { success: false, message: defaultMsg };
  }

  async report(user, reason) {
    return this._executeContractMethod(
      Report.contract,
      "reportUser",
      [user, reason],
      ""
    );
  }
}
