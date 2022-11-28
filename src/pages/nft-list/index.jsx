import { memo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import {
  CollectionCreatedEvents,
  GetPastEvents,
  GetTokenUri,
  OwnerOf,
} from '@/contracts'
import Card from '@/components/common/card'

export const fetchingDataFromPinata = async (url) => {
  const response = await axios.get(url)
  if (response.status === 200) return response.data
}

const ValueCheck = [null, '', undefined]

const NftLists = () => {
  const params = useParams()
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const walletAddress = localStorage.getItem('walletAddress')

  const ValueCheck = (value)=>{
    const result = [null,'', undefined].includes(value)
    return !result
  }
  const func = async () => {
    try {
      setIsLoading(true)
      if (ValueCheck(params.collection)) {
        let getUserId = null

        getUserId = await GetPastEvents(walletAddress, params.collection)
        if (getUserId.length === 0) return setIsLoading(false)

        for (let i = 0; i < getUserId.length; i++) {
          const element = getUserId[i]
          try {
            const owner = await OwnerOf(params.collection, Number(element))
            if (owner.toLowerCase() === walletAddress.toLowerCase()) {
              const getLink = await GetTokenUri(element, params.collection)
              const data = await fetchingDataFromPinata(getLink)
              setNfts((prev) => [
                ...prev,
                {
                  collection: params.collection,
                  description: data?.description,
                  image: data?.image,
                  name: data?.name,
                  tokenId: element,
                },
              ])
            }
          } catch (error) {
            continue
          }
        }
        setIsLoading(false)
      } else {
        const result = await CollectionCreatedEvents(walletAddress)
        for (let key = 0; key < result.length; key++) {
          const collectionAddress = result[key]?.collection

          if (ValueCheck(collectionAddress)) {
            let getUserId = null
            getUserId = await GetPastEvents(
              walletAddress,
              collectionAddress,
              true,
            )
            for (let i = 0; i < getUserId.length; i++) {
              const element = getUserId[i]
              try {
                const owner = await OwnerOf(collectionAddress, Number(element))
                if (owner.toLowerCase() === walletAddress.toLowerCase()) {
                  const getLink = await GetTokenUri(element, collectionAddress)
                  const data = await fetchingDataFromPinata(getLink)
                  setNfts((prev) => [
                    ...prev,
                    {
                      collection: collectionAddress,
                      description: data?.description,
                      image: data?.image,
                      name: data?.name,
                      tokenId: element,
                    },
                  ])
                }
              } catch (error) {
                continue
              }
            }
          }
        }
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      return new Error(error.message)
    }
  }

  useEffect(() => {
    func()
  }, [walletAddress])

  return (
    <div className="my-5 mx-3">
      <h1 className="text-blue-600 text-center text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-1">
        Minted Nft&lsquo;s List
      </h1>
      <hr />
      <br />

      {isLoading ? (
        <h1 className="font-bold text-lg text-center flex justify-center">
          fetching your nft please wait...
        </h1>
      ) : nfts.length === 0 ? (
        <h1 className="font-bold text-lg text-center flex justify-center">
          You Does&apos;t have any NFT.
        </h1>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {nfts?.map((nft, i) => {
            return (
              <div key={i} className="my-4 ">
                <Card nft={nft} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default memo(NftLists)
