import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Box,
  Text,
  Button,
  Icon,
  Editable,
  EditablePreview,
  EditableInput,
  useDisclosure,
  Skeleton,
  Checkbox,
  useToast,
} from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'

import { ReactComponent as EmptyImage } from '../assets/todo-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as BackIcon } from '../assets/back.svg'
import { ReactComponent as EditIcon } from '../assets/edit.svg'
import { ReactComponent as SortIcon } from '../assets/sort.svg'
import { ReactComponent as TrashIcon } from '../assets/trash.svg'
import { ReactComponent as InfoIcon } from '../assets/info.svg'

import FormItemModal from '../components/FormItemModal'
import RemoveActivityModal from '../components/RemoveActivityModal'

const Activity = () => {
  const [activityData, setActivityData] = useState(null)
  const [todoList, setTodoList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [type, setType] = useState('add')
  
  const editableRef = useRef()
  const params = useParams()
  const toast = useToast()
  
  const { isOpen: isAddOpen, onOpen: onFormOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  
  useEffect(() => {
    getActivityDetail()
  }, [])
  
  const getActivityDetail = async () => {
    if (!params?.id) return
    setSelectedItem(null)
    
    try {
      const res = await axios.get('https://todo.api.devcode.gethired.id/activity-groups/' + params.id)
      setActivityData(res.data)
      setTodoList(res.data.todo_items)
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleChangeTitle = async (evnt) => {
    const data = {
      title: evnt?.target?.value
    }
    try {
      await axios.patch('https://todo.api.devcode.gethired.id/activity-groups/' + params.id, data)
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleChangeStatus = async (evnt, id) => {
    const data = {
      is_active: evnt.target.checked ? 0 : 1
    }
    try {
      await axios.patch('https://todo.api.devcode.gethired.id/todo-items/' + id, data)
      getActivityDetail()
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleAddItem = () => {
    setType('add')
    setSelectedItem(null)
    onFormOpen()
  }
  
  const handleEditItem = (item) => {
    if (!item) return
    setType('update')
    setSelectedItem(item)
    onFormOpen()
  }
  
  const handleRemoveItem = (item) => {
    if (!item) return
    setSelectedItem(item)
    onDeleteOpen()
  }
  
  const removeItem = async () => {
    if (!selectedItem) return
    
    try {
      await axios.delete('https://todo.api.devcode.gethired.id/todo-items/' + selectedItem.id)
      getActivityDetail()
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
            <Text data-cy='modal-information-title' fontSize='14px' fontWeight='500'>Item berhasil dihapus</Text>
          </Box>
        )
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  const renderEmptyState = () => {
    return (
      <Box pt='60px' display='flex' data-cy='todo-empty-state'>
        <EmptyImage style={{margin: '0 auto'}} />
      </Box>
    )
  }
  
  const renderTodoList = (item, index) => {
    return (
      <Box
        data-cy={'todo-item-'+index}
        key={item.id}
        boxShadow='rgba(0, 0, 0, 0.1) 0px 6px 10px 0px'
        borderRadius='12px'
        bg='white'
        p='26px 28px'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Box display='flex' alignItems='center' gap='15px'>
          <Checkbox data-cy='todo-item-checkbox' defaultChecked={item.is_active === 1 ? false : true} mr='5px' onChange={(evnt) => handleChangeStatus(evnt, item.id)}></Checkbox>
          <Box data-cy='todo-item-priority-indicator' w='9px' h='9px' borderRadius='100%' bg={'priority.'+item.priority}></Box>
          <Text data-cy='todo-item-title' textDecoration={item?.is_active ? 'none' : 'line-through'} color={item.is_active ? 'text.100' : 'text.200'}>{item?.title || '-'}</Text>
          <Icon data-cy='todo-item-edit-button' cursor='pointer' w='20px' h='20px' onClick={() => handleEditItem(item)}>
            <EditIcon />
          </Icon>
        </Box>
        <Icon data-cy='todo-item-delete-button' cursor='pointer' w='24px' h='24px' onClick={() => handleRemoveItem(item)}>
          <TrashIcon />
        </Icon>
      </Box>
    )
  }
  
  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex' alignItems='center' gap='20px'>
          <Link to='/' data-cy='todo-back-button' style={{cursor:'pointer'}}>
            <BackIcon />
          </Link>
          { activityData?.title ? (
            <Editable
              fontWeight='700'
              fontSize='36px'
              defaultValue={activityData?.title || ''}
            >
              <EditablePreview data-cy='todo-title' ref={editableRef} />
              <EditableInput
                maxLength='20' p='0 5px' h='62px'
                onBlur={(evnt) => handleChangeTitle(evnt)}
                onKeyDown={(e) => {if (e.key === 'Enter') handleChangeTitle(e)}}
              />
            </Editable>
          ) : (
            <Skeleton data-cy='todo-title' height='62px' width='250px' />
          )}
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
            onClick={() => handleAddItem()}
          >
            Tambah
          </Button>
        </Box>
      </Box>
      
      { !todoList.length ?
          renderEmptyState() : (
            <Box display='flex' flexDirection='column' gap='10px' mt='50px'>
              { todoList.map((item, index) => (renderTodoList(item, index))) }
            </Box>
          )
      }
      
      { isAddOpen &&
        <FormItemModal
          fetchActivity={getActivityDetail}
          activityData={activityData}
          itemData={selectedItem}
          isOpen={isAddOpen}
          onClose={onAddClose}
          type={type}
        />
      }
      
      { isDeleteOpen &&
        <RemoveActivityModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          activity={selectedItem}
          removeActivity={removeItem}
          type='List Item'
        />
      }
    </>
  )
}

export default Activity