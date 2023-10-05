import {
  Box,
  Text,
  SlideFade,
  Stack,
  Heading,
  VStack,
  Link,
  HStack,
  useClipboard,
  useToast,
  Divider,
  Flex,
  FormControl,
  Select,
} from '@chakra-ui/react';

import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { PlayIcon, PauseIcon } from '@chakra-ui/icons';

import Recorder from './Recorder';
import PageCenter from './PageCenter';

import audioBufferToWav from 'audiobuffer-to-wav';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA_7JvtZd8mvZ4JIAYSGjEUF28PA3TBqc4",
  authDomain: "tete-80d6d.firebaseapp.com",
  databaseURL: "https://tete-80d6d.firebaseio.com",
  projectId: "tete-80d6d",
  storageBucket: "tete-80d6d.appspot.com",
  messagingSenderId: "1030692630539",
  appId: "1:1030692630539:web:6c4e7733e1885bf185570e"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);


const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

const blobToAudioBuffer = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return await audioContext.decodeAudioData(arrayBuffer);
};

const getMp3LinkAndText = async (counter) => {
  try {
    const mp3Ref = ref(database, `mp3Links/${counter}`);  // Accédez à la bonne référence
    const snapshot = await get(mp3Ref);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);
      return { link: data.link, text: data.text };  // Récupérez le lien et le texte
    } else {
      console.error('No data found for the specified counter value.');
      return { link: null, text: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { link: null, text: null };
  }
};


