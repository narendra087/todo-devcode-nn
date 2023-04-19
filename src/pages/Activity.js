import React, { useState, useRef } from 'react'
import {
  Box,
  Text,
  Button,
  Icon,
  Editable,
  EditablePreview,
  EditableInput,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { ReactComponent as EmptyImage } from '../assets/todo-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as BackIcon } from '../assets/back.svg'
import { ReactComponent as EditIcon } from '../assets/edit.svg'
import { ReactComponent as SortIcon } from '../assets/sort.svg'

const Activity = () => {
  const [isLoading, setLoading] = useState(false)
  const [activityData, setActivityData] = useState(null)
  const [todoList, setTodoList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  
  const editableRef = useRef()
  
  const renderEmptyState = () => {
    return (
      <Box pt='60px' display='flex' data-cy='todo-empty-state'>
        <EmptyImage style={{margin: '0 auto'}} />
      </Box>
    )
  }
  
  const renderTodoList = () => {
    return <>Todo List</>
  }
  
  const handleChangeTitle = (evnt) => {
    console.log(evnt?.target?.value)
  }
  
  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex' alignItems='center' gap='20px'>
          <Link to='/' data-cy='todo-back-button' style={{cursor:'pointer'}}>
            <BackIcon />
          </Link>
          <Editable
            fontWeight='700'
            fontSize='36px'
            defaultValue={activityData?.title || 'New Activity'}
            onBlur={(evnt) => handleChangeTitle(evnt)}
          >
            <EditablePreview data-cy='todo-title' ref={editableRef} />
            <EditableInput maxLength='20' p='0 5px' h='62px' />
          </Editable>
          <Icon data-cy='todo-title-edit-button' cursor='pointer' onClick={() => editableRef.current.focus()}>
            <EditIcon />
          </Icon>
        </Box>
        <Box display='flex' alignItems='center' gap='20px'>
          { todoList.length > 0 &&
            <Box data-cy='todo-sort-button'
              w='54px' h='54px'
              borderRadius='100%'
              display='flex' alignItems='center' justifyContent='center'
              border='1px solid #E5E5E5'
              _hover={{
                borderColor: 'primary.100'
              }}
              cursor='pointer'
            >
              <Icon w='24px' h='24px'>
                <SortIcon />
              </Icon>
            </Box>
          }
          <Button
            data-cy='todo-add-button'
            colorScheme='linkedin'
            bg='primary.100'
            leftIcon={<AddIcon />}
          >
            Tambah
          </Button>
        </Box>
      </Box>
      
      { !todoList.length ?
          renderEmptyState() :
          renderTodoList()
      }
    </>
  )
}

export default Activity