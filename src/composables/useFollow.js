import { storeToRefs } from "pinia";
import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
const { formatToNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readSographContract } = useReadSographContract();

export const useFollow = () => {
  async function getFollow(type, id, cursor, size) {
    const nameFunction = {
      follower: "getFollowers",
      following: "getFollowings",
    };
    try {
      const { account } = storeToRefs(useAccountStore());
      const { user } = storeToRefs(useUserStore());
      const [followersId, newCursor] = await readProfileContract(
        nameFunction[type],
        [id, cursor, size]
      );
      if (!followersId.length) return { success: true, data: [], cursor: 0 };
      const profiles = [];
      if (account.value.isConnected && account.value.hasAccount) {
        for (let followerId of followersId) {
          followerId = formatToNumber(followerId);
          const profile = await readProfileContract("getProfileByIdToCaller", [
            user.value.id,
            followerId,
          ]);
          if (!String(profile.metadata).startsWith("https://ipfs.io/ipfs/"))
            continue;
          const metadata = await fetch(profile.metadata).then((response) =>
            response.json()
          );
          const owner = await readSographContract("addressByProfileId", [
            followerId,
          ]);
          profiles.push({
            avatar: metadata.avatar,
            name: metadata.name,
            handle: profile.handle,
            hasSubscription: profile.hasSubscription,
            owner: owner,
            isFollowing: profile.isFollowing,
            isFollower: profile.isFollower,
          });
        }
      } else {
        for (let followerId of followersId) {
          followerId = formatToNumber(followerId);
          const profile = await readProfileContract("getProfileById", [
            followerId,
          ]);
          if (!String(profile.metadata).startsWith("https://ipfs.io/ipfs/"))
            continue;
          const metadata = await fetch(profile.metadata).then((response) =>
            response.json()
          );
          const owner = await readSographContract("addressByProfileId", [
            followerId,
          ]);
          profiles.push({
            avatar: metadata.avatar,
            name: metadata.name,
            handle: profile.handle,
            hasSubscription: profile.hasSubscription,
            owner: owner,
          });
        }
      }
      return {
        success: true,
        data: profiles,
        cursor: formatToNumber(newCursor),
      };
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.args[0] ?? "";
          if (errorName) {
            return {
              success: false,
              message: "errorName",
            };
          }
        }
      }
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getFollow };
};
