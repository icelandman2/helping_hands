from flask import Flask, jsonify
import random
import torch

import torchvision
from torchvision import models, transforms
import sklearn
import numpy as np
import sklearn.metrics

from PIL import Image
import requests
from io import BytesIO

import argparse
import sys

torch.manual_seed(7)
model_path = '../classifier/exps/models/exp1.pt'
model_path = "exp1.pt"
data_dir = '.......' # this should have a val subdirectory which stores images
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 
           'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
           'T', 'U', 'V', 'W', 'X', 'Y']

parser = argparse.ArgumentParser()
parser.add_argument('--file', type=argparse.FileType('r'), help='PASS A FILE')


def sign_prediction(request):

    app=Flask(__name__)
    with app.app_context():
        """HTTP Cloud Function.
        Args:
            request (flask.Request): The request object.
            <http://flask.pocoo.org/docs/1.0/api/#flask.Request>
        Returns:
            The response text, or any set of values that can be turned into a
            Response object using `make_response`
            <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>.
        """
        model = torchvision.models.resnet18(pretrained = True)
        num_ftrs = model.fc.in_features
        num_classes = len(classes)
        model.fc = torch.nn.Linear(num_ftrs, num_classes)
        
        # state_dict = load_state_dict_from_url("https://github.com/StanfordCS194/Team-5/blob/master/classifier/exps/models/exp1.pt?raw=true")
        # state_dict = load_state_dict_from_url("https://download.pytorch.org/models/alexnet-owt-4df8aa71.pth", progress=True) 
        # model.load_state_dict(state_dict)
        

        model.load_state_dict(torch.load(model_path))
        model.eval()
        # options = vars(parser.parse_args())
        # if options['file']:
        #     image_path = options['file'].name
        # else:
        #     image_path = '../team_headshots/matt.jpg'

        link1 = "https://firebasestorage.googleapis.com/v0/b/helping-hands-cs194.appspot.com/o/"
        link2 = "?alt=media&token="
       
        
        request_json = request.get_json(silent=True)
        request_args = request.args
        
        image_url = request_json['image_url']
        token = request_json['token']
       
        
        final_link = link1+image_url+link2+token
        prediction = predictor(model, final_link)
        print(prediction)

        random_sign = list('abcdefghijklmnopqrstuvwxyz')
        random_correct = [True, False]

        return jsonify(sign=prediction,
                       correct=random.choice(random_correct))


def predictor(model, image_path):
    # load image

    # image_url = "https://firebasestorage.googleapis.com/v0/b/helping-hands-cs194.appspot.com/o/fd65f241-a21f-47a1-9959-5c26d6957237?alt=media&token=a729a2de-2609-4984-9d1b-20febb9dce1f"
    # image_url = "https://www.lifeprint.com/asl101/signjpegs/l/l.jpg"
    # # image_url = "https://images2.pics4learning.com/catalog/b/b.jpg"
    # image_url = "https://images2.pics4learning.com/catalog/a/a.jpg"
    response = requests.get(image_path)
    image = Image.open(BytesIO(response.content))



    # image = Image.open(image_path)

    # image = data_transforms['val'](image)
    # image.to(device)

    transformation = transforms.Compose([
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
    image_tensor = transformation(image).float()
    image_tensor = image_tensor.unsqueeze_(0)

    if torch.cuda.is_available():
        image_tensor.cuda()

    image_tensor.to(device)
    with torch.no_grad(): 
        output = model(image_tensor)
    probs = torch.softmax(output, dim = 1)
    index = output.data.numpy().argmax()
    return classes[index]


# dummy={    
#   "image_url": "30604346-b28f-4c64-bb1f-64548f16f96f",
#   "token": "x83ff2d78-5bab-4e39-8908-174536f613de"
# }

# sign_prediction(dummy)    