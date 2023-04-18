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

      <AlertDialogContent maxWidth='490px' width='100%' borderRadius='12px' data-cy='modal-delete'>
        <AlertDialogBody padding='50px 63px 0'>
          <Box display='flex' flexDirection='column' gap='34px' alignItems='center' textAlign='center'>
            <DeleteIcon data-cy='modal-delete-icon' />
            <Text data-cy='modal-delete-title' fontSize='18px' fontWeight='500'>Apakah anda yakin menghapus activity
              <Text as='span' fontWeight='700' display='block'>"{activity?.title || '-'}"?</Text>
            </Text>
          </Box>
        </AlertDialogBody>
        <AlertDialogFooter display='flex' justifyContent='center' gap='20px' padding='43px 0'>
          <Button ref={cancelRef} onClick={onClose} data-cy='modal-delete-cancel-button'>
            Batal
          </Button>
          <Button colorScheme='red' onClick={removeActivity} data-cy='modal-delete-confirm-button'>
            Hapus
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveActivityModal