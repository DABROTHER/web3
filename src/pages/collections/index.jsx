import { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { endpoints } from '@/routes/endpoints'
import { CollectionCreatedEvents } from '@/contracts'
import CardSections from '@/components/common/card-sections'

const Collections = () => {
  const navigate = useNavigate()
  const [collectionData, setCollectionData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const walletAddress = localStorage.getItem('walletAddress')

  const handlEvents = async () => {
    try {
      setIsLoading(true)
      const result = await CollectionCreatedEvents(walletAddress)
      if (result.length === 0) return setIsLoading(false)
      for (const key in result) {
        const element = result[key]
        if (walletAddress?.toLowerCase() === element?.creator?.toLowerCase()) {
          setCollectionData((prev) => [
            ...prev,
            {
              collection: element?.collection,
              creator: element?.creator,
              symbol: element?.symbol,
              name: element?.name,
              time: element?.time,
              tokenURIPrefix: element?.tokenURIPrefix,
              _contractURI: element?._contractURI,
            },
          ])
        }
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      return new Error(error.message)
    }
  }

  useEffect(() => {
    handlEvents()
  }, [walletAddress])

  return (
    <div>
      <div className="flex mt-20">
        <h1 className="flex-auto text-blue-600 text-center text-5xl md:text-6xl font-bold tracking-tight mb-1">
          Nft Collections
        </h1>
        <button
          type="button"
          onClick={() => navigate(endpoints.createCollection)}
          className="mr-8 ml-3 rounded-lg bg-blue-800 hover:bg-blue-600 px-5 text-sm font-medium text-white mb-1"
        >
          create-collection
        </button>
      </div>
      <hr />

      <div className="rounded-lg shadow-lg bg-blue-200 m-2 p-2 overflow-hidden">
        <div className="p-4">
          <hr />
          <div className="flex justify-center mt-2">
            <Link
              className="p-1 m-1 bg-purple-400 rounded px-3"
              type="button"
              to={endpoints.defaultNft}
            >
              view nfts
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <h1 className="font-bold text-lg text-center flex justify-center mt-10">
          fetching collection please wait...
        </h1>
      ) : collectionData.length === 0 ? (
        <h1 className="font-bold text-lg text-center flex justify-center mt-10">
          You Does&apos;t have any NFT Collections.
        </h1>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2 mt-10">
          {collectionData?.map((item, i) => {
            return (
              <div className="my-4" key={i}>
                <CardSections item={item} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default memo(Collections)
