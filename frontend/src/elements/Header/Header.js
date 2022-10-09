import React, {useState} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import {HiHome} from 'react-icons/hi'
import {AiFillNotification} from 'react-icons/ai'
import {FaUserFriends} from 'react-icons/fa'
import {AiFillWechat} from 'react-icons/ai'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {FiSearch} from 'react-icons/fi'
import SearchModal from '../../modals/SearchModal'
import Modal from '../../modals/Modal'
import axios from 'axios'

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

    const navigate = useNavigate()
    const [searchVisible, setSearchVisible] = useState(false)
    const [usersList, setUsersList] = useState()

    const getUsers = () => {
        return axios.get('http://localhost:2023/').then(data => {
            console.log(data.data.rows)
            setUsersList(data.data.rows)
        }) 
    }

  return (
    <Container>
        <Nav>
            <Option onClick={() => {
                navigate('/dashboard')
            }}>
                <HiHome/>
            </Option>
            <Option onClick={() => {
                navigate('/friends')
            }}>
                <FaUserFriends/>
            </Option>
            <Option onClick={() => {
                navigate('/chatList')
            }}>
                <AiFillWechat/>
            </Option>
            <Option onClick={() => {
                navigate('/notifications')
            }}>
                <AiFillNotification/>
            </Option>
            <Option onClick={() => {
                console.log('search')
                setSearchVisible(true)
                getUsers()
            }}>
                <FiSearch/>
            </Option>
            <Option>
                <BsThreeDotsVertical/>
            </Option>
        </Nav>
        {searchVisible && 
            <Modal>
                {usersList && usersList.map(item => {
                    return ( 
                    <div onClick={
                        () => navigate(`/profile/${item.id}`)
                    }>{item.firstname} {item.lastname}</div>)
                })}
            </Modal>
        }
    </Container>
  )
}

export default Header