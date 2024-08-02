export const useMetamask = () => {
  const chainBNB = "0x61";

  function isMetaMask() {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  function isBNB() {
    return window.ethereum.chainId === chainBNB;
  }

  function isConnected() {
    return Boolean(window.ethereum.selectedAddress);
  }

  async function getAccount() {
    const account = (
      await window.ethereum.request({ method: "eth_requestAccounts" })
    )[0];
    if (!account) return null;
    return account;
  }

  async function connect() {
    if (!isMetaMask()) return null;
    const address = (
      await window.ethereum.request({ method: "eth_requestAccounts" })
    )[0];
    if (!address) return null;
    if (!isBNB()) {
      const result = await changeChain();
      if (!result) return null;
    }
    return address;
  }

  async function changeChain(id = chainBNB) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: id }],
      });
      return true;
    } catch (error) {
      console.log(error.code);
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: id,
                chainName: "BNB Testnet",
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                nativeCurrency: {
                  name: "tBNB",
                  symbol: "tBNB",
                  decimals: 18,
                },
              },
            ],
          });
          return true;
        } catch (_) {
          return false;
        }
      }
    }
  }

  return { isBNB, getAccount, isMetaMask, isConnected, changeChain, connect };
};
