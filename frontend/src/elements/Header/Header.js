import React from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import {HiHome} from 'react-icons/hi'
import {AiFillWechat} from 'react-icons/ai'
import {FiSearch, FiLogOut} from 'react-icons/fi'

const Container = styled.div`
    width:100vw;
    height:10vh;
    box-shadow: 5px 0px 3px gray;
`
const Nav = styled.div`
    width:fit-content;
    height:100%;
    margin:auto;
`
const Option = styled.button`
    width:8vw;
    height:100%;
    display:inline-block;
    font-size: 40px;
    border:none;
    background-color: white;
    cursor:pointer;
`

function Header() {

    const [cookies, removeCookie] = useCookies()
    const navigate = useNavigate()

  return (
    <Container>
        <Nav>
            <Option onClick={() => {
                navigate('/dashboard')
            }}>
                <HiHome/>
            </Option>
            <Option onClick={() => {
                navigate('/chatList')
            }}>
                <AiFillWechat/>
            </Option>
            <Option onClick={() => {
                console.log('search')
            }}>
                <FiSearch/>
            </Option>
            <Option onClick={() => {
                try {
                    removeCookie(cookies.loginData[0])
                    console.log('User logged out!')
                    navigate('/')
                } catch(err) {
                    console.log(err)
                }
            }}>
                <FiLogOut/>
            </Option>
        </Nav>
    </Container>
  )
}

export default Header