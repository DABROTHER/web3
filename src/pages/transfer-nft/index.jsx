import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SafeTransferFrom } from '@/contracts'

const emptyForm = {
  from: '',
  to: '',
  tokenId: '',
}

const valueCheck = ['', null, undefined]

const TransferNft = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTransfer = async () => {
    if (
      valueCheck.includes(formData.from) ||
      valueCheck.includes(formData.to) ||
      valueCheck.includes(params.collection) ||
      valueCheck.includes(params.nftId)
    )
      return toast.info('please fill the Required fileds!!')
    try {
      setIsLoading(true)
      const result = await SafeTransferFrom(
        params.collection,
        formData.from,
        formData.to,
        params.nftId,
      )
      if (result) {
        setIsLoading(false)
        window.location.reload()
        return navigate(-1)
      }
    } catch (error) {
      setIsLoading(false)
      return new Error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
          Transfer Your NFT
        </h1>

        <div className="mt-6 mb-0 space-y-4 rounded-lg p-8 shadow-2xl">
          <div>
            <label htmlFor="from" className="text-sm font-medium">
              From
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="from"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="address"
                onChange={onChange}
                name="from"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="to" className="text-sm font-medium">
              To
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="to"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="address"
                onChange={onChange}
                name="to"
                required
              />
            </div>
          </div>

          <hr />
          <button
            type="button"
            className="block w-full rounded-lg bg-cyan-600 hover:bg-cyan-900 px-5 py-3 text-sm font-medium text-white"
            onClick={() => navigate(-1)}
          >
            back
          </button>
          <button
            type="button"
            className="block w-full rounded-lg bg-indigo-600 hover:bg-indigo-900 px-5 py-3 text-sm font-medium text-white"
            onClick={handleTransfer}
          >
            {isLoading ? 'Loading...' : 'transfer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransferNft
