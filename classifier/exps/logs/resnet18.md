## Experimental Setup 
{'model_name': resnet18}<br> 
{'train': 74359, 'val': 24787}<br> 
{'optimizer': 'SGD', 'init_lr': 0.001, 'momentum' = 0.9}<br> 
{'decay': True, 'gamma': 0.1, epochs': 7}<br> 
{'batch_size': 32, 'epochs': 5}<br> 


## Training

#### Epoch 0/4
train loss: 3.18774771812, acc: tensor(0.0763, dtype=torch.float64)<br>
val loss: 3.06690722077, acc: tensor(0.1123, dtype=torch.float64)<br>


#### Epoch 1/4
train loss: 3.09110918764, acc: tensor(0.1071, dtype=torch.float64)<br>
val loss: 2.98148225276, acc: tensor(0.1404, dtype=torch.float64)<br>


#### Epoch 2/4
train loss: 3.036546013, acc: tensor(0.1249, dtype=torch.float64)<br>
val loss: 2.91879344031, acc: tensor(0.1661, dtype=torch.float64)<br>


#### Epoch 3/4
train loss: 2.99518832109, acc: tensor(0.1383, dtype=torch.float64)<br>
val loss: 2.8826164713, acc: tensor(0.1825, dtype=torch.float64)<br>


#### Epoch 4/4
train loss: 2.96411360955, acc: tensor(0.1479, dtype=torch.float64)<br>
val loss: 2.81128269705, acc: tensor(0.2302, dtype=torch.float64)<br>


 ### Training complete in 231.0m 43.2949140072s
 ### Best val acc: tensor(0.2302, dtype=torch.float64)