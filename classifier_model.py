from datetime import datetime
import sys
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

data = None
timestamp = None
a = 0

for line in sys.stdin:
    if a == 0:
        data = json.loads(line.strip())
        a = a + 1
    else:
        timestamp = line.strip()


def format_timestamp(timestamp):
    timestamp_in_seconds = timestamp / 1000
    date_object = datetime.utcfromtimestamp(timestamp_in_seconds)
    formatted_date = date_object.strftime('%Y-%m-%d %H:%M:%S')
    return formatted_date


formatted_data = [{'timestamp': format_timestamp(entry[0]), 'value': entry[1]} for entry in data]

# Convert the list of dictionaries to a Pandas DataFrame
formatted_data_df = pd.DataFrame(formatted_data)

# Convert the price movement to binary labels (0 for decrease, 1 for increase)
formatted_data_df['price_movement'] = np.where(formatted_data_df['value'].shift(-1) > formatted_data_df['value'], 1, 0)

# Getting all the data
X = [int(datetime.strptime(entry, '%Y-%m-%d %H:%M:%S').timestamp()) for entry in formatted_data_df['timestamp']]
y = formatted_data_df['price_movement']

X = np.array(X).reshape(-1, 1)

# Dividing data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1, random_state=0)

# Creating the model
classifier = RandomForestClassifier(n_estimators=10, random_state=0)
classifier.fit(X_train, y_train)
# Predicting the class for the provided timestamp
timestamp = int(datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S').timestamp())
result = classifier.predict([[timestamp]])
sys.stdout.write(str(result))
