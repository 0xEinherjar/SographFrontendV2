import {
  abi as tokenAbi,
  contract as tokenContract,
} from "../contracts/Token.js";
import {
  abi as profileAbi,
  contract as profileContract,
} from "../contracts/ProfileNFT.js";
import { usePublicClient } from "./usePublicClient.js";
import { useUtils } from "./utils.js";
const { client } = usePublicClient();
const { formatToNumber } = useUtils();

export const useSubscriptionInfo = () => {
  async function getSubscriptionInfo() {
    const results = await client.multicall({
      contracts: [
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "decimals",
        },
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "name",
        },
        {
          abi: profileAbi,
          address: profileContract,
          functionName: "fees",
        },
      ],
    });
    for (const result of results) {
      if (result.status == "failure") return null;
    }
    return {
      decimals: results[0].result,
      currency: results[1].result,
      price: formatToNumber(results[2].result[2]),
      priceFormated:
        formatToNumber(results[2].result[2]) / 10 ** results[0].result,
    };
  }
  return { getSubscriptionInfo };
};
