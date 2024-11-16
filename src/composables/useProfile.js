import { storeToRefs } from "pinia";
import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { usePrepare } from "./prepare.js";
import { useAccountStore } from "../store/account.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
const { isAddress, formatToNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readSographContract } = useReadSographContract();
const prepare = usePrepare();

export const useProfile = () => {
  async function getProfile(profile) {
    try {
      const { account } = storeToRefs(useAccountStore());
      if (!isAddress(profile)) {
        const address = await readSographContract("ownerOfHandle", [profile]);
        if (address == "0x0000000000000000000000000000000000000000")
          return { success: false, message: "profile address not found" };
        profile = address;
      }
      const [profileId, role, postLength] = await readSographContract(
        "getUserByAddress",
        [profile]
      );
      const profileInfo = await readProfileContract("getProfileById", [
        formatToNumber(profileId),
      ]);
      const data = await prepare.profile(profileInfo);
      if (!data) return { success: false, message: "" };
      data.id = formatToNumber(profileId);
      data.role = formatToNumber(role);
      data.postLength = formatToNumber(postLength);
      data.owner = profile;
      if (account.value.isConnected && account.value.hasAccount) {
        const [ownerId] = await readSographContract("getUserByAddress", [
          account.value.wallet,
        ]);
        const followInfo = await readProfileContract("getFollowInfo", [
          formatToNumber(ownerId),
          formatToNumber(profileId),
        ]);
        Object.assign(data, {
          isFollowing: followInfo[1],
          isFollower: followInfo[0],
        });
      }
      return { success: true, data };
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          return {
            success: false,
            message: revertError.data?.errorName ?? "",
          };
        }
      }
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getProfile };
};
