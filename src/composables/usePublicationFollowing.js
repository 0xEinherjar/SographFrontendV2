import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { usePublication } from "./usePublication.js";
const { formatToNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readSographContract } = useReadSographContract();
const { getPublication } = usePublication();

export const usePublicationFollowing = () => {
  async function getPublicationFollowing(id, cursor, size) {
    try {
      const [followings, newCursor] = await readProfileContract(
        "getFollowings",
        [id, 100, 20]
      );
      const publications = [];
      for (let following of followings) {
        following = formatToNumber(following);
        const address = await readSographContract("addressByProfileId", [
          following,
        ]);
        const { success, data } = await getPublication(address, 50, 10);
        if (!success) continue;
        publications.push(...data);
      }
      return { success: true, data: publications.reverse() };
    } catch (error) {
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getPublicationFollowing };
};
