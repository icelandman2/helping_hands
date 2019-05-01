# Adapted from https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html

import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
import numpy as np
import torchvision
from torchvision import datasets, models, transforms
import matplotlib.pyplot as plt
import time
import os
import copy
import sklearn
import sklearn.metrics
torch.manual_seed(7)

# Data augmentation and normalization for training
# Just normalization for val
data_transforms = {
    'train': transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

#data_dir = '/Users/swetharevanur/Documents/spring/cs194w/pytorch-asl/data/'
#model_output_path = '/Users/swetharevanur/Documents/spring/cs194w/pytorch-asl/classifier/models/resnet18.pt'
data_dir = '/data/'
model_output_folder = '/Team-5/classifier/models/'
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

def imshow(inp, title = None):
    """Imshow for Tensor."""
    inp = inp.numpy().transpose((1, 2, 0))
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    inp = std * inp + mean
    inp = np.clip(inp, 0, 1)
    plt.imshow(inp)
    if title is not None:
        plt.title(title)
    plt.pause(0.001)  # pause a bit so that plots are updated

def train_model(model, criterion, optimizer, scheduler, dataloaders, dataset_sizes, model_name, model_output_log, num_epochs = 5):
    model_output_params = model_output_folder + model_name + ".pt"
    
    with open(model_output_log, 'w') as f:
        f.write("\n\n")
        f.write("## Training")
    
    since = time.time()

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    finetuning = True
    
    for epoch in range(num_epochs):
        print('Epoch {}/{}'.format(epoch, num_epochs - 1))
        print('-' * 10)

        with open(model_output_log, 'w') as f:
            f.write("\n\n#### Epoch " + str(epoch) + "/" + str(num_epochs - 1) + "\n")

        # Each epoch has a training and val phase
        for phase in ['train', 'val']:
            if phase == 'train':
                scheduler.step()
                model.train()  # Set model to training mode
                # train entire network after 5 epochs
                if finetuning == True and epoch >= 5:
                    for param in model.parameters(): 
                        param.requires_grad = True
                    print('Finetuning complete. Training entire network now!')
                    finetuning = False
            else:
                model.eval()   # Set model to evaluate mode

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data.
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                # zero the parameter gradients
                optimizer.zero_grad()

                # forward
                # track history if only in train
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    # backward + optimize only if in training phase
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # statistics
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print('{} Loss: {:.4f} Acc: {:.4f}'.format(
                phase, epoch_loss, epoch_acc))

            with open(model_output_log, 'w') as f:
                f.write(phase + " loss: " + str(epoch_loss) + ", acc: " + str(epoch_acc) + "<br>\n")

            # deep copy the model
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

        print()

    time_elapsed = time.time() - since
    print('Training complete in {:.0f}m {:.0f}s'.format(
        time_elapsed // 60, time_elapsed % 60))
    print('Best val acc: {:4f}'.format(best_acc))

    with open(model_output_log, 'w') as f:
        f.write("\n\n ### Training complete in " + str(time_elapsed//60) + "m " + str(time_elapsed%60) + "s")
        f.write("\n ### Best val acc: " + str(best_acc))

    # load best model weights
    model.load_state_dict(best_model_wts)
    torch.save(best_model_wts, model_output_path)
    return model, best_acc

def visualize_model(model, num_images = 6):
    was_training = model.training
    model.eval()
    images_so_far = 0
    fig = plt.figure()

    with torch.no_grad():
        for i, (inputs, labels) in enumerate(dataloaders['val']):
            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)

            for j in range(inputs.size()[0]):
                images_so_far += 1
                ax = plt.subplot(num_images//2, 2, images_so_far)
                ax.axis('off')
                ax.set_title('predicted: {}'.format(class_names[preds[j]]))
                imshow(inputs.cpu().data[j])

                if images_so_far == num_images:
                    model.train(mode = was_training)
                    return
        model.train(mode = was_training)
        
        
def trainer(model_name, model):
    image_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x]) 
                      for x in ['train', 'val']}
    batch_size = 32
    dataloaders = {x: torch.utils.data.DataLoader(image_datasets[x], batch_size = batch_size, shuffle = True, num_workers = 16)
                   for x in ['train', 'val']}
    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'val']}
    print(dataset_sizes)
    class_names = image_datasets['train'].classes

    model_conv = model
    for param in model_conv.parameters():
        param.requires_grad = False

    # Parameters of newly constructed modules have requires_grad = True by default
    num_ftrs = model_conv.fc.in_features
    model_conv.fc = nn.Linear(num_ftrs, len(class_names)) # 2 for cat-dog, 10 for leeds-mosquito

    model_conv = model_conv.to(device)

    criterion = nn.CrossEntropyLoss()

    # Observe that only parameters of final layer are being optimized as opposed to before.
    lr = 0.001
    momentum = 0.9
    optimizer_conv = optim.SGD(model_conv.fc.parameters(), lr = lr, momentum = momentum)

    # Decay LR by a factor of 0.1 every 7 epochs
    gamma = 0.1
    step_size = 7
    exp_lr_scheduler = lr_scheduler.StepLR(optimizer_conv, step_size = step_size, gamma = gamma)
    num_epochs = 5

    model_output_log = model_output_folder + model_name + ".md"
    with open(model_output_log, 'w') as f:
        f.write("## Experimental Setup \n")
        f.write("{'model_name': " + model_name + "}<br> \n")
        f.write("{'train': " + str(dataset_sizes['train']) + ", 'val': " + str(dataset_sizes['val']) + "}<br> \n")
        f.write("{'optimizer': 'SGD', 'init_lr': " + str(lr) + ", 'momentum' = " + str(momentum) + "}<br> \n")
        f.write("{'decay': True, 'gamma': " + str(gamma) + ", epochs': " + str(step_size) + "}<br> \n")
        f.write("{'batch_size': " + str(batch_size) + ", 'epochs': " + str(num_epochs) + "}<br> \n")

    model_conv = train_model(model_conv, criterion, optimizer_conv, exp_lr_scheduler, 
                             dataloaders, dataset_sizes, model_name, model_output_log,
                             num_epochs)
    return model_conv

