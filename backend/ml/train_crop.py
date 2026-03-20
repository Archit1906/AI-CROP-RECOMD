import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib

df = pd.read_csv("Crop_recommendation.csv")
print(df['label'].value_counts())

X = df[['N','P','K','temperature','humidity','ph','rainfall']]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = RandomForestClassifier(
    n_estimators=300,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)
model.fit(X_train_scaled, y_train)

print(f"Accuracy: {accuracy_score(y_test, model.predict(X_test_scaled))*100:.2f}%")
print(classification_report(y_test, model.predict(X_test_scaled)))

import os
os.makedirs("../models", exist_ok=True)
joblib.dump(model, "../models/crop_model.pkl")
joblib.dump(scaler, "../models/crop_scaler.pkl")
print("Saved model + scaler")
