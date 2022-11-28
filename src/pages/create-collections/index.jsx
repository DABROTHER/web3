import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { endpoints } from '@/routes/endpoints'
import { CreateCollection } from '@/contracts'

const emptyForm = {
  name: '',
  symbol: '',
}
const contractURI =
  'https://ipfs.io/ipfs/Qmd2ptbyes43Qrnypp5s3aCPbLYgrt86UWriLxhjpF3zud'
const tokenURI = 'https://ipfs.io/ipfs/'

const valueCheck = ['', null, undefined]

const CreateCollectionsPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  const walletAddress = localStorage.getItem('walletAddress')

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlSubmit = async (e) => {
    e.preventDefault()
    if (
      valueCheck.includes(formData.name) ||
      valueCheck.includes(formData.symbol)
    )
      return toast.info('please fill all the required fileds!!')
    try {
      setIsLoading(true)
      const createdCollection = await CreateCollection(
        walletAddress,
        formData.name,
        formData.symbol,
        contractURI,
        tokenURI,
      )
      if (createdCollection) {
        setIsLoading(false)
        return navigate(endpoints.collection)
      }
    } catch (error) {
      setIsLoading(false)
      return new Error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 ">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-blue-600 text-center text-5xl md:text-6xl font-bold tracking-tight mb-1">
          Create Collections
        </h1>
      </div>
      <hr />
      <div className="mx-auto mt-8 mb-0 max-w-md space-y-4 ">
        <div>
          <label htmlFor="" className="sr-only">
            Name
          </label>

          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Name"
              onChange={onChange}
              name="name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="" className="sr-only">
            Symbol
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Symbol"
              onChange={onChange}
              name="symbol"
              required
            />
          </div>
        </div>

        <hr />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="ml-3 inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            onClick={() => navigate(endpoints.collection)}
            disabled={isLoading}
          >
            back
          </button>

          <button
            type="submit"
            className="ml-3 inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            onClick={handlSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCollectionsPage
