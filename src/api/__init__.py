from http import HTTPStatus

from flask import Blueprint
from flask_restx import Api
from werkzeug.exceptions import BadRequest, Forbidden, NotFound, Unauthorized

from .detector.endpoint import api as detector_api

blueprint = Blueprint("api", __name__)

api = Api(blueprint, title="AI_Squad_POC", version="0.2", description="REST")

api.add_namespace(detector_api)


@api.errorhandler(NotFound)
def handle_not_found_error(exception_cause):
    """
    Catch not found error exception globally and respond with 404.
    :param exception_cause:
    :return objects, response Code:
    """
    return error_message(exception_cause.description), HTTPStatus.NOT_FOUND


@api.errorhandler(BadRequest)
def handle_bad_request_error(exception_cause):
    """
    Catch bad request error exception globally and respond with 400.
    :param exception_cause:
    :return objects, response Code:
    """

    return error_message(exception_cause.description), HTTPStatus.BAD_REQUEST


@api.errorhandler(Unauthorized)
def handle_unauthorized_error(exception_cause):
    """
    Catch unauthorized globally and respond with 401.
    :param exception_cause:
    :return objects , response Code:
    """
    return error_message(exception_cause.description), HTTPStatus.UNAUTHORIZED


@api.errorhandler(Forbidden)
def handle_forbidden_error(exception_cause):
    """
    Catch forbidden globally and respond with 403.
    :param exception_cause:
    :return objects , response Code:
    """

    return error_message(exception_cause.description), HTTPStatus.FORBIDDEN
