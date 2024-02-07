/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar"
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const Thread = ({ threadId }) => {
  let navigate = useNavigate();

  const [thread, setThread] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('accessToken');
  
        if (!accessToken) {
          navigate(`/`)
          return;
        }
  
        const url = `${apiUrl}users/threads/${threadId}`
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        })
        const jsonData = await response.json()
        //console.log(jsonData)
        
        if (jsonData) {
          setThread(jsonData.thread)
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  },[])

  if (!thread) return (<></>)

  return (
    <div>
      <NavigationBar />
      <Container>
        <Row>
          <Col>
            <h1>{thread.title}</h1>
          </Col>
        </Row>
        {thread.messages.map(msg => (
          <Row key={msg._id}>
            <Col>
              <Card style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', backgroundColor: '#f8f9fa' }}>
                <Card.Body>
                  <Card.Title>{msg.name}</Card.Title>
                  <Card.Text>{msg.msg}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  )
}

export default Thread