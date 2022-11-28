import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { endpoints } from '@/routes/endpoints'
import { useAuth } from '@/context/auth'
import {
  AddNetworkInMetamask,
  EnableMetaMask,
  NetworkVersion,
  SwitchNetwork,
} from '@/services/web3-services'

const polygon_chainName = process.env.POLYGON_CHAIN_NAME
const polygon_chainId = process.env.POLYGON_CHAIN_ID
const polygon_rpcUrl = process.env.POLYGON_RPC_URL

// const ethereum_chainName = process.env.ETHEREUM_CHAIN_NAME
const ethereum_chainId = process.env.ETHEREUM_CHAIN_ID
// const ethereum_rpcUrl = process.env.ETHEREUM_RPC_URL

const ConnectWalletPage = () => {
  const { SignUp } = useAuth()
  const navigate = useNavigate()
  const [selectedNetwork, setSelectedNetwork] = useState('')

  useEffect(() => {
    const networkVersion = NetworkVersion()
    if (networkVersion) setSelectedNetwork(networkVersion)
  }, [])

  const connectWallet = async () => {
    if (selectedNetwork === polygon_chainId) {
      try {
        await SwitchNetwork(selectedNetwork)
        const getAccount = await EnableMetaMask()
        if (getAccount) {
          SignUp(getAccount)
          return navigate(endpoints.collection)
        }
      } catch (err) {
        // If chain is not added , then add polygon network
        if (err.code === 4902) {
          await AddNetworkInMetamask(
            polygon_chainId,
            polygon_chainName,
            polygon_rpcUrl,
            { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
          )
          toast.info('please, connect your wallet now.')
          return navigate(endpoints.home)
        }
        return toast.error(err.message)
      }
    } else if (selectedNetwork === ethereum_chainId) {
      try {
        await SwitchNetwork(selectedNetwork)
        const getAccount = await EnableMetaMask()
        if (getAccount) {
          SignUp(getAccount)
          return navigate(endpoints.collection)
        }
      } catch (err) {
        return toast.error(err.message)
      }
    }
  }

  return (
    <div>
      <section className="mb-40">
        <div className="text-center bg-gray-50 text-gray-800 py-24 px-6">
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">
            The best offer on the market <br />
            <span className="text-blue-600">victor nft work</span>
          </h1>

          <div className="flex justify-center">
            <div className="mb-3 xl:w-96">
              <select
                className="form-select form-select-lg mb-3 appearance-none block w-full px-4 py-2 text-xl font-normal text-gray-700
      bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label=".form-select-lg example"
                onChange={(e) => setSelectedNetwork(e.target.value)}
              >
                <option defaultChecked>select network</option>
                <option
                  value={ethereum_chainId}
                  defaultChecked={
                    selectedNetwork === ethereum_chainId && selectedNetwork
                  }
                >
                  Ethereum
                </option>
                <option
                  value={polygon_chainId}
                  defaultChecked={
                    selectedNetwork === polygon_chainId && selectedNetwork
                  }
                >
                  Polygon
                </option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg inline-block px-7 py-3 mr-2 bg-blue-900 text-white font-medium text-sm leading-snug uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={connectWallet}
          >
            connect-wallet
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConnectWalletPage
