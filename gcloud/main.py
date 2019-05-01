from flask import jsonify
import random

def hello_get(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/1.0/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>.
    """
    random_sign = list('abcdefghijklmnopqrstuvwxyz')
    random_correct = [True, False]

    return jsonify(sign=random.choice(random_sign),
                   correct=random.choice(random_correct))