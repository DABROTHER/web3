import {
  NetworkVersion,
  ContractsCalling,
  CurrentBlockNumber,
  DynamicContract,
} from '@/services/web3-services'

// const polygon_chainId = process.env.POLYGON_CHAIN_ID
const ethereum_chainId = process.env.ETHEREUM_CHAIN_ID

export const CollectionCreatedEvents = async (walletAddress) => {
  const networkVersion = NetworkVersion()
  const contracts = ContractsCalling(networkVersion)
  let tokens = []
  try {
    let currentBlockNumber = await CurrentBlockNumber()
    let startingBlock = 29165450 // starting polygon-block
    if (networkVersion === ethereum_chainId) {
      startingBlock = 7958469 // starting eth-block
    }

    while (startingBlock < currentBlockNumber) {
      let transferEventData = await contracts.getPastEvents(
        'CollectionCreated',
        {
          filter: {
            from: '0x0000000000000000000000000000000000000000',
            to: walletAddress,
          },
          fromBlock: startingBlock,
          toBlock: startingBlock + 1000,
        },
      )
      startingBlock += 1000
      if (transferEventData && transferEventData.length > 0) {
        const Length = transferEventData.length
        for (let index = 0; index < Length; index++) {
          const event = transferEventData[index]?.returnValues
          tokens.push({
            name: event?.name,
            collection: event?.collection,
            creator: event?.creator,
            symbol: event?.symbol,
            tokenURIPrefix: event?.tokenURIPrefix,
            _contractURI: event?._contractURI,
            time: event?.time,
          })
        }
      }
    }
  } catch (error) {
    // return new Error(error.message)
  }
  return tokens
}

export const _Collections = async (id) => {
  try {
    const networkVersion = NetworkVersion()
    const contracts = ContractsCalling(networkVersion)

    const result = await contracts.methods._collections(id).call()
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const _UserCollections = async (walletAddress, collectionId) => {
  try {
    const networkVersion = NetworkVersion()
    const contracts = ContractsCalling(networkVersion)

    const result = await contracts.methods
      ._userCollections(walletAddress, collectionId)
      .call()
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const CreateCollection = async (
  walletAddress,
  name,
  symbol,
  _contractURI,
  tokenURIPrefix,
) => {
  try {
    const networkVersion = NetworkVersion()
    const contracts = ContractsCalling(networkVersion)

    const result = await contracts.methods
      .createCollection(name, symbol, _contractURI, tokenURIPrefix)
      .send({
        from: walletAddress,
      })
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const GetTokenUri = async (tokenId, collectionAddress) => {
  try {
    const networkVersion = NetworkVersion()
    const getContract = await DynamicContract(collectionAddress, networkVersion)
    const result = await getContract.methods.tokenURI(tokenId).call()
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const GetPastEvents = async (
  walletAddress,
  collectionAddress,
  Default,
) => {
  const networkVersion = NetworkVersion()
  let tokens = []
  try {
    const currentBlockNumber = await CurrentBlockNumber()
    const getContract = await DynamicContract(collectionAddress, networkVersion)

    let startingBlock = null
    if (networkVersion === ethereum_chainId) {
      startingBlock = 7974068 // starting ethereum-block
    } else {
      startingBlock = 29195795 // starting polygon-block
    }

    while (startingBlock < currentBlockNumber) {
      let transferEventData = await getContract.getPastEvents('Transfer', {
        filter: {
          from: Default ? '' : '0x0000000000000000000000000000000000000000',
          to: walletAddress,
        },
        fromBlock: startingBlock,
        toBlock: startingBlock + 1000,
      })
      startingBlock += 1000
      if (transferEventData && transferEventData.length > 0) {
        const Length = transferEventData.length
        for (let index = 0; index < Length; index++) {
          const event = transferEventData[index]
            tokens.push(event.returnValues.tokenId)

        }
      }
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}
  return tokens
}

export const SafeMint = async (
  collectionAddress,
  to,
  url,
  walletAddress,
  royaltyFee,
) => {
  try {
    const networkVersion = NetworkVersion()
    const getContract = await DynamicContract(collectionAddress, networkVersion)

    const result = await getContract.methods
      .safeMint(to, url, walletAddress, royaltyFee)
      .send({ from: walletAddress })
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const Owner = async (collectionAddress) => {
  try {
    const networkVersion = NetworkVersion()
    const getContract = await DynamicContract(collectionAddress, networkVersion)

    const result = await getContract.methods.owner().call()
    return result
  } catch (error) {
    return new Error(error.message)
  }
}
export const OwnerOf = async (collectionAddress, tokenId) => {
  try {
    const networkVersion = NetworkVersion()
    const getContract = await DynamicContract(collectionAddress, networkVersion)

    const result = await getContract.methods.ownerOf(tokenId).call()
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const Burn = async (collectionAddress, tokenId, walletAddress) => {
  try {
    const networkVersion = NetworkVersion()
    const getContract = await DynamicContract(collectionAddress, networkVersion)

    const result = await getContract.methods
      .burn(tokenId)
      .send({ from: walletAddress })
    return result
  } catch (error) {
    return new Error(error.message)
  }
}

export const SafeTransferFrom = async (
  collectionAddress,
  from,
  to,
  tokenId,
) => {
  try {
    const networkVersion = NetworkVersion()
    const getContract = await DynamicContract(collectionAddress, networkVersion)

    const result = await getContract.methods
      .safeTransferFrom(from, to, tokenId)
      .send({ from: from })
    return result
  } catch (error) {
    return new Error(error.message)
  }
}
