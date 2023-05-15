from flask_restx import fields

from . import api

GetTranslation = api.model(
    "GetTranslation",
    {
        "translation": fields.String(allow_null=True),
        "detected_language": fields.String(allow_null=True),
        "error": fields.String(allow_null=True, skip_none=True),
    },
)
