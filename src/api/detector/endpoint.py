import json
from pathlib import Path

import openai
import os
from flask import request
from flask_restx import Resource
from os.path import join, dirname
from dotenv import load_dotenv

from . import api, schema
from .speech_util import SpeechToText

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

OPENAPI_KEY = os.getenv('OPENAPI_KEY')
ASSEMBLYAI_KEY = os.getenv('ASSEMBLYAI_KEY')
ROOT_DIR = Path(__file__).parents[3]
AUDIOS_PATH = os.path.join(ROOT_DIR, "audios")

if OPENAPI_KEY:
    openai.api_key = OPENAPI_KEY

def translate_in_desired_language(text, language):
    prompt = f'''
    Your task is to identify the language (in ISO Language Code) the text enclosed in triple back ticks is written in. \
    Then translate that piece of text into the langauge prescribed in <>. \
    The output should be in JSON using 'translation' and 'detected_language' as keys. \
    
    <{language}>
    ```{text}```
    '''
    params = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "max_tokens": 60,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }
    # Generate the translation using OpenAI's GPT-3 language model
    response = openai.ChatCompletion.create(**params)

    # Extract the translated text from the response
    output_dict = json.loads(response.choices[0].message.content)
    return output_dict


@api.route("")
class TranslatorOperation(Resource):
    @api.doc("Get Translated to Desired Language")
    @api.marshal_list_with(schema.GetTranslation)
    @api.param("text", required=True)
    @api.param("output_language", required=True)
    def get(self):
        try:
            args = request.args.copy()
            output_lan = args.get("output_language")
            text = args.get("text")
            output_dict = translate_in_desired_language(text, output_lan)
            return {"translation": output_dict['translation'], "detected_language": output_dict['detected_language'], "error": None}, 200
        except Exception as e:
            return {"translation": None, "error": e.__str__()}, 200


@api.route("/speechtotext")
class GetSpeechToText(Resource):
    @api.doc("Speech to Text endpoint")
    @api.marshal_list_with(schema.GetSpeechToText)
    @api.param("audio_path", required=True)
    def get(self):
        try:
            args = request.args.copy()
            audio_path = args.get("audio_path")
            upload_url = SpeechToText().upload_file(ASSEMBLYAI_KEY, audio_path)
            transcript = SpeechToText().create_transcript(ASSEMBLYAI_KEY, upload_url)
            return {"text": transcript['text'], 'language_code': transcript['language_code'], "error": None}, 200
        except Exception as e:
            return {"translation": None, "error": e.__str__()}, 200

    def post(self):
        try:
            file = request.files['file']
            file_path = os.path.join(AUDIOS_PATH, file.filename)
            file.save(file_path)
            return {'message': 'File uploaded successfully'}
        except Exception as e:
            return {"translation": None, "error": e.__str__()}, 200
