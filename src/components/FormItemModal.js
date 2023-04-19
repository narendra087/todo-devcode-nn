import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Text,
} from '@chakra-ui/react'

import { ReactComponent as ChevronDownIcon } from '../assets/chevron-down.svg'
import { ReactComponent as CheckIcon } from '../assets/check.svg'

const FormItemModal = ({fetchActivity, activityData, itemData, isOpen, onClose, type}) => {
  const priorityList = [
    {name: 'Very High', value: 'very-high'},
    {name: 'High', value: 'high'},
    {name: 'Medium', value: 'normal'},
    {name: 'Low', value: 'low'},
    {name: 'Very Low', value: 'very-low'},
  ]
  
  const [ listName, setListName ] = useState(itemData ? itemData.title : '')
  const [ currentPriority, setPriority ] = useState(null)
  
  useEffect(() => {
    if (type === 'update') {
      setListName(itemData.title)
      
      const indexPriority = priorityList.findIndex((x) => x.value === itemData.priority)
      if (indexPriority !== -1) {
        setPriority(priorityList[indexPriority])
      }
    }
  }, [])
  
  const handleAddItem = async () => {
    if (!listName || !currentPriority) return
    
    const data = {
      activity_group_id: activityData.id,
      title: listName,
      priority: currentPriority.value || 'very-high'
    }
    
    try {
      if (type === 'update') {
        await axios.patch('https://todo.api.devcode.gethired.id/todo-items/' + itemData.id, data)
      } else {
        await axios.post('https://todo.api.devcode.gethired.id/todo-items', data)
      }
      fetchActivity()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <Modal
    blockScrollOnMount={true}
    isCentered
    isOpen={isOpen}
    onClose={onClose}
  >
      <ModalOverlay />
      <ModalContent data-cy='modal-add' borderRadius='12px' w='100%' maxW='830px'>
        <ModalHeader data-cy='modal-add-title' borderBottom='1px solid #E5E5E5' p='24px 30px 19px' fontSize='18px' fontWeight='600'>Tambah List Item</ModalHeader>
        <ModalCloseButton data-cy='modal-add-close-button' top='24px' right='30px' />
        <ModalBody p='38px 30px 23px'>
          <FormControl>
            <FormLabel data-cy='modal-add-name-title' fontSize='12px' fontWeight='600'>NAMA LIST ITEM</FormLabel>
            <Input data-cy='modal-add-name-input' maxLength='25' placeholder='Tambahkan nama list item' value={listName} onChange={(e) => setListName(e.target.value)} />
          </FormControl>
          <FormControl mt={'26px'}>
            <FormLabel data-cy='modal-add-priority-title' fontSize='12px' fontWeight='600'>PRIORITY</FormLabel>
            <Menu>
              <MenuButton
                data-cy='modal-add-priority-dropdown'
                as={Button}
                borderRadius='6px' p='14px 15px' bg='#FFF' border='1px solid #E5E5E5'
                textAlign='left'
                fontSize='16px'
                fontWeight='400'
                minW='205px'
                rightIcon={<ChevronDownIcon />}
              >
                { currentPriority ? (
                    <Box data-cy='modal-add-priority-item' display='flex' alignItems='center' gap='20px'>
                      <Box w='14px' h='14px' borderRadius='100%' bg={'priority.' + currentPriority.value}></Box>
                      {currentPriority.name}
                    </Box>
                  ) :
                  <Text data-cy='modal-add-priority-item'>
                    Pilih priority
                  </Text>
                }
              </MenuButton>
              <MenuList>
                {
                  priorityList.map((priority, index) => (
                    <MenuItem data-cy={'modal-add-priority-' + priority.value} key={index} h='52px' p='14px 15px' display='flex' alignItems='center' gap='20px' position='relative' onClick={() => setPriority(priority)}>
                      <Box w='14px' h='14px' borderRadius='100%' bg={'priority.' + priority.value}></Box>
                      {priority.name}
                      { currentPriority?.name === priority.name &&
                        <Icon position='absolute' right='15px' top='20px' w='18px' h='18px'>
                          <CheckIcon />
                        </Icon>
                      }
                    </MenuItem>
                  ))
                }
              </MenuList>
            </Menu>
          </FormControl>
        </ModalBody>

        <ModalFooter borderTop='1px solid #E5E5E5' p='15px 30px 19px'>
          <Button
            data-cy='modal-add-save-button'
            colorScheme='linkedin'
            bg='primary.100'
            isDisabled={!listName}
            onClick={() => handleAddItem()}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FormItemModal