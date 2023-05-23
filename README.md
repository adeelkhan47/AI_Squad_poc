# AI Squad POC Translator

### Speech To Text Endpoint

#### Endpoint:

**/detector/speechtotext**

#### Requirements:

* Must have **ASSEMBLYAI_KEY** in dotenv file, so that it can be import in /src/api/detector/endpoint.py.
* Audio files should be placed in /audios directory in any format .wav, .mp3 etc. For example, test audio file Recording.mp3 place in /audios directory.

#### Swagger UI Field:

* To get response from speech to text endpoint field **voice_path** is must and it can be relative to app.py file. For example, to use /audios/Recording.mp3 voice_path should be "**../audios/Recording.mp3**"