def predictor(model):
    # predict on val compute F1 score
    image_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x]) 
                      for x in ['val']}
    dataloaders = {x: torch.utils.data.DataLoader(image_datasets[x], batch_size = 32, shuffle = True, num_workers = 16)
                   for x in ['val']}
    
    preds_list, gt_list = [], []
    
    model.eval()
    with torch.no_grad():
        for images, labels in dataloaders['val']:
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            preds_list.extend(list(np.asarray(torch.max(outputs, 1)[1])))
            gt_list.extend(list(np.asarray(labels)))

    f1 = sklearn.metrics.f1_score(gt_list, preds_list, average = 'weighted')
    
    # predict on val to find worst 5
    val_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms['train']) 
                      for x in ['val']}
    valloaders = {x: torch.utils.data.DataLoader(val_datasets[x], batch_size = 64, shuffle = True, num_workers = 16)
                   for x in ['val']}        
    
    probs_list, preds_list = [], []
   
    model.eval()
    with torch.no_grad():
        for images, labels in valloaders['val']:
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            probs = torch.softmax(outputs, dim = 1)
            probs_list.extend(list(np.asarray(torch.max(probs, 1)[0])))
            preds_list.extend(list(np.asarray(torch.max(outputs, 1)[1])))
        
    return probs_list, preds_list, f1

def main():
    models = {'resnet18 pretrained': models.resnet18(pretrained = True), 
              'resnet18': models.resnet18(pretrained = False),
              'densenet161 pretrained': models.densenet161(pretrained = True),
              'inception': models.inception_v3(pretrained=True)}
    for model_name in models:
        print("---- Testing " + model_name + " ----")
        model, acc = trainer(model_name, models[model_name])
        print(trainer)

if __name__ == "__main__":
    main()