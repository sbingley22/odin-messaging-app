/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar"
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const Profile = ({ profileId }) => {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    firstname: 'blank',
    lastname: 'blank',
    interests: 'blank',
    about: 'blank',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('accessToken');
  
        if (!accessToken) {
          navigate(`/`)
          return;
        }
  
        const url = `${apiUrl}users/profiles/${profileId}`
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        })
        const jsonData = await response.json()
        console.log(jsonData)
        
        if (jsonData) {
          setUser(jsonData)
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  },[])

  return (
    <div>
      <NavigationBar />
      <Container>
        <Row>
          <Col>
            <h2 style={{marginBottom: "40px"}}>{`${user.firstname} ${user.lastname}`}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Interests</h5>
            <p>{user.interests}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>About</h5>
            <p>{user.about}</p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Profile