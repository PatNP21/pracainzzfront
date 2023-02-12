import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import ChatPosition from './ChatPosition'

const Container = styled.div`
  width:70vw;
  height:70vh;
  margin:0 auto;
`

function SearchList(props) {

    const [list, setList] = useState()

    useEffect(() => {
        setList(props.usersList)
        console.log(list)
    })

  return (
    <Container>
        {list && list.map(item => {
            return <ChatPosition user={item}/>
        })}
    </Container>
  )
}

export default SearchList