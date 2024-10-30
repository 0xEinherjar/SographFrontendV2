import { storeToRefs } from "pinia";
import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract.js";
import { useReadPostContract } from "./useReadPostContract.js";
import { usePrepare } from "./prepare.js";
import { useAccountStore } from "../store/account.js";
const { formatToNumber } = useUtils();
const { readSographContract } = useReadSographContract();
const { readPostContract } = useReadPostContract();
const prepare = usePrepare();

export const usePublication = () => {
  async function getPublication(user, cursor, size) {
    try {
      const { account } = storeToRefs(useAccountStore());
      const [publications, newCursor] = await readSographContract(
        "getPublicationsByUser",
        [user, cursor, size]
      );
      if (publications.length == 0) return { data: [], cursor: 0 };
      let data = await prepare.post(publications);
      if (account.value.isConnected && account.value.hasAccount) {
        data.map(async (item) => {
          const hasLiked = await readPostContract("hasLiked", [
            item.id,
            account.value.wallet,
          ]);
          return Object.assign(item, { hasLiked: hasLiked });
        });
      }
      return { success: true, data: data, cursor: formatToNumber(newCursor) };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "",
      };
    }
  }

  return { getPublication };
};
