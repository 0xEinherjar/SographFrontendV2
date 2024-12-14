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
  async function getSubscriptionInfo(owner) {
    const results = await client.multicall({
      contracts: [
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "decimals",
        },
        {
          abi: profileAbi,
          address: profileContract,
          functionName: "fees",
        },
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "balanceOf",
          args: [owner],
        },
        // {
        //   abi: tokenAbi,
        //   address: tokenContract,
        //   functionName: "name",
        // },
      ],
    });
    for (const result of results) {
      if (result.status == "failure") return null;
    }
    return {
      decimals: results[0].result,
      currency: "Bitcoin BEP20",
      price: formatToNumber(results[1].result[1]),
      priceFormated:
        formatToNumber(results[1].result[2]) / 10 ** results[0].result,
      hasEnoughBalance: results[2].result >= results[1].result[2],
    };
  }
  return { getSubscriptionInfo };
};
