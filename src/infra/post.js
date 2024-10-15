import { ethers, Contract, isError } from "ethers";
import { useUtils } from "../composables/utils.js";
import postAbi from "../contracts/PostNFT.json";
import profileAbi from "../contracts/ProfileNFT.json";
import sographAbi from "../contracts/Sograph.json";
const { formatToNumber } = useUtils();

export default class Post {
  static postContract;
  static profileContract;
  static sographContract;
  static provider;
  static hasClient = false;
  static rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  async init() {
    Post.provider = new ethers.JsonRpcProvider(Post.rpc);
    Post.postContract = this._getContract(postAbi);
    Post.profileContract = this._getContract(profileAbi);
    Post.sographContract = this._getContract(sographAbi);
  }

  hasClient() {
    Post.hasClient = true;
  }

  setProvider(provider) {
    Post.provider = new ethers.BrowserProvider(provider);
  }

  _getContract(abi) {
    return new Contract(abi.address, abi.abi, Post.provider);
  }

  async _executeContractMethod(contract, method, args = [], errorMessage = "") {
    try {
      const signer = await Post.provider.getSigner();
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

  async approve(id) {
    return this._executeContractMethod(
      Post.postContract,
      "approve",
      [sographAbi.address, id],
      "Error approving transaction"
    );
  }

  async comment(id, metadata) {
    return this._executeContractMethod(
      Post.sographContract,
      "comment",
      [id, metadata],
      "Error creating comment"
    );
  }
  async getComments(id, cursor, size) {
    try {
      const transaction = await Post.postContract.fetchComments(
        id,
        cursor,
        size
      );
      if (transaction[0].length == 0)
        return { success: true, data: [], cursor: 0 };
      const data = [];
      for (const item of transaction[0]) {
        const url = item[1];
        if (!url.startsWith("https://ipfs.io/ipfs/")) continue;
        const response = await fetch(url);
        const metadataPost = await response.json();
        const transaction2 = await Post.sographContract.getUserByAddress(
          item[0]
        );
        const profileId = formatToNumber(transaction2[0]);
        const transaction3 = await Post.profileContract.getProfileById(
          profileId
        );
        const profileUrl = transaction3[0];
        if (!profileUrl.startsWith("https://ipfs.io/ipfs/")) continue;
        const responseProfile = await fetch(profileUrl);
        const metadataProfile = await responseProfile.json();
        data.push({
          text: metadataPost.text,
          createdAt: metadataPost.created_at,
          authorName: metadataProfile.name,
          authorAvatar: metadataProfile.avatar,
          account: item[0],
        });
      }
      return {
        success: true,
        data: data,
        cursor: formatToNumber(transaction[1]),
      };
    } catch (error) {
      return this._handleError(error, "");
    }
  }
}
