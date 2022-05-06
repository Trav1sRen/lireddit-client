import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea
} from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';
import { VscSaveAs } from 'react-icons/vsc';
import { Post, useUpdatePostMutation } from '../generated/graphql';

interface UpdatePostModalProps {
  post: Post;
  isModalOpen: boolean;
  onModalClose: () => void;
}

const UpdatePostModal = ({
  post: { postUuid, title, text },
  isModalOpen,
  onModalClose
}: UpdatePostModalProps) => {
  const [{ fetching }, updatePost] = useUpdatePostMutation();

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedText, setUpdatedText] = useState(text);

  const [isTitleUpdating, setIsTitleUpdating] = useState(false);
  const [isTextUpdating, setIsTextUpdating] = useState(false);

  const [textHeight, setTextHeight] = useState(0);

  const initialUpdatePostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    onModalClose();

    setIsTitleUpdating(false);
    setIsTextUpdating(false);

    // Reset the form if modal is closed unexpectedly
    setUpdatedTitle(title);
    setUpdatedText(text);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      size="3xl"
      initialFocusRef={initialUpdatePostRef}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent ref={initialUpdatePostRef}>
        <ModalHeader pb={10}>
          {isTitleUpdating ? (
            <InputGroup>
              <Input
                defaultValue={updatedTitle}
                fontSize="4xl"
                variant="flushed"
                onChange={({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) =>
                  setUpdatedTitle(value)
                }
              />
              <InputRightElement
                children={
                  <Icon cursor="pointer" color="blue.500" as={VscSaveAs} w={5} h={5} />
                }
                onClick={() => setIsTitleUpdating(false)}
              />
            </InputGroup>
          ) : (
            <Flex align="center">
              <Heading fontSize="4xl" fontFamily="'PT Serif Caption', sans-serif">
                {updatedTitle}
              </Heading>
              <EditIcon
                cursor="pointer"
                ml={6}
                onClick={() => {
                  setIsTitleUpdating(true);
                  setIsTextUpdating(false);
                }}
              />
            </Flex>
          )}
        </ModalHeader>
        <ModalBody>
          {isTextUpdating ? (
            <Flex align="center">
              <Textarea
                defaultValue={updatedText}
                variant="flushed"
                minH={textHeight + 15}
                fontSize="xl"
                lineHeight="base"
                onChange={({
                  currentTarget: { value }
                }: ChangeEvent<HTMLTextAreaElement>) => setUpdatedText(value)}
              />
              <Icon
                cursor="pointer"
                color="blue.500"
                as={VscSaveAs}
                w={5}
                h={5}
                ml={2}
                onClick={() => setIsTextUpdating(false)}
              />
            </Flex>
          ) : (
            <Flex align="center">
              <Text fontSize="xl" ref={textRef} whiteSpace="pre-line">
                {updatedText}
              </Text>
              <EditIcon
                cursor="pointer"
                ml={6}
                onClick={() => {
                  setTextHeight(textRef.current?.clientHeight!);
                  setIsTextUpdating(true);
                  setIsTitleUpdating(false);
                }}
              />
            </Flex>
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between" mt={10}>
          <Button
            colorScheme="blue"
            disabled={
              (updatedTitle === title && updatedText === text) ||
              isTitleUpdating ||
              isTextUpdating
            }
            isLoading={fetching}
            onClick={async () => {
              const { data, error } = await updatePost({
                postUuid,
                title: updatedTitle === title ? undefined : updatedTitle,
                text: updatedText === text ? undefined : updatedText
              });

              if (!error && data?.updatePost) {
                onClose();
              }
            }}
          >
            Update
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdatePostModal;
