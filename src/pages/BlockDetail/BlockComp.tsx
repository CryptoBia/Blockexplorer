import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import DropDownIcon from '../../assets/content_drop_down.png'
import PackUpIcon from '../../assets/content_pack_up.png'
import DropDownBlueIcon from '../../assets/content_blue_drop_down.png'
import PackUpBlueIcon from '../../assets/content_blue_pack_up.png'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import Tooltip from '../../components/Tooltip'
import TransactionItem from '../../components/TransactionItem/index'
import { AppContext } from '../../contexts/providers'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  BlockLinkPanel,
  BlockOverviewDisplayControlPanel,
  BlockOverviewItemContentPanel,
  BlockRootInfoItemPanel,
  BlockTransactionsPagination,
} from './styled'
import browserHistory from '../../routes/history'
import { isMainnet } from '../../utils/chain'

const handleMinerText = (address: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(address, 13)
  }
  return adaptPCEllipsis(address, 12, 50)
}

const BlockMiner = ({ miner }: { miner: string }) => {
  return (
    <BlockLinkPanel>
      {miner ? (
        <Link to={`/address/${miner}`}>
          <span className="address">{handleMinerText(miner)}</span>
        </Link>
      ) : (
        i18n.t('address.unable_decode_address')
      )}
    </BlockLinkPanel>
  )
}

const BlockOverviewItemContent = ({
  type,
  value,
  tip,
  message,
}: {
  type: string
  value?: string
  tip?: string
  message?: string
}) => {
  const [show, setShow] = useState(false)
  return (
    <BlockOverviewItemContentPanel>
      {value && <div className="block__overview_item_value">{value}</div>}
      {tip && (
        <div
          id={type}
          className="block__overview_item_tip"
          tabIndex={-1}
          onFocus={() => {}}
          onMouseOver={() => {
            setShow(true)
            const p = document.querySelector('.page') as HTMLElement
            if (p) {
              p.setAttribute('tabindex', '-1')
            }
          }}
          onMouseLeave={() => {
            setShow(false)
            const p = document.querySelector('.page') as HTMLElement
            if (p) {
              p.removeAttribute('tabindex')
            }
          }}
        >
          {tip}
          <Tooltip show={show} targetElementId={type}>
            {message}
          </Tooltip>
        </div>
      )}
    </BlockOverviewItemContentPanel>
  )
}

const EpochNumberLink = ({ epochNumber }: { epochNumber: number }) => {
  return (
    <BlockLinkPanel>
      <Link to={`/block/${epochNumber}`}>{localeNumberString(epochNumber)}</Link>
    </BlockLinkPanel>
  )
}

const BlockOverview = ({ block }: { block: State.Block }) => {
  const [showAllOverview, setShowAllOverview] = useState(false)
  const receivedTxFee = `${localeNumberString(shannonToCkb(block.receivedTxFee))} CKB`
  const rootInfoItems = [
    {
      title: i18n.t('block.transactions_root'),
      content: `${block.transactionsRoot}`,
    },
  ]
  let overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: localeNumberString(block.number),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockMiner miner={block.minerHash} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('block.epoch'),
      content: localeNumberString(block.epoch),
    },
    {
      title: i18n.t('block.proposal_transactions'),
      content: block.proposalsCount ? localeNumberString(block.proposalsCount) : 0,
    },
    {
      title: i18n.t('block.epoch_start_number'),
      content: <EpochNumberLink epochNumber={block.startNumber} />,
    },
    {
      title: i18n.t('block.block_reward'),
      content: (
        <BlockOverviewItemContent
          type="block_reward"
          value={block.rewardStatus === 'pending' ? '' : `${localeNumberString(shannonToCkb(block.reward))} CKB`}
          tip={block.rewardStatus === 'pending' ? i18n.t('block.pending') : undefined}
          message={i18n.t('block.pending_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.epoch_length'),
      content: localeNumberString(block.length),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: (
        <BlockOverviewItemContent
          type="transaction_fee"
          value={block.receivedTxFeeStatus === 'pending' && block.number > 0 ? undefined : receivedTxFee}
          tip={block.receivedTxFeeStatus === 'pending' && block.number > 0 ? i18n.t('block.calculating') : undefined}
          message={i18n.t('block.calculating_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.difficulty'),
      content: localeNumberString(block.difficulty),
    },
    {
      title: i18n.t('block.timestamp'),
      content: `${parseSimpleDate(block.timestamp)}`,
    },
    {
      title: i18n.t('block.nonce'),
      content: localeNumberString(block.nonce),
    },
    {
      title: i18n.t('block.uncle_count'),
      content: `${block.unclesCount}`,
    },
  ]

  if (isMobile()) {
    const newItems: OverviewItemData[] = []
    overviewItems.forEach((item, index) => (index % 2 === 0 ? newItems.push(item) : null))
    overviewItems.forEach((item, index) => (index % 2 !== 0 ? newItems.push(item) : null))
    overviewItems = newItems.concat(rootInfoItems)
    if (!showAllOverview) {
      overviewItems.splice(11, overviewItems.length - 11)
    }
  }

  const getDropdownIcon = () => {
    if (isMainnet()) {
      return showAllOverview ? PackUpIcon : DropDownIcon
    }
    return showAllOverview ? PackUpBlueIcon : DropDownBlueIcon
  }
  return (
    <OverviewCard items={overviewItems}>
      {isMobile() ? (
        <BlockOverviewDisplayControlPanel onClick={() => setShowAllOverview(!showAllOverview)}>
          <img src={getDropdownIcon()} alt={showAllOverview ? 'show' : 'hide'} />
        </BlockOverviewDisplayControlPanel>
      ) : (
        rootInfoItems.map(item => {
          return (
            <BlockRootInfoItemPanel key={item.title}>
              <div className="block__root_info_title">{item.title}</div>
              <div className="block__root_info_value">{item.content}</div>
            </BlockRootInfoItemPanel>
          )
        })
      )}
    </OverviewCard>
  )
}

export default ({
  currentPage,
  pageSize,
  blockParam,
}: {
  currentPage: number
  pageSize: number
  blockParam: string
}) => {
  const { blockState } = useContext(AppContext)
  const { transactions = [] } = blockState

  const totalPages = Math.ceil(blockState.total / pageSize)

  const onChange = (page: number) => {
    browserHistory.push(`/block/${blockParam}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      <TitleCard title={i18n.t('common.overview')} />
      {blockState && <BlockOverview block={blockState.block} />}
      <TitleCard title={i18n.t('transaction.transactions')} />
      {transactions.map((transaction: State.Transaction, index: number) => {
        return (
          transaction && (
            <TransactionItem
              key={transaction.transactionHash}
              transaction={transaction}
              isBlock
              isLastItem={index === blockState.transactions.length - 1}
            />
          )
        )
      })}
      {totalPages > 1 && (
        <BlockTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </BlockTransactionsPagination>
      )}
    </>
  )
}