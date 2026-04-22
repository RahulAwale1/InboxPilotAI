import requests


def is_google_auth_error(error: Exception) -> bool:
    if not isinstance(error, requests.HTTPError):
        return False

    response = error.response
    if response is None:
        return False

    return response.status_code in [401, 403]