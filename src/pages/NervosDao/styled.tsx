import styled from 'styled-components'

export const DaoContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 0px;
    padding: 20px;
  }

  .nervos_dao_title {
    width: 100%;
    border-radius: 6px;
    box-shadow: 2px 2px 6px 0 #dfdfdf;
    background-color: #ffffff;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: 500;
    color: #000000;

    @media (max-width: 700px) {
      height: 50px;
      border-radius: 3px;
      box-shadow: 1px 1px 3px 0 #dfdfdf;
      font-size: 15px;
    }
  }
`

export const DaoTabBarPanel = styled.div`
  width: 100%;
  height: 70px;
  background: white;
  display: flex;
  margin: 20px 0 5px 0;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 0 40px;
  font-size: 18px;

  @media (max-width: 700px) {
    height: ${(props: { containSearchBar: boolean }) => (props.containSearchBar ? '90px' : '60px')};
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
  }

  .nervos_dao_tab_bar {
    display: flex;
    height: 30px;
    cursor: pointer;
    margin-right: 15px;

    @media (max-width: 700px) {
      margin-bottom: ${(props: { containSearchBar: boolean }) => (props.containSearchBar ? '15px' : '0px')};
    }

    .div {
      font-size: 20px;

      @media (max-width: 700px) {
        font-size: 13px;
      }
    }

    div: nth-child(2) {
      margin-left: 50px;
    }

    .tab_bar_normal {
      color: #000000;
      font-weight: normal;
    }

    .tab_bar_selected {
      color: ${props => props.theme.primary};
      font-weight: bold;
      border-bottom: 2px solid ${props => props.theme.primary};
    }
  }
`

export const TransactionsPagination = styled.div`
  margin: 20px 0px 0px 0px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 10px 0px 0px 0px;
  }
`
