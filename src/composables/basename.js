import {
  createPublicClient,
  encodePacked,
  http,
  keccak256,
  namehash,
} from "viem";
import { base, mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { abi, contract } from "../contracts/L2Resolver.js";

export const useBasename = () => {
  const client = createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org"),
  });

  function buildBasenameTextRecordContract(basename, key) {
    return {
      abi: abi,
      address: contract,
      args: [namehash(basename), key],
      functionName: "text",
    };
  }

  async function getBasenameTextRecord(basename, key) {
    try {
      const contractParameters = buildBasenameTextRecordContract(basename, key);
      const textRecord = await client.readContract(contractParameters);
      return textRecord;
    } catch (error) {}
  }

  async function getBasenameTextRecords(basename) {
    try {
      const readContracts = textRecordsKeysEnabled.map((key) =>
        buildBasenameTextRecordContract(basename, key)
      );
      const textRecords = await client.multicall({
        contracts: readContracts,
      });

      return textRecords;
    } catch (error) {}
  }

  const convertChainIdToCoinType = (chainId) => {
    if (chainId === mainnet.id) {
      return "addr";
    }

    const cointype = (0x80000000 | chainId) >>> 0;
    return cointype.toString(16).toLocaleUpperCase();
  };

  const convertReverseNodeToBytes = (address, chainId) => {
    const addressFormatted = address.toLocaleLowerCase();
    const addressNode = keccak256(addressFormatted.substring(2));
    const chainCoinType = convertChainIdToCoinType(chainId);
    const baseReverseNode = namehash(
      `${chainCoinType.toLocaleUpperCase()}.reverse`
    );
    const addressReverseNode = keccak256(
      encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
    );
    return addressReverseNode;
  };

  async function getBasename(address) {
    try {
      const addressReverseNode = convertReverseNodeToBytes(address, base.id);
      const basename = await client.readContract({
        abi: abi,
        address: contract,
        functionName: "name",
        args: [addressReverseNode],
      });
      if (basename) {
        return basename;
      }
    } catch (error) {}
  }

  async function getBasenameAvatar(basename) {
    const avatar = await client.getEnsAvatar({
      name: basename,
      universalResolverAddress: contract,
    });
    return avatar;
  }

  async function getBasenameAddress(basename) {
    const address = await client.getEnsAddress({
      name: normalize(basename),
      universalResolverAddress: contract,
    });
    return address;
  }

  return {
    getBasename,
    getBasenameAvatar,
    getBasenameAddress,
    getBasenameTextRecord,
    getBasenameTextRecords,
  };
};
