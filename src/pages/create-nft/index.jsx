import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { endpoints } from '@/routes/endpoints'
import { SafeMint } from '@/contracts/index'
import { pinataForData, pinataForIpfs } from '@/services/pinata-ipfs'

const emptyForm = {
  name: '',
  description: '',
  royalties: '',
}

const valueCheck = ['', null, undefined]

const CreateNftPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyForm)
  const [getFile, setGetFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const walletAddress = localStorage.getItem('walletAddress')

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlSubmit = async (e) => {
    e.preventDefault()
    if (
      valueCheck.includes(formData.name) &&
      valueCheck.includes(formData.description) &&
      valueCheck.includes(formData.royalties.toString()) &&
      getFile
    )
      return toast.info('please fill all the required fileds!!')
    try {
      let form = new FormData()
      form.append('file', getFile)
      setIsLoading(true)
      const { IpfsHash } = await pinataForIpfs(form)
      const getDatafromPinata = await pinataForData({
        name: formData.name,
        description: formData.description,
        image: `https://ipfs.io/ipfs/${IpfsHash}`,
      })
      if (IpfsHash && getDatafromPinata) {
        setIsLoading(true)
        const royalties_fee = formData.royalties * 1000
        const getData = await SafeMint(
          params.collection,
          walletAddress,
          getDatafromPinata.IpfsHash,
          walletAddress,
          royalties_fee.toString(),
        )
        if (getData) {
          setIsLoading(false)
          return navigate(`/nft/${params.collection}`)
        }
      }
    } catch (error) {
      setIsLoading(false)
      return new Error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 ">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-blue-600 text-center text-5xl md:text-6xl font-bold tracking-tight mb-8">
          Create New NFT
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
            Description
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Description"
              onChange={onChange}
              name="description"
              required
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <input
              type="file"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              accept="image/*"
              onChange={(e) => setGetFile(e.target.files[0])}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="" className="sr-only">
            Royalties fee
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Royalties fee"
              onChange={onChange}
              name="royalties"
              required
            />
          </div>
        </div>

        <hr />
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="ml-3 inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            onClick={() => navigate(endpoints.collection)}
            disabled={isLoading}
          >
            back
          </button>

          <button
            type="button"
            className="ml-3 inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            onClick={handlSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateNftPage
