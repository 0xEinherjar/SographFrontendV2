import { storeToRefs } from "pinia";
import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { usePrepare } from "./prepare.js";
const { formatToNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readSographContract } = useReadSographContract();
const prepare = usePrepare();

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
      for (const followerId of followersId) {
        const profile = await readProfileContract("getProfileById", [
          formatToNumber(followerId),
        ]);
        const data = await prepare.profile(profile);
        const owner = await readSographContract("addressByProfileId", [
          formatToNumber(followerId),
        ]);
        if (account.value.isConnected && account.value.hasAccount) {
          const followInfo = await readProfileContract("getFollowInfo", [
            user.value.id,
            formatToNumber(followerId),
          ]);
          Object.assign(data, {
            isFollowing: followInfo[0],
            isFollower: followInfo[1],
          });
        }
        profiles.push(Object.assign(data, { owner: owner }));
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
          if (errorName) return { success: false, message: errorName };
        }
      }
      return { success: false, message: "" };
    }
  }

  return { getFollow };
};
