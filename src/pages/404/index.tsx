import React from 'react'
import styled from 'styled-components'
import Content from '../../components/Content'
import NotFoundIcon from '../../assets/404.png'

const NotFoundPanel = styled.div`
  width: 100%;
  margin-top: 120px;
  margin-bottom: 140px;
`

const NotFoundImage = styled.img`
  width: 100%;
  height: auto;
  width: 700px;
  height: 386px;
  display: block;
  margin: 0 auto;

  @media (max-width: 700px) {
    width: 216px;
    height: 120px;
  }
`

export default () => {
  return (
    <Content>
      <NotFoundPanel className="container">
        <NotFoundImage src={NotFoundIcon} alt="404" />
      </NotFoundPanel>
    </Content>
  )
}
