import { withFileUpload } from 'next-multiparty';
import { promises as fsPromises } from 'fs';
import { OpenAIApi, Configuration } from 'openai';
import { Readable } from 'stream';
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from 'firebase/app';

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

export const config = {
  api: {
    bodyParser: false,
  },
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function chat(input) {
  const messages = [{ role: "user", content: input }];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0,
  });

  return response.data.choices[0].message.content;
}

export default withFileUpload(async (req, res) => {
  const file = req.file;
  const counter = req.headers['x-counter'];

  console.log("counter : " + counter);  // Ajouter cette ligne dans la fonction du serveur

  if (!file) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(400).send('No file uploaded');
    return;
  }

  try {
    const fileBuffer = await fsPromises.readFile(file.filepath);
    const audioReadStream = Readable.from(fileBuffer);
    audioReadStream.path = 'audio.wav';

    const response = await openai.createTranscription(
      audioReadStream,
      'whisper-1'
    );

    const { text } = response.data;


    const promptTemplate = `
      Prends la phrase suivante {question}, et donne par rapport aus sens du oui ou du non en ne répondant que par un et un seul et unique chiffre soit  1 pour oui ou 2 pour non": 
      `;
    console.log(text);
    const prompt = promptTemplate.replace("{question}", text);

    chat(prompt)
      .then((response) => {
        console.log(response);
        const responseRef = ref(database, `Userx/${counter}`);  // Créez une référence à l'emplacement où vous souhaitez stocker la réponse
        set(responseRef, { response: response })  // Téléversez la réponse à la base de données
          .then(() => {
            console.log('Data saved successfully.');
          })
          .catch((error) => {
            console.error('Error saving data:', error);
          });
      })
      .catch((error) => console.error(error));


    console.log("oki" + response);
    // console.log("counternx " + counter);
    // cröe fonction 

    if (text) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ text: text });
    } else {
      res.status(400).send(new Error('No text returned'));
    }
  } catch (error) {
    console.log('OPEN AI ERROR:');
    console.log(error.message);
    res.status(400).send(new Error(error.message));
  }
});
