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
import { Link } from 'react-router-dom';

import RemoveActivityModal from '../components/RemoveActivityModal';

import { ReactComponent as EmptyImage } from '../assets/activity-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as TrashIcon } from '../assets/trash.svg'
import { ReactComponent as InfoIcon } from '../assets/info.svg'

const Dashboard = () => {
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
      getActivityData()
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
            data-cy='modal-information'
            mt='15px'
            p='17px 27px'
            h='58px'
            w='100%'
            maxW='490px'
            bg='white'
            borderRadius='12px'
            display='flex'
            alignItems='center'
            gap='10px'
            boxShadow='0px 4px 10px 0px #0000001A'
          >
            <InfoIcon data-cy='modal-information-icon' />
            <Text data-cy='modal-information-title' fontSize='14px' fontWeight='500'>Activity berhasil dihapus</Text>
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
      <Box pt='60px' display='flex' data-cy='activity-empty-state' cursor='pointer' onClick={() => addActivity()}>
        <EmptyImage style={{margin: '0 auto'}} />
      </Box>
    )
  }
  
  const renderActivityList = () => {
    return (
      <Grid templateColumns='repeat(4, 1fr)' gap='20px' pt='60px'>
        {
          activityData.map((activity, index) => (
            <GridItem
              key={activity.id}
              borderRadius='12px'
              boxShadow='0px 6px 10px 0px #0000001A'
              padding='22px 27px'
              w='100%'
              h='234px'
              bg='white'
              transition='all 0.3s'
              _hover={{
                bg: '#f7f7f7'
              }}
              display='flex'
              flexDirection='column'
            >
              <Link
                to={'/activity/' + activity.id}
                data-cy={'activity-item-' + index}
                className='activity-item-link'
              >
                <Text
                  data-cy='activity-item-title'
                  fontSize='18px'
                  fontWeight='700'
                  w='100%'
                >
                  {activity?.title || '-'}
                </Text>
              </Link>
              <Box display='flex' alignItems='center' justifyContent='space-between' gap='6px' zIndex='100'>
                <Text data-cy='activity-item-date' fontSize='14px' fontWeight='500' color='text.200'>{activity?.created_at ? formatDate(activity.created_at) : '-'}</Text>
                <Icon data-cy='activity-item-delete-button' cursor='pointer' w='24px' h='24px' onClick={() => handleRemoveActivity(activity)}>
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

export default Dashboard