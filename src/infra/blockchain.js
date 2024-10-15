import { ethers, Contract, isError, Block } from "ethers";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
import { usePrepare } from "../composables/prepare.js";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import sographAbi from "../contracts/Sograph.json";
import profileAbi from "../contracts/ProfileNFT.json";
import tokenAbi from "../contracts/Token.json";
const { formatToNumber, isAddress } = useUtils();

export default class Blockchain {
  static profileContract;
  static sographContract;
  static tokenContract;
  static provider;
  static hasClient = false;
  static rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  async init() {
    Blockchain.provider = new ethers.JsonRpcProvider(Blockchain.rpc);

    Blockchain.sographContract = this._getContract(sographAbi);
    Blockchain.profileContract = this._getContract(profileAbi);
    Blockchain.tokenContract = this._getContract(tokenAbi);
  }

  hasClient() {
    Blockchain.hasClient = true;
  }

  setProvider(provider) {
    Blockchain.provider = new ethers.BrowserProvider(provider);
  }

  _getContract(abi) {
    return new Contract(abi.address, abi.abi, Blockchain.provider);
  }

  async _executeContractMethod(contract, method, args = [], errorMessage = "") {
    try {
      const signer = await Blockchain.provider.getSigner();
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

  async createProfile(metadata) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "createProfile",
      [metadata],
      "Error creating profile"
    );
  }

