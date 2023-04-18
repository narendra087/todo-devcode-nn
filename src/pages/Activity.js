import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Box, Text, Button, Grid, GridItem, Icon } from "@chakra-ui/react";

import { ReactComponent as EmptyImage } from '../assets/activity-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as TrashIcon } from '../assets/trash.svg'

const Activity = () => {
  const [isLoading, setLoading] = useState(false)
  const [activityData, setActivityData] = useState([])
  
  useEffect(() => {
    getActivityData()
  }, [])
  
  const getActivityData = async () => {
    setLoading(true)
    
    try {
      const res = await axios.get('https://todo.api.devcode.gethired.id/activity-groups?email=personal@gmail.com')
      setActivityData(res.data.data)
    } catch (error) {
      console.log(error)
    }
    
    setLoading(false)
  }
  
  const addActivity = async () => {
    setLoading(true)
    
    const data = {
      title: 'New Activity',
      email: 'personal@gmail.com'
    }
    
    try {
      const res = await axios.post('https://todo.api.devcode.gethired.id/activity-groups', data)
      setActivityData([...activityData, res.data])
    } catch (error) {
      console.log(error)
    }
    
    setLoading(false)
  }
  
  const formatDate = (date) => {
    if (!date) return
    const tempDate = new Date(date)
    const formatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    
    return tempDate.toLocaleDateString('id-ID', formatOptions)
  }
  
  const renderEmptyState = () => {
    return (
      <Box pt='60px' display='flex'>
        <EmptyImage style={{margin: '0 auto'}} />
      </Box>
    )
  }
  
  const renderActivityList = () => {
    return (
      <Grid templateColumns='repeat(4, 1fr)' gap='20px' pt='60px'>
        {
          activityData.map((activity) => (
            <GridItem
              key={activity.id}
              borderRadius='12px'
              boxShadow='0px 6px 10px 0px #0000001A'
              padding='22px 27px'
              w='100%'
              h='234px'
              bg='white'
              display='flex'
              flexDirection='column'
              justifyContent='space-between'
              cursor='pointer'
            >
              <Text fontSize='18px' fontWeight='700'>{activity?.title || '-'}</Text>
              <Box display='flex' alignItems='center' justifyContent='space-between' gap='6px'>
                <Text fontSize='14px' fontWeight='500' color='text.200'>{activity?.created_at ? formatDate(activity.created_at) : '-'}</Text>
                <Icon cursor='pointer' w='24px' h='24px'>
                  <TrashIcon />
                </Icon>
              </Box>
            </GridItem>
          ))
        }
      </Grid>
    )
  }
  
  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Text fontSize='36px' fontWeight='700'>Activity</Text>
        <Button
          colorScheme='linkedin'
          bg='primary.100'
          leftIcon={<AddIcon />}
          onClick={() => addActivity()}
        >
          Tambah
        </Button>
      </Box>
      { !activityData.length ?
          renderEmptyState() :
          renderActivityList()
      }
    </>
  )
}

export default Activity