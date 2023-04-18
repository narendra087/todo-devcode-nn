import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {
  Box,
  Text,
  Button,
  Grid,
  GridItem,
  Icon,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import RemoveActivityModal from '../components/RemoveActivityModal';

import { ReactComponent as EmptyImage } from '../assets/activity-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as TrashIcon } from '../assets/trash.svg'
import { ReactComponent as InfoIcon } from '../assets/info.svg'

const Activity = () => {
  const [isLoading, setLoading] = useState(false)
  const [activityData, setActivityData] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  
  const toast = useToast()
  
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  
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
  
  const handleRemoveActivity = (activity) => {
    if (!activity) return
    setSelectedActivity(activity)
    onDeleteOpen()
  }
  
  const removeActivity = async () => {
    if (!selectedActivity) return
    setLoading(true)
    
    try {
      const res = await axios.delete(`https://todo.api.devcode.gethired.id/activity-groups/${selectedActivity.id}`)
      getActivityData()
      onDeleteClose()
      
      toast({
        position: 'top',
        duration: '3000',
        render: () => (
          <Box
            mt='15px'
            p='17px 27px'
            h='58px'
            w='490px'
            bg='white'
            borderRadius='12px'
            display='flex'
            alignItems='center'
            gap='10px'
            boxShadow='0px 4px 10px 0px #0000001A'
          >
            <InfoIcon />
            <Text fontSize='14px' fontWeight='500'>Activity berhasil dihapus</Text>
          </Box>
        )
      })
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
      <Box pt='60px' display='flex' data-cy='activity-empty-state'>
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
                <Icon cursor='pointer' w='24px' h='24px' onClick={() => handleRemoveActivity(activity)}>
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
        <Text fontSize='36px' fontWeight='700' data-cy='activity-title'>Activity</Text>
        <Button
          data-cy='activity-add-button'
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
      
      { isDeleteOpen &&
        <RemoveActivityModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          activity={selectedActivity}
          removeActivity={removeActivity}
        />
      }
    </>
  )
}

export default Activity