const getMp3Link = async (counter) => {
  try {
    const mp3Ref = ref(database, `mp3Links/`);
    const snapshot = await get(mp3Ref);
    if (snapshot.exists()) {
      console.log(snapshot.val()[counter]);
      return snapshot.val()[1];
    } else {
      console.error('No mp3 link found for the specified counter value.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching mp3 link:', error);
    return null;
  }
};



const RecordSpeech = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [textResponse, setTextResponse] = useState('');
  const [subText, setSubText] = useState('Soutien à lindpendance au logement');
  const [counter, setCounter] = useState(1);
  const audioRef = useRef(null);
  const [operation, setOperation] = useState('transcribe');
  const [mp3Text, setMp3Text] = useState(null);

  const maxRecordingTimeoutRef = useRef(null);

  const { onCopy } = useClipboard(textResponse);
  const toast = useToast();


  const copyText = () => {
    toast({
      variant: 'left-accent',
      title: '',
      description: 'Text copied to clipboard',
      status: 'success',
      duration: 1500,
    });
    onCopy();
  };

  const [mp3Link, setMp3Link] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      const { link, text } = await getMp3LinkAndText(counter);
      setMp3Link(link);
      setMp3Text(text);  // Définissez le texte
    };

    fetchData();
  }, [counter]);

  const playAudio = () => {
    const audio = new Audio(mp3Link);
    audio.play();
  };

  useEffect(() => {
    audioRef.current = new Audio(mp3Link);
  }, [mp3Link]);




  useEffect(() => {
    if (processingText === 'Max. recording limit crossed') {
      setIsProcessing(true);
    }

    return () => {
      clearTimeout(maxRecordingTimeoutRef.current);
    };
  }, [processingText]);

  const handleOperationChange = (e) => {
    setOperation(e.target.value);

    if (e.target.value === 'translate') {
      setSubText('Translate audio into English text');
    } else if (e.target.value === 'transcribe') {
      setSubText('Transcribe audio into input Language');
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setCounter(prevCounter => prevCounter + 1);  // Incrémentation du compteur ici

    setProcessingText('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = isSafari() ? 'audio/mp4' : 'audio/webm';
      const options = { mimeType };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // Set the 10-second timer
      maxRecordingTimeoutRef.current = setTimeout(() => {
        console.log('Max. recording limit reached');
        setProcessingText('Max. recording limit crossed');
        setIsRecording(false);
        mediaRecorderRef.current.stop();
      }, 10000);
    } catch (error) {
      console.error('Error during startRecording:', error);
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob, errorCallback) => {
    setIsProcessing(true);

    try {
      const audioBuffer = await blobToAudioBuffer(audioBlob);
      const wavArrayBuffer = audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

      const formData = new FormData();

      formData.append('file', wavBlob, 'audio.wav');
      console.log(counter);

      const response = await fetch(
        operation === 'translate' ? '/api/translations' : '/api/transcriptions?counter=${counter}',
        {
          method: 'POST',
          headers: {
            'x-counter': counter,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        errorCallback(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setTextResponse(data.text);
    } catch (error) {
      console.error('Error during uploadAudio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    maxRecordingTimeoutRef.current &&
      clearTimeout(maxRecordingTimeoutRef.current);

    if (!mediaRecorderRef.current) {
      console.error('MediaRecorder is not initialized.');
      setIsRecording(false);
      return;
    }

    setIsRecording(false);

    setProcessingText('Processing...');
    mediaRecorderRef.current.stop();

    const onDataAvailable = (event) => {
      uploadAudio(event.data, (error) => {
        console.error(error);
      });
      mediaRecorderRef.current.removeEventListener(
        'dataavailable',
        onDataAvailable
      );
    };

    mediaRecorderRef.current.addEventListener('dataavailable', onDataAvailable);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };


  return (
    <Box w={'100vw'}>

      <PageCenter>
        <Stack
          height='auto'
          width='100%'
          alignItems='center'
          justify={'center'}
          spacing={4}
        >
          <VStack spacing={2} pt={5}>
            <Heading
              fontSize={{ base: '3xl', lg: '4xl' }}
              bgGradient='linear(to-r, teal.600, teal.400, teal.300, teal.400)'
              bgClip='text'
              letterSpacing='tight'
              textAlign={'center'}
            >
              Questionnaire basé par la voix
            </Heading>
            <Heading
              fontSize='md'
              color={'gray.600'}
              letterSpacing='tight'
              mb='2'
              fontWeight={'semibold'}
              textAlign={'center'}
            >
              {subText}
            </Heading>
          </VStack>
          <Divider />
          <Text>Question : {counter} / 22</Text>
          {mp3Link && (
            <Button
              onClick={toggleAudio}
              colorScheme="teal"
              size="lg"
              iconSpacing={4}
              rightIcon={audioRef.current && !audioRef.current.paused ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
            >
              Écouter
            </Button>
          )}
          {mp3Text && (  // Si mp3Text est défini, affichez-le
            <Text mt={4}>{mp3Text}</Text>
          )}

          <Flex w='100%' pb={5}>
            <FormControl
              display={'flex'}
              flexDirection={'column'}
              justify='center'
              alignItems='center'
            >

            </FormControl>
          </Flex>
          <SlideFade in={textResponse !== ''} offsetY='20px'>
            <Box
              w='80vw'
              h='10vh'
              bgColor={'gray.200'}
              p={4}
              borderRadius='lg'
              overflowY='auto'
            >
              <Text>{textResponse}</Text>
            </Box>
            <HStack justify={'space-between'} p={'2'}>
              <DeleteIcon
                color='red.500'
                onClick={() => setTextResponse('')}
                cursor={'pointer'}
              />{' '}
              <CopyIcon
                color='green.500'
                onClick={copyText}
                cursor={'pointer'}
              />
            </HStack>
          </SlideFade>
          <Recorder
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
          <Text
            visibility={isProcessing ? 'visible' : 'hidden'}
            color='teal.600'
          >
            {processingText}
          </Text>
          <VStack spacing={0}>
           
            <Box
              w={{ base: '50%', lg: '90%' }}
              height={'15vh'}
              overflowY='auto'
            >

      
            </Box>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize={'sm'} fontWeight={'semibold'} color='gray.500'>
              Developed by:{' '}
              <Text as='span'>
                <Link
                  href='https://www.linkedin.com/in/hessovalaiswallis/'
                  color='blue.400'
                  _hover={{ color: 'blue.500' }}
                  isExternal
                >
                  HES-SO Valais/Wallis
                </Link>
              </Text>
            </Text>
            <Text fontSize={'sm'} fontWeight={'semibold'} color='gray.500'>
              GitHub{' '}
              <Text as='span'>
                <Link
                  href='https://github.com/lberthod/langchainwhisperjs'
                  color='blue.400'
                  _hover={{ color: 'blue.500' }}
                  isExternal
                >
                  Repo
                </Link>
              </Text>
            </Text>
          </VStack>
        </Stack>
      </PageCenter>
    </Box>
  );
};

export default RecordSpeech;
