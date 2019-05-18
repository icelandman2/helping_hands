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
import sys

torch.manual_seed(7)
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 
           'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
           'T', 'U', 'V', 'W', 'X', 'Y']


def predictor(model, image_path):
    print('Launching predictor')
    # load image
    # response = requests.get(image_path)
    # image = Image.open(BytesIO(response.content))

    image = Image.open(image_path)
    # image = data_transforms['val'](image)
    # image.to(device)

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

    image_tensor.to(device)
    with torch.no_grad(): 
        output = model(image_tensor)
    probs = torch.softmax(output, dim = 1)
    index = probs.data.numpy().argmax()

    return classes[index]


model_path = 'exps/models/exp1.pt'
# image_url = 'https://images2.pics4learning.com/catalog/k/k.jpg'
image_url = '/Users/swetharevanur/Documents/spring/cs194w/pytorch-asl/data/train/K/536.jpg'

print('Loading model')
model = torchvision.models.resnet18(pretrained = True)
num_ftrs = model.fc.in_features
num_classes = len(classes)
model.fc = torch.nn.Linear(num_ftrs, num_classes)

# state_dict = load_state_dict_from_url("https://github.com/StanfordCS194/Team-5/blob/master/classifier/exps/models/exp1.pt?raw=true")
# state_dict = load_state_dict_from_url("https://download.pytorch.org/models/alexnet-owt-4df8aa71.pth", progress=True) 
# model.load_state_dict(state_dict)

model.load_state_dict(torch.load(model_path))
model.eval()

prediction = predictor(model, image_url)

print('Predicted', prediction)
    




    