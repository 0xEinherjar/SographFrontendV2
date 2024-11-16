import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { usePublication } from "./usePublication.js";
import { usePublicClient } from "./usePublicClient.js";
import { abi, contract } from "../contracts/Sograph.js";
import {
  abi as abiPost,
  contract as contractPost,
} from "../contracts/PostNFT.js";
import { usePrepare } from "./prepare.js";
import { useAccountStore } from "../store/account.js";
import { storeToRefs } from "pinia";
import { useReadPostContract } from "./useReadPostContract.js";
import { useProfile } from "./useProfile.js";
const { formatToNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readSographContract } = useReadSographContract();
const { readPostContract } = useReadPostContract();
const { getPublication } = usePublication();
const { client } = usePublicClient();
const prepare = usePrepare();
const { getProfile } = useProfile();

export const usePublicationFollowing = () => {
  let data = [];
  async function getPublicationFollowing(id, cursor) {
    try {
      const publications = [];
      let followCursor = 0;
      const { account } = storeToRefs(useAccountStore());
      followCursor = cursor;

      if (followCursor != 0) {
        const [followings, newCursor] = await readProfileContract(
          "getFollowings",
          [id, cursor, 20]
        );
        followCursor = formatToNumber(newCursor);
        if (followings.length == 0) return { data: [], hasPublication: false };

        for (let following of followings) {
          data.push({
            id: formatToNumber(following),
          });
        }

        let addressResults = await client.multicall({
          contracts: [
            ...data.map((item) => ({
              abi: abi,
              address: contract,
              functionName: "addressByProfileId",
              args: [item.id],
            })),
          ],
        });

        for (const index in addressResults) {
          data[index].status = addressResults[index].status;
          data[index].address = addressResults[index].result;
        }
        data = data.filter((item) => item.status == "success");

        let userResults = await client.multicall({
          contracts: [
            ...data.map((item) => ({
              abi: abi,
              address: contract,
              functionName: "getUserByAddress",
              args: [item.address],
            })),
          ],
        });

        for (const index in userResults) {
          data[index].status = userResults[index].status;
          data[index].cursor = formatToNumber(userResults[index].result[2]);
        }
        data = data.filter((item) => item.status == "success");
      }

      let publicationsResults = await client.multicall({
        contracts: [
          ...data.map((item) => ({
            abi: abi,
            address: contract,
            functionName: "getPublicationsByUser",
            args: [item.address, item.cursor, 1],
          })),
        ],
      });
      for (const index in publicationsResults) {
        data[index].status = publicationsResults[index].status;
        data[index].cursor = formatToNumber(
          publicationsResults[index].result[1]
        );
        data[index].post = publicationsResults[index].result[0];
      }
      data = data.filter((item) => {
        return item.status == "success" && item.post.length > 0;
      });
      for (const item of data) {
        const [result] = await prepare.post(item.post);
        if (result.owner != item.address) {
          const { success, data: profileInfo } = await getProfile(item.address);
          console.log(profileInfo);
          if (success) {
            result.userRepostName = profileInfo.name;
            result.userRepostPath = profileInfo.handle
              ? profileInfo.handle
              : item.address;
          }
        }
        publications.push(result);
      }

      if (account.value.isConnected && account.value.hasAccount) {
        let hasLikedResults = await client.multicall({
          contracts: [
            ...publications.map((item) => ({
              abi: abiPost,
              address: contractPost,
              functionName: "hasLiked",
              args: [item.id, account.value.wallet],
            })),
          ],
        });
        for (const index in hasLikedResults) {
          publications[index].hasLiked =
            publicationsResults[index].status == "success"
              ? hasLikedResults[index].result
              : false;
        }
      }

      data = data.filter((item) => item.cursor > 0);

      return {
        success: true,
        data: publications,
        hasContent: data.length > 0 || followCursor > 0,
        newCursor: followCursor,
      };
    } catch (error) {
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getPublicationFollowing };
};
