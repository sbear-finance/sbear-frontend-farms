import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, useModal } from '@pancakeswap-libs/uikit'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMultiClaimLottery } from 'hooks/useBuyLottery'
import { useTotalClaim,useTotalRewards } from 'hooks/useTickets'
import BuyModal from 'views/Lottery/components/TicketCard/BuyTicketModal'
import CakeWinnings from './CakeWinnings'
import LotteryJackpot from './LotteryJackpot'
import { usePriceCakeBusd } from '../../../state/hooks'

const StyledLotteryCard = styled(Card)`
  background-image: url('/images/ticket_home.png');
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: #FF6518;;
  font-size: 14px;
`

const Actions = styled.div`
  display: flex;
  margin-top: 24px;
  button {
    flex: 1 0 50%;
  }
`

const FarmedStakingCard = () => {
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const [requesteClaim, setRequestedClaim] = useState(false)
  const TranslateString = useI18n()
  const { claimAmount } = useTotalClaim()
  const { onMultiClaim } = useMultiClaimLottery()
  const cakeBalance = useTokenBalance(getCakeAddress())
 const bearPrice = usePriceCakeBusd().toNumber()
	
  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onMultiClaim()
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedClaim(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onMultiClaim, setRequestedClaim])

  const [onPresentBuy] = useModal(<BuyModal max={cakeBalance} tokenName="sBEAR" />)

  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(550, 'Your Lottery Winnings')}
        </Heading>
        <CardImage src="/images/ticket.png" alt="sBEAR logo" width={64} height={64} />
        <Block>
		<Label>{TranslateString(552, 'sBEAR to Collect')}</Label>
          <CakeWinnings />
        </Block>
        <Block>
		<Label>{TranslateString(554, 'Total jackpot this round')}</Label>
          <LotteryJackpot />
		  <Label>~${(getBalanceNumber(useTotalRewards()) * bearPrice).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}</Label>
        </Block>
        <Actions>
          <Button
            id="dashboard-collect-winnings"
            disabled={getBalanceNumber(claimAmount) === 0 || requesteClaim}
            onClick={handleClaim}
            style={{ marginRight: '8px' }}
          >
            {TranslateString(556, 'Collect Winnings')}
          </Button>
          <Button id="dashboard-buy-tickets" variant="secondary" onClick={onPresentBuy} disabled={lotteryHasDrawn}>
            {TranslateString(558, 'Buy Tickets')}
          </Button>
        </Actions>
      </CardBody>
    </StyledLotteryCard>
  )
}

export default FarmedStakingCard
