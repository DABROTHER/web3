import Web3 from 'web3'
import { toast } from 'react-toastify'

import EthAbi from '@/contracts/ethereum/abi.json'
import PolyAbi from '@/contracts/polygon/abi.json'
import EthNFTAbi from '@/contracts/ethereum/nft/abi.json'
import PolyNFTAbi from '@/contracts/polygon/nft/abi.json'

const ethAddress = process.env.ETHEREUM_CONTRACT_ADDRESS
const polyAddress = process.env.POLYGON_CONTRACT_ADDRESS
const EthNFTAddress = process.env.ETHEREUM_NFT_ADRRESS
const PolyNFTAddress = process.env.POLYGON_NFT_ADDRESS

const polygon_chainId = process.env.POLYGON_CHAIN_ID
const ethereum_chainId = process.env.ETHEREUM_CHAIN_ID

export const EnableWeb3 = () => {
  if (!window.ethereum && window.ethereum.isMetaMask)
    return toast.info('Make sure you have Installed Metamask Wallet!!')

  if (window.ethereum) {
    // window.ethereum.request({
    //   method: 'eth_requestAccounts',
    // });
    const web3 = new Web3(window.ethereum)
    return { web3 }
  } else {
    // const provider = new Web3.providers.HttpProvider(w3URL);
    const web3 = new Web3(Web3.givenProvider)
    return { web3 }
  }
}
const { web3 } = EnableWeb3()

export const EnableMetaMask = async () => {
  if (!window.ethereum && window.ethereum.isMetaMask)
    return toast.info('Make sure you have Installed Metamask Wallet!!')

  const getAccount = await window.ethereum.request({
    method: 'eth_requestAccounts',
  })
  return getAccount[0]
}

export const IsConnected = async () =>
  typeof window !== 'undefined' && (await window.ethereum.isConnected())

export const NetworkVersion = () =>
  typeof window !== 'undefined' && window.ethereum.networkVersion

export const WalletAddress = async () => {
  const walletAddress = await web3.eth.getAccounts()
  return walletAddress[0]
}

export const WalletBalance = async (walletAddress) =>
  await web3.eth.getBalance(walletAddress)

export const NetworkId = async () => await web3.eth.net.getId()

export const GetChainId = async () => await web3.eth.getChainId()

export const Sign = async (nonce, walletAddress) =>
  await web3.eth.personal.sign(nonce, walletAddress, '')

export const CurrentBlockNumber = async () => await web3.eth.getBlockNumber()

export const WeiToEth = async (amountInWei) =>
  await web3.utils.fromWei(amountInWei, 'ether')

export const EthToWei = async (amountInEth) =>
  await web3.utils.toWei(amountInEth, 'ether')

export const SwitchNetwork = async (chainId) => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: web3.utils.toHex(chainId) }],
  })
}

export const AddTokenInMetamask = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
) => {
  /** -:> example <:-
     tokenAddress="<token address>";
     tokenSymbol = 'AGOV';
     tokenDecimals=18;
   */
  const addedToken = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: tokenAddress, // The address that the token is at.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: tokenDecimals, // The number of decimals in the token
      },
    },
  })
  return addedToken
}

export const AddNetworkInMetamask = async (
  chainId,
  chainName,
  rpcUrls,
  nativeCurrency,
) => {
  const addedNetwork = await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: web3.utils.toHex(chainId),
        chainName: chainName,
        rpcUrls: [rpcUrls],
        nativeCurrency: nativeCurrency,
      },
    ],
  })
  return addedNetwork
}

export const ContractsCalling = (networkVersion) => {
  if (networkVersion === ethereum_chainId) {
    const EthereumContract = new web3.eth.Contract(EthAbi, ethAddress)
    return EthereumContract
  } else if (networkVersion === polygon_chainId) {
    const PolygonContract = new web3.eth.Contract(PolyAbi, polyAddress)
    return PolygonContract
  }
  // const EthereumContract = new web3.eth.Contract(EthAbi, ethAddress)
  // const EthereumNFTContract = new web3.eth.Contract(EthNFTAbi, EthNFTAddress)

  // const PolygonContract = new web3.eth.Contract(PolyAbi, polyAddress)
  // const PolygonNFTContract = new web3.eth.Contract(PolyNFTAbi, PolyNFTAddress)

  // return {
  //   EthereumContract,
  //   EthereumNFTContract,
  //   PolygonContract,
  //   PolygonNFTContract,
  // }
}

export const NftContractCalling = (networkVersion) => {
  if (networkVersion === ethereum_chainId) {
    const EthereumNFTContract = new web3.eth.Contract(EthNFTAbi, EthNFTAddress)
    return EthereumNFTContract
  } else if (networkVersion === polygon_chainId) {
    const PolygonNFTContract = new web3.eth.Contract(PolyNFTAbi, PolyNFTAddress)
    return PolygonNFTContract
  }
}

export const DynamicContract = async (contractAddress, networkVersion) => {
  if (networkVersion === ethereum_chainId) {
    const contractEthereum = new web3.eth.Contract(EthNFTAbi, contractAddress)
    return contractEthereum
  } else if (networkVersion === polygon_chainId) {
    const contractPolygon = new web3.eth.Contract(PolyNFTAbi, contractAddress)
    return contractPolygon
  }
}
