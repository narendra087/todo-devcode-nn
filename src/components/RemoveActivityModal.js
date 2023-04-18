import React, { useRef } from 'react'
import {
  Button,
  Text,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

import { ReactComponent as DeleteIcon } from '../assets/delete.svg'

const RemoveActivityModal = ({isOpen, onClose, activity, removeActivity}) => {
  const cancelRef = useRef()
  return (
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent minWidth='490px' borderRadius='12px'>
        <AlertDialogBody padding='50px 63px 0'>
          <Box display='flex' flexDirection='column' gap='34px' alignItems='center' textAlign='center'>
            <DeleteIcon />
            <Text fontSize='18px' fontWeight='500'>Apakah anda yakin menghapus activity
              <Text as='span' fontWeight='700' display='block'>"{activity?.title || '-'}"?</Text>
            </Text>
          </Box>
        </AlertDialogBody>
        <AlertDialogFooter display='flex' justifyContent='center' gap='20px' padding='43px 0'>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='red' onClick={removeActivity}>
            Hapus
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveActivityModal