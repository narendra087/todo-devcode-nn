import React, { useState } from 'react'
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
} from '@chakra-ui/react'

import { ReactComponent as ChevronDownIcon } from '../assets/chevron-down.svg'
import { ReactComponent as CheckIcon } from '../assets/check.svg'

const FormItemModal = ({isOpen, onClose}) => {
  const priorityList = [
    {name: 'Very High', dataCy:'modal-add-priority-very-high', color: 'priority.vh'},
    {name: 'High', dataCy:'modal-add-priority-high', color: 'priority.h'},
    {name: 'Medium', dataCy:'modal-add-priority-medium', color: 'priority.m'},
    {name: 'Low', dataCy:'modal-add-priority-low', color: 'priority.l'},
    {name: 'Very Low', dataCy:'modal-add-priority-very-low', color: 'priority.vl'},
  ]
  
  const [ listName, setListName ] = useState('')
  const [ currentPriority, setPriority ] = useState(null)
  
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
            <Input data-cy='modal-add-name-input' maxLength='25' value={listName} onChange={(e) => setListName(e.target.value)} />
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
                      <Box w='14px' h='14px' borderRadius='100%' bg={currentPriority.color}></Box>
                      {currentPriority.name}
                    </Box>
                  ) :
                  'Pilih priority'
                }
              </MenuButton>
              <MenuList>
                {
                  priorityList.map((priority, index) => (
                    <MenuItem data-cy={priority.dataCy} key={index} h='52px' p='14px 15px' display='flex' alignItems='center' gap='20px' position='relative' onClick={() => setPriority(priority)}>
                      <Box w='14px' h='14px' borderRadius='100%' bg={priority.color}></Box>
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
          <Button data-cy='modal-add-save-button' colorScheme='linkedin' bg='primary.100' isDisabled={!listName || !currentPriority}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FormItemModal