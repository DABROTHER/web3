import { endpoints } from './endpoints'
import { ProtectedRoutes as PR } from '@/context/auth/ProtectedRoutes'
import PageNotFound from '@/pages/404'
import ConnectWalletPage from '@/pages/connect-wallet'
import NftLists from '@/pages/nft-list'
import TransferNft from '@/pages/transfer-nft'
import CreateNftPage from '@/pages/create-nft'
import CreateCollectionsPage from '@/pages/create-collections'
import Collections from '@/pages/collections'

export default [
  { path: endpoints.home, element: <ConnectWalletPage /> },
  {
    path: endpoints.createNft,
    element: (
      <PR>
        <CreateNftPage />
      </PR>
    ),
  },
  {
    path: endpoints.nft,
    element: (
      <PR>
        <NftLists />
      </PR>
    ),
  },
  {
    path: endpoints.defaultNft,
    element: (
      <PR>
        <NftLists />
      </PR>
    ),
  },
  {
    path: endpoints.collection,
    element: (
      <PR>
        <Collections />
      </PR>
    ),
  },
  {
    path: endpoints.createCollection,
    element: (
      <PR>
        <CreateCollectionsPage />
      </PR>
    ),
  },
  {
    path: endpoints.transfer,
    element: (
      <PR>
        <TransferNft />
      </PR>
    ),
  },

  { path: endpoints.page_not_found, element: <PageNotFound /> },
]
