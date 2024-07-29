import { ethers, Contract, isError, Block, toBigInt } from "ethers";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
import { useModeratorStore } from "../store/moderator.js";
import voteAbi from "../json/Votting.json";
import Blockchain from "./blockchain.js";
const { formatToNumber } = useUtils();

export default class Vote {
  static address;
  static voteContract;
  static profileContract;
  static provider;
  static rpc = "https://sepolia.base.org";

  async init(window) {
    if (window.ethereum == null) {
      Vote.provider = new ethers.JsonRpcProvider(Vote.rpc);
    } else if (window.ethereum && window.ethereum.chainId != "0x14a34") {
      Vote.provider = new ethers.JsonRpcProvider(Vote.rpc);
    } else {
      Vote.provider = new ethers.BrowserProvider(window.ethereum);
    }
    Vote.voteContract = new Contract(
      voteAbi.address,
      voteAbi.abi,
      Vote.provider
    );
    Vote.address = voteAbi.address;
  }

  async createAssessment({ profile, reason }) {
    try {
      const signer = await Vote.provider.getSigner();
      const transaction = await Vote.voteContract
        .connect(signer)
        .createAssessment(profile, reason);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async stake({ amount }) {
    try {
      const signer = await Vote.provider.getSigner();
      const transaction = await Vote.voteContract.connect(signer).stake(amount);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      console.log(error);
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async withdraw({ amount }) {
    try {
      const signer = await Vote.provider.getSigner();
      const transaction = await Vote.voteContract
        .connect(signer)
        .withdraw(amount);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async executeAssessment({ id }) {
    try {
      const signer = await Vote.provider.getSigner();
      const transaction = await Vote.voteContract
        .connect(signer)
        .executeAssessment(id);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      console.log(error);
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async vote({ id, option }) {
    try {
      const signer = await Vote.provider.getSigner();
      const transaction = await Vote.voteContract
        .connect(signer)
        .vote(id, option);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async getAssessments() {
    try {
      const transaction = await Vote.voteContract.fetchAllAssessment();
      if (transaction[0].length == 0) return { data: [], success: true };

      const blockchain = new Blockchain();
      const data = [];
      for (const item of transaction) {
        if (item[6] && formatToNumber(item[7]) == 4) {
          data.push({
            id: formatToNumber(item[0]),
            voteEnd: formatToNumber(item[1]),
            voteStart: formatToNumber(item[2]),
            reason: item[3],
            proposer: item[4],
            profile: item[5],
            executed: item[6],
            state: formatToNumber(item[7]),
            profileAvatar: null,
            profileName: item[5],
            profileHandle: null,
          });
        } else {
          const { data: profile, success } = await blockchain.getProfile(
            item[5]
          );
          if (!success) continue;
          data.push({
            id: formatToNumber(item[0]),
            voteEnd: formatToNumber(item[1]),
            voteStart: formatToNumber(item[2]),
            reason: item[3],
            proposer: item[4],
            profile: item[5],
            executed: item[6],
            state: formatToNumber(item[7]),
            profileAvatar: profile.avatar,
            profileName: profile.name,
            profileHandle: profile.handle,
          });
        }
      }
      return { success: true, data: data.reverse() };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async getMinParticipation() {
    try {
      const transaction = await Vote.voteContract.minParticipation();
      return { success: true, data: formatToNumber(transaction) };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async getParticipant() {
    try {
      const moderatorStore = useModeratorStore();
      const { moderator } = storeToRefs(moderatorStore);
      const transaction = await Vote.voteContract.participants(
        moderator.value.wallet
      );
      const data = {
        isActive: transaction[0],
        balance: formatToNumber(transaction[1]),
      };
      return { success: true, data: data };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }
  async state({ id }) {
    try {
      const transaction = await Vote.voteContract.state(id);
      console.log(transaction);
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }
}
