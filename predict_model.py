from datetime import datetime
import sys
import json
data = None
timestamp = None
a = 0 
for line in sys.stdin :
    if (a == 0 ):
        data = json.loads(line.strip())
        a = a + 1
    else :
        timestamp = line.strip()
def format_timestamp(timestamp):
    timestamp_in_seconds = timestamp / 1000
    date_object = datetime.utcfromtimestamp(timestamp_in_seconds)
    formatted_date = date_object.strftime('%Y-%m-%d %H:%M:%S')
    return formatted_date
formatted_data = [{'timestamp': format_timestamp(entry[0]), 'value': entry[1]} for entry in data]
# Now training the Machine Learning Model on the Data
# Algorithim used => Random Forest
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
# getting all the data
X = [int(datetime.strptime(entry['timestamp'], '%Y-%m-%d %H:%M:%S').timestamp()) for entry in formatted_data]
y = [entry['value'] for entry in formatted_data]
X = np.array(X).reshape(-1, 1)  
y = np.array(y)
# dividing data to train and test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.85, random_state = 0)
# creating the model
regressor = RandomForestRegressor(n_estimators = 10, random_state = 0)
regressor.fit(X, y)
timestamp = int(datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S').timestamp())
result = regressor.predict([[timestamp]])
sys.stdout.write(str(result))