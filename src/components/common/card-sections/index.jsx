import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

const CardSections = ({ item }) => {
  return (
    <div className="rounded-lg shadow-lg bg-blue-200 m-2 p-2 overflow-hidden">
      <div className="p-4">
        <h5 className="text-gray-900 font-medium mb-2 text-left">
          Name : {item?.name}
        </h5>
        <h5 className="text-gray-900 font-medium mb-2 text-left">
          Collection : {item?.collection}
        </h5>
        <h5 className="text-gray-900 font-medium mb-2 text-left">
          Symbol : {item?.symbol}
        </h5>
        <h5 className="text-gray-900 font-medium mb-2 text-left">
          Creator : {item?.creator}
        </h5>
        <hr />
        <div className="flex justify-between mt-2">
          <p className="text-gray-900 font-medium mb-2">
            {moment.unix(item?.time).format('DD/MM/YYYY')}
          </p>
          <Link
            className="p-1 m-1 bg-purple-400 rounded px-3"
            type="button"
            to={`/nft/${item?.collection}`}
          >
            view-nft-collection
          </Link>
          <Link
            className="p-1 m-1 bg-purple-400 rounded px-3"
            type="button"
            to={`/create-nft/${item?.collection}`}
          >
            Mint
          </Link>
        </div>
      </div>
    </div>
  )
}

CardSections.propTypes = {
  item: PropTypes.object.isRequired,
}

export default CardSections
