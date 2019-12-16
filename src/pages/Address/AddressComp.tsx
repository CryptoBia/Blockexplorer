import React, { ReactNode, useContext } from 'react'
import { Tooltip } from 'antd'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import TransactionItem from '../../components/TransactionItem/index'
import { AppContext } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  AddressLockScriptItemPanel,
  AddressLockScriptPanel,
  AddressTransactionsPagination,
  AddressTransactionsPanel,
} from './styled'
import browserHistory from '../../routes/history'
import DecimalCapacity from '../../components/DecimalCapacity'
import { parseSimpleDateNoSecond } from '../../utils/date'
import { AppDispatch } from '../../contexts/providers/reducer'
import CopyTooltipText from '../../components/Tooltip/CopyTooltipText'

const addressContent = (address: string, dispatch: AppDispatch) => {
  if (!address) {
    return i18n.t('address.unable_decode_address')
  }
  if (isMobile()) {
    return adaptMobileEllipsis(address, 10)
  }
  const addressHash = adaptPCEllipsis(address, 13, 50)
  if (addressHash.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} dispatch={dispatch} />}>
        <span>{addressHash}</span>
      </Tooltip>
    )
  }
  return addressHash
}

const AddressLockScriptItem = ({ title, children }: { title: string; children?: ReactNode }) => {
  return (
    <AddressLockScriptItemPanel>
      <div className="address_lock_script__title">
        <span>{title}</span>
      </div>
      <div className="address_lock_script__content">{children}</div>
    </AddressLockScriptItemPanel>
  )
}

const AddressLockScript = ({ script }: { script: State.Script }) => {
  return (
    <AddressLockScriptPanel>
      <div className="address__lock_script_title">{i18n.t('address.lock_script')}</div>
      <AddressLockScriptItem title={i18n.t('address.code_hash')}>
        <span>{script.codeHash}</span>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.args')}>
        <span>{script.args}</span>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.hash_type')}>
        <code>{script.hashType}</code>
      </AddressLockScriptItem>
    </AddressLockScriptPanel>
  )
}

const getAddressInfo = (addressState: State.AddressState, dispatch: AppDispatch) => {
  const { address } = addressState
  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.balance'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balance))} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(address.transactionsCount),
    },
    {
      title: i18n.t('address.dao_deposit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoDeposit))} />,
    },
    {
      title: i18n.t('address.compensation'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.interest))} />,
    },
    {
      title: i18n.t('address.live_cells'),
      content: localeNumberString(address.liveCellsCount),
    },
    {
      title: i18n.t('address.block_mined'),
      content: (
        <Tooltip placement="topRight" title={i18n.t('block.pending_tip')} arrowPointAtCenter>
          <span className="address block_pointer">
            {`${localeNumberString(address.minedBlocksCount)}/(${address.pendingRewardBlocksCount}`}
          </span>
        </Tooltip>
      ),
    },
  ]

  if (address.type === 'LockHash' && address) {
    items.push({
      title: i18n.t('address.address'),
      content: addressContent(address.addressHash, dispatch),
    })
  }
  const { lockInfo } = address
  if (lockInfo && lockInfo.epochNumber) {
    items.push({
      title: i18n.t('address.lock_until'),
      content: `${lockInfo.epochNumber}(th) ${i18n.t('address.epoch')} (${i18n.t(
        'address.estimated',
      )} ${parseSimpleDateNoSecond(lockInfo.estimatedUnlockTime)})`,
    })
  }

  return items
}

export const AddressOverview = ({ dispatch }: { dispatch: AppDispatch }) => {
  const { addressState } = useContext(AppContext)
  return (
    <>
      <TitleCard title={i18n.t('common.overview')} />
      <OverviewCard items={getAddressInfo(addressState, dispatch)}>
        {addressState && addressState.address && addressState.address.lockScript && (
          <AddressLockScript script={addressState.address.lockScript} />
        )}
      </OverviewCard>
    </>
  )
}

export const AddressTransactions = ({
  currentPage,
  pageSize,
  address,
  dispatch,
}: {
  currentPage: number
  pageSize: number
  address: string
  dispatch: AppDispatch
}) => {
  const { addressState, app } = useContext(AppContext)
  const { tipBlockNumber } = app
  const { transactions = [] } = addressState

  const totalPages = Math.ceil(addressState.total / pageSize)

  const onChange = (page: number) => {
    browserHistory.replace(`/address/${address}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      {transactions.length > 0 && <TitleCard title={i18n.t('transaction.transactions')} />}
      <AddressTransactionsPanel>
        {addressState.transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                address={addressState.address.addressHash}
                transaction={transaction}
                dispatch={dispatch}
                confirmation={tipBlockNumber - transaction.blockNumber + 1}
                key={transaction.transactionHash}
                isLastItem={index === addressState.transactions.length - 1}
              />
            )
          )
        })}
      </AddressTransactionsPanel>
      {totalPages > 1 && (
        <AddressTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </AddressTransactionsPagination>
      )}
    </>
  )
}

export default {
  AddressOverview,
  AddressTransactions,
}