  async update(metadata) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "updateProfile",
      [metadata],
      "Error updating profile"
    );
  }

  async like(id) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "like",
      [id],
      "Error liking post"
    );
  }

  async share(id) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "share",
      [id],
      "Error sharing post"
    );
  }

  async unshare(id) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "unshare",
      [id],
      "Error unsharing post"
    );
  }

  async createPost(metadata) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "createPost",
      [metadata],
      "Error creating post"
    );
  }

  async follow(address) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "follow",
      [address],
      "Error following user"
    );
  }

  async unfollow(address) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "unfollow",
      [address],
      "Error unfollowing user"
    );
  }

  async redeemProfile() {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "redeemProfile",
      [],
      "Error redeeming profile"
    );
  }

  async redeemPost(id) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "redeemPost",
      [id],
      "Error redeeming post"
    );
  }

  async approve(id) {
    return this._executeContractMethod(
      Blockchain.profileContract,
      "approve",
      [sographAbi.address, id],
      "Error approving transaction"
    );
  }

  async reactivateProfile(id) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "reactivateProfile",
      [id],
      "Error reactivating profile"
    );
  }

  async updateHandle(handle) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "updateHandle",
      [handle],
      "Error"
    );
  }

  async subscription(id, period) {
    return this._executeContractMethod(
      Blockchain.profileContract,
      "subscription",
      [id, period],
      "Error subscription profile"
    );
  }

  async reactivatePost(id) {
    return this._executeContractMethod(
      Blockchain.sographContract,
      "reactivatePost",
      [id],
      "Error reactivate post"
    );
  }

  async getProfile(profile) {
    const accountStore = useAccountStore();
    const { account } = storeToRefs(accountStore);
    const prepare = usePrepare();
    try {
      if (!isAddress(profile)) {
        const address = await Blockchain.sographContract.ownerOfHandle(profile);
        if (address == "0x0000000000000000000000000000000000000000")
          return { success: false, message: "profile address not found" };
        profile = address;
      }
      if (
        account.value.isConnected &&
        account.value.hasAccount &&
        Blockchain.hasClient
      ) {
        const signer = await Blockchain.provider.getSigner();
        const transaction = await Blockchain.sographContract.getUserByAddress(
          profile
        );
        const transaction1 = await Blockchain.sographContract.getUserByAddress(
          account.value.wallet
        );
        const transactionProfile = await Blockchain.profileContract
          .connect(signer)
          .getProfileByIdToCaller(
            formatToNumber(transaction1[0]),
            formatToNumber(transaction[0])
          );
        const data = await prepare.profileToCaller(transactionProfile);
        data.id = formatToNumber(transaction[0]);
        data.role = formatToNumber(transaction[1]);
        data.owner = profile;

        if (!data) return { success: false, message: "" };
        return { success: true, data };
      } else {
        const transaction = await Blockchain.sographContract.getUserByAddress(
          profile
        );
        const transactionProfile =
          await Blockchain.profileContract.getProfileById(
            formatToNumber(transaction[0])
          );
        const data = await prepare.profile(transactionProfile);
        if (!data) return { success: false, message: "" };
        data.id = formatToNumber(transaction[0]);
        data.role = formatToNumber(transaction[1]);
        data.owner = profile;
        return { success: true, data };
      }
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        if (error.reason == "profile banned") {
          return {
            success: false,
            message: "BANNED",
          };
        }
        if (error.reason == "user not found") {
          return {
            success: false,
            message: "NOT_FOUND",
          };
        }
        return {
          success: false,
          message: "",
        };
      }
      return { success: false, message: "" };
    }
  }
  async getPost(user, cursor, size) {
    try {
      const accountStore = useAccountStore();
      const { account } = storeToRefs(accountStore);
      const prepare = usePrepare();
      if (
        account.value.isConnected &&
        account.value.hasAccount &&
        Blockchain.hasClient
      ) {
        const signer = await Blockchain.provider.getSigner();
        const transaction = await Blockchain.sographContract
          .connect(signer)
          .getPublicationsByUserToCaller(user, cursor, size);
        if (transaction[0].length == 0) return { data: [], cursor: 0 };
        const data = await prepare.postToCaller(transaction[0]);
        return { data: data, cursor: formatToNumber(transaction[1]) };
      } else {
        const transaction =
          await Blockchain.sographContract.getPublicationsByUser(
            user,
            cursor,
            size
          );
        if (transaction[0].length == 0) return { data: [], cursor: 0 };
        const data = await prepare.post(transaction[0]);
        return { data: data, cursor: formatToNumber(transaction[1]) };
      }
    } catch (error) {
      return this._handleError(error, "");
    }
  }

  async getFollowers(id, cursor, size) {
    try {
      const accountStore = useAccountStore();
      const userStore = useUserStore();
      const { account } = storeToRefs(accountStore);
      const { user } = storeToRefs(userStore);
      const transaction = await Blockchain.profileContract.getFollowers(
        id,
        cursor,
        size
      );
      if (!transaction[0].length) return { success: true, data: [], cursor: 0 };
      const profiles = [];
      if (
        account.value.isConnected &&
        account.value.hasAccount &&
        Blockchain.hasClient
      ) {
        for (const follwerId of transaction[0]) {
          let _id = formatToNumber(follwerId);
          const profile =
            await Blockchain.profileContract.getProfileByIdToCaller(
              user.value.id,
              _id
            );
          if (!String(profile[0]).startsWith("https://ipfs.io/ipfs/")) continue;
          const metadata = await fetch(profile[0]).then((response) =>
            response.json()
          );
          const owner = await Blockchain.sographContract.addressByProfileId(
            _id
          );

          profiles.push({
            avatar: metadata.avatar,
            name: metadata.name,
            handle: profile[1],
            hasSubscription: profile[4],
            owner: owner,
            isFollowing: profile[5],
            isFollower: profile[6],
          });
        }
      } else {
        for (const follwerId of transaction[0]) {
          let _id = String(follwerId).replace(/n/i, "");
          const profile = await Blockchain.profileContract.getProfileById(_id);
          if (!String(profile[0]).startsWith("https://ipfs.io/ipfs/")) continue;
          const metadata = await fetch(profile[0]).then((response) =>
            response.json()
          );
          const owner = await Blockchain.sographContract.addressByProfileId(
            _id
          );
          profiles.push({
            avatar: metadata.avatar,
            name: metadata.name,
            handle: profile[1],
            hasSubscription: profile[4],
            owner: owner,
          });
        }
      }

      return {
        success: true,
        data: profiles,
        cursor: formatToNumber(transaction[1]),
      };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async getFollowings(id, cursor, size) {
    try {
      const accountStore = useAccountStore();
      const userStore = useUserStore();
      const { account } = storeToRefs(accountStore);
      const { user } = storeToRefs(userStore);
      const transaction = await Blockchain.profileContract.getFollowings(
        id,
        cursor,
        size
      );
      if (!transaction[0].length) return { success: true, data: [], cursor: 0 };
      const profiles = [];
      if (
        account.value.isConnected &&
        account.value.hasAccount &&
        Blockchain.hasClient
      ) {
        for (const follwerId of transaction[0]) {
          let _id = formatToNumber(follwerId);
          const profile =
            await Blockchain.profileContract.getProfileByIdToCaller(
              user.value.id,
              _id
            );
          if (!String(profile[0]).startsWith("https://ipfs.io/ipfs/")) continue;

          const metadata = await fetch(profile[0]).then((response) =>
            response.json()
          );
          const owner = await Blockchain.sographContract.addressByProfileId(
            _id
          );

          profiles.push({
            avatar: metadata.avatar,
            name: metadata.name,
            handle: profile[1],
            hasSubscription: profile[4],
            owner: owner,
            isFollowing: profile[5],
            isFollower: profile[6],
          });
        }
      } else {
        for (const follwerId of transaction[0]) {
          let _id = String(follwerId).replace(/n/i, "");
          const profile = await Blockchain.profileContract.getProfileById(_id);
          if (!String(profile[0]).startsWith("https://ipfs.io/ipfs/")) continue;

          const metadata = await fetch(profile[0]).then((response) =>
            response.json()
          );

          const owner = await Blockchain.sographContract.addressByProfileId(
            _id
          );

          profiles.push({
            avatar: metadata.avatar,
            name: metadata.name,
            handle: profile[1],
            hasSubscription: profile[4],
            owner: owner,
          });
        }
      }
      return {
        success: true,
        data: profiles,
        cursor: formatToNumber(transaction[1]),
      };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async getPostFollowings(id) {
    try {
      const follwersId = await Blockchain.profileContract.getFollowings(
        id,
        0,
        20
      );
      const publications = [];
      for (const follwerId of follwersId[0]) {
        let _id = String(follwerId).replace(/n/i, "");
        const owner = await Blockchain.sographContract.addressByProfileId(_id);
        const { data } = await this.getPost(owner, 0, 20);
        publications.push(...data);
      }
      return { success: true, data: publications.reverse() };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async approveToken(value) {
    try {
      const accountStore = useAccountStore();
      const { account } = storeToRefs(accountStore);
      const transactionAllowance = await Blockchain.tokenContract.allowance(
        profileAbi.address,
        account.value.wallet
      );
      if (formatToNumber(transactionAllowance) < value) {
        const decimals = await Blockchain.tokenContract.decimals();
        const signer = await Blockchain.provider.getSigner();
        const transaction = await Blockchain.tokenContract
          .connect(signer)
          .approve(profileAbi.address, value * 10 ** formatToNumber(decimals));
        await transaction.wait();
      }
      return { success: true };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }

  async getPriceSubscription() {
    const transaction = await Blockchain.profileContract.fees();
    const transactionToken = await Blockchain.tokenContract.decimals();
    return (
      formatToNumber(transaction[2]) / 10 ** formatToNumber(transactionToken)
    );
  }

  async isHandleAvailable(handle) {
    try {
      const transaction = await Blockchain.sographContract.ownerOfHandle(
        handle
      );
      let isAvailable;
      if (String(transaction) == "0x0000000000000000000000000000000000000000") {
        isAvailable = true;
      } else {
        isAvailable = false;
      }
      return { success: true, isAvailable };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        return { success: false, message: error.reason };
      }
      return { success: false, message: "" };
    }
  }
}
