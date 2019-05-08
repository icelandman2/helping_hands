from flask import jsonify
import random
import torch
import torchvision
from torchvision import models, transforms
import sklearn
import numpy as np
import sklearn.metrics
from PIL import Image
torch.manual_seed(7)

model_path = '../classifier/exps/models/exp1.pt'
data_dir = '.......' # this should have a val subdirectory which stores images
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

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

    model = torchvision.models.resnet18(pretrained = True)
    model.load_state_dict(torch.load(model_path))
    image_path = '../team_headshots/andrew.jpeg'
    predictor(model, image_path)


    random_sign = list('abcdefghijklmnopqrstuvwxyz')
    random_correct = [True, False]

    return jsonify(sign=random.choice(random_sign),
                   correct=random.choice(random_correct))


def predictor(model, image_path):
    # load image
    image = Image.open(image_path)
    # image = data_transforms['val'](image)
    # image.to(device)

    # # run model
    # with torch.no_grad():
    #     output = model(image)

    # return output

    transformation = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
    image_tensor = transformation(image).float()
    image_tensor = image_tensor.unsqueeze_(0)

    if torch.cuda.is_available():
        image_tensor.cuda()

    # input = Variable(image_tensor)
    image_tensor.to(device)
    output = model(image_tensor)
    #print(output)
    probs = torch.softmax(output, dim = 1)
    #print(probs)
    index = output.data.numpy().argmax()
    #print(index)
    return index

model = torchvision.models.resnet18(pretrained = True)
num_ftrs = model.fc.in_features
num_classes = 34
model.fc = torch.nn.Linear(num_ftrs, num_classes)
model.load_state_dict(torch.load(model_path))
image_path = '../team_headshots/andrew.jpeg'
predictor(model, image_path)



