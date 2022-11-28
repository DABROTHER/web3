import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { Burn } from '@/contracts'

const Card = ({ nft }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleBurn = async () => {
    const walletAddress = localStorage.getItem('walletAddress')
    try {
      setIsLoading(true)
      const burn = await Burn(nft.collection, nft.tokenId, walletAddress)
      if (burn) {
        setIsLoading(false)
        window.location.reload()
        return navigate(`/nft/${nft.collection}`)
      }
    } catch (error) {
      setIsLoading(false)
      return new Error(error.message)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="rounded-lg shadow-lg bg-white max-w-sm">
        <figure>
          <img className="rounded-t-lg" src={nft?.image} alt="nfts" />
        </figure>
        <div className="p-4">
          <h5 className="text-gray-900 text-xl font-medium mb-2 text-left">
            {nft?.name}
          </h5>
          <p className="text-gray-700 text-base text-left">
            {nft?.description}
          </p>
        </div>
        <div className="flex justify-between mb-4 mx-4">
          <Link
            type="button"
            className=" bg-blue-700 hover:bg-blue-500 text-white font-bold  py-1 px-2 rounded-full"
            to={`/transfer/${nft.collection}/${nft.tokenId}`}
          >
            transfer
          </Link>
          <button
            type="button"
            className="bg-blue-700  hover:bg-blue-500 text-white font-bold  py-1 px-2 rounded-full "
            onClick={handleBurn}
          >
            {isLoading ? 'Loading...' : 'Burn'}
          </button>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  nft: PropTypes.object.isRequired,
}

export default Card
