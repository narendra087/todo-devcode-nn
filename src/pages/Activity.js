import React, { useState } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

import { ReactComponent as EmptyImage } from '../assets/todo-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'

const Activity = () => {
  const [isLoading, setLoading] = useState(false)
  const [activityData, setActivityData] = useState(null)
  const [todoList, setTodoList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  
  const renderEmptyState = () => {
    return (
      <Box pt='60px' display='flex' data-cy='activity-empty-state'>
        <EmptyImage style={{margin: '0 auto'}} />
      </Box>
    )
  }
  
  const renderTodoList = () => {
    return <>Todo List</>
  }
  
  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Text fontSize='36px' fontWeight='700' data-cy='activity-title'>{ activityData?.title || 'New Activity' }</Text>
        <Button
          data-cy='activity-add-button'
          colorScheme='linkedin'
          bg='primary.100'
          leftIcon={<AddIcon />}
        >
          Tambah
        </Button>
      </Box>
      
      { !todoList.length ?
          renderEmptyState() :
          renderTodoList()
      }
    </>
  )
}

export default Activity