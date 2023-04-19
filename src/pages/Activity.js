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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'

import { ReactComponent as EmptyImage } from '../assets/todo-empty-state.svg'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as BackIcon } from '../assets/back.svg'
import { ReactComponent as EditIcon } from '../assets/edit.svg'
import { ReactComponent as SortIcon } from '../assets/sort.svg'
import { ReactComponent as TrashIcon } from '../assets/trash.svg'
import { ReactComponent as InfoIcon } from '../assets/info.svg'

import { ReactComponent as LatestIcon } from '../assets/latest.svg'
import { ReactComponent as OldestIcon } from '../assets/oldest.svg'
import { ReactComponent as AzIcon } from '../assets/az.svg'
import { ReactComponent as ZaIcon } from '../assets/za.svg'
import { ReactComponent as UnfinishedIcon } from '../assets/unfinished.svg'
import { ReactComponent as CheckIcon } from '../assets/check.svg'

import FormItemModal from '../components/FormItemModal'
import RemoveActivityModal from '../components/RemoveActivityModal'

const Activity = () => {
  const [activityData, setActivityData] = useState(null)
  const [todoList, setTodoList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [type, setType] = useState('add')
  const [currentSort, setSort] = useState({name: 'Terbaru', value: 'sort-latest', icon: <LatestIcon width='20' height='20' />})
  
  const editableRef = useRef()
  const params = useParams()
  const toast = useToast()
  
  const { isOpen: isAddOpen, onOpen: onFormOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  
  const sortList = [
    {name: 'Terbaru', value: 'sort-latest', icon: <LatestIcon width='20' height='20' />},
    {name: 'Terlama', value: 'sort-oldest', icon: <OldestIcon width='20' height='20' />},
    {name: 'A-Z', value: 'sort-az', icon: <AzIcon width='20' height='20' />},
    {name: 'Z-A', value: 'sort-za', icon: <ZaIcon width='20' height='20' />},
    {name: 'Belum Selesai', value: 'sort-unfinished', icon: <UnfinishedIcon width='20' height='20' />},
  ]
  
  useEffect(() => {
    getActivityDetail()
  }, [])
  
  const getActivityDetail = async () => {
    if (!params?.id) return
    setSelectedItem(null)
    
    try {
      const res = await axios.get('https://todo.api.devcode.gethired.id/activity-groups/' + params.id)
      setSort(sortList[0])
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
  
  const handleChangeSort = (sortData) => {
    setSort(sortData)
    if (sortData.value === 'sort-latest') {
      todoList.sort((a,b) => b.id - a.id)
    }
    if (sortData.value === 'sort-oldest') {
      todoList.sort((a,b) => a.id - b.id)
    }
    if (sortData.value === 'sort-az') {
      todoList.sort((a,b) => a.title.localeCompare(b.title))
    }
    if (sortData.value === 'sort-za') {
      todoList.sort((a,b) => b.title.localeCompare(a.title))
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
      <Box pt='60px' display='flex' data-cy='todo-empty-state' cursor='pointer' onClick={() => handleAddItem()}>
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
        hidden={currentSort?.value === 'sort-unfinished' && item.is_active === 0 ? true : false}
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
            <Menu>
              <MenuButton data-cy='todo-sort-button'
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
              </MenuButton>
              <MenuList data-cy='sort-parent'>
                {
                  sortList.map((sortData, index) => (
                    <MenuItem
                      key={index}
                      data-cy="sort-selection"
                      p='14px 22px'
                      display='flex'
                      alignItems='center'
                      position='relative'
                      gap='15px'
                      onClick={() => handleChangeSort(sortData)}
                    >
                      <Icon w='20px' h='20px' top='3px' position='relative'>
                        {sortData.icon}
                      </Icon>
                      {sortData.name}
                      { currentSort?.value === sortData.value &&
                        <Icon position='absolute' right='22px' top='16px' w='18px' h='18px'>
                          <CheckIcon width={24} height={24} />
                        </Icon>
                      }
                    </MenuItem>
                  ))
                }
              </MenuList>
              
            </Menu>
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