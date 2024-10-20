import { storeToRefs } from "pinia";
import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { usePrepare2 } from "./prepare.js";
import { useAccountStore } from "../store/account.js";
const { formatToNumber } = useUtils();
const { readSographContract } = useReadSographContract();
const prepare = usePrepare2();

export const usePublication = () => {
  async function getPublication(user, cursor, size) {
    try {
      const { account } = storeToRefs(useAccountStore());
      if (account.value.isConnected && account.value.hasAccount) {
        const [publications, newCursor] = await readSographContract(
          "getPublicationsByUserToCaller",
          [user, cursor, size],
          account.value.wallet
        );
        if (publications.length == 0) return { data: [], cursor: 0 };
        const data = await prepare.postToCaller(publications);
        return { success: true, data: data, cursor: formatToNumber(newCursor) };
      } else {
        const [publications, newCursor] = await readSographContract(
          "getPublicationsByUser",
          [user, cursor, size]
        );
        if (publications.length == 0) return { data: [], cursor: 0 };
        const data = await prepare.postToCaller(publications);
        return { success: true, data: data, cursor: formatToNumber(newCursor) };
      }
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
