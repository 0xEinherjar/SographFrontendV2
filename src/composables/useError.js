import { useUtils } from "./utils";
import { BaseError, ContractFunctionRevertedError } from "viem";

export const useError = () => {
  async function formatErrorContract(error) {
    if (error instanceof BaseError) {
      const revertError = error.walk(
        (err) => err instanceof ContractFunctionRevertedError
      );
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.args[0] ?? "";
        if (errorName) return errorName;
      }
    }
    return null;
  }
  return { formatErrorContract };
};
