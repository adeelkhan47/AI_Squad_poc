import openai
import os
from flask import request
from flask_restx import Resource
from langdetect import detect
from os.path import join, dirname
from dotenv import load_dotenv

from . import api, schema

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

OPENAPI_KEY = os.getenv('OPENAPI_KEY')

if OPENAPI_KEY:
    openai.api_key = OPENAPI_KEY

def translate_in_desired_language(text, language):
    params = {
        "engine": "text-davinci-003",
        "prompt": f"Translate the following text into {language}: {text}",
        "temperature": 0,
        "max_tokens": 60,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }
    # Generate the translation using OpenAI's GPT-3 language model
    response = openai.Completion.create(**params)

    # Extract the translated text from the response
    output_text = response.choices[0].text.strip()
    return output_text


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
            detected_language = detect(text)
            result = translate_in_desired_language(text, output_lan)
            result.strip("\"")
            return {"translation": result, "detected_language": detected_language, "error": None}, 200
        except Exception as e:
            return {"translation": None, "error": e.__str__()}, 200
