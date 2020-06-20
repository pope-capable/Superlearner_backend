# Perform feature selection using Recursive Feature Elimination, with a 5-fold cross-validation

# Import packages
import os
import sys
import pandas as pd
import numpy as np
import imblearn
from imblearn.ensemble import BalancedRandomForestClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_selection import RFECV
from sklearn.preprocessing import StandardScaler,FunctionTransformer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import matplotlib.pyplot as plt
import json
import gridfs
import pymongo
from pymongo import MongoClient

try: 
    conn = pymongo.MongoClient() 
    print("Connected successfully!!!") 
except:   
    print("Could not connect to MongoDB") 
  
# database 
db = conn.samples
de = conn.samples 
  
# Created or Switched to collection names: my_gfg_collection 


### Set working directory ###
##os.chdir("")

### Import and prepare data for RFE
# Import cleaned, unstandardised dataset
inFile = sys.argv[1]
File = pd.read_csv(inFile, index_col=False)

# Remove individuals with missing data to create a subset of individuals with only complete data
New_File = File.dropna()
New_File.drop(New_File.filter(regex="Unname"),axis=1, inplace=True)
# Separate the features (X) and outcome (Y) in paraparation for feature selection
outc=sys.argv[2]
study=sys.argv[3]
filenamee=sys.argv[4]
##continuousF=[]
##n = len(sys.argv[4]) 
##a = sys.argv[4][1:n-1] 
##a = a.split(',') 
  
##for i in a: 
##    continuousF.append(i)

Y=New_File[[outc]]
X=New_File.drop([outc] , axis='columns')
X=X.drop([study], axis=1)

Z=New_File[X.columns[~X.isin([0,1,2,3,4,5]).all()]]
print(Z.columns.values)
### Define random forest classifier to be used for RFE ###	   

#Define parameters for random forest algorithm to used for RFE (used default settings here) 
best_param1= {'bootstrap': True,'criterion': 'gini', 'max_depth': None, 'max_features': 'sqrt', 'min_samples_split': 2, 'n_estimators': 100}

# Used a balanced random forest classifier to account for the class imbalance in the dataset
bclf = BalancedRandomForestClassifier(n_estimators=best_param1["n_estimators"],max_depth=best_param1["max_depth"],
                              min_samples_split =best_param1["min_samples_split"],max_features=best_param1["max_features"],random_state=123)

#### Define the RFE process ###
# uses the balanced random forest classifer defined above, 
# within a stratified 5-fold cross-validation (random states specfified to ensure the same splits each time, making it reproducible)
# feature subset will be decided based on those that construct the model with the best 'score', in this case, the model performing with the best balanced accuracy (due to the class imbalance)
rfecv = RFECV(estimator=bclf, step=1, cv=StratifiedKFold(5,random_state=123),
              scoring='balanced_accuracy')



# Outline a pipeline to: standardise the continuous features > leave the categorical untouched > perform RFE			  
estimators = Pipeline([
	('standardising', Pipeline([
		('select', ColumnTransformer([
			('scale', StandardScaler(), list(Z.columns))
			],
			remainder='passthrough')
		)
	])),
   ('bclf', rfecv)	
])

# Apply RFE to data
fit=estimators.fit(X, Y.values.ravel())

### Extract results ###
# Label the features identified as belonging to the optimal subset of predictors
list = []
for i in range(0, 57):
	if rfecv.ranking_[i] == 1:
		list.append(X.columns.values[i])

# Print the optimal number of features
print("Optimal number of features : %d" % rfecv.n_features_)


# Print the accuracy score that was obtained with the optimal number of features identified 
print("Balanced Accuracy: \n", rfecv.grid_scores_[11]) # n features - 1 for indexing i.e. if the optimall subset included 12 features, 11 should be specified in this line of code

# Print the list of features belonging to the optimal subset of predictors
print("Feature Selected: \n",list)

df = pd.DataFrame(New_File)
df = df.loc[:, list]
df.to_csv(filenamee+'_Feature_selected.csv')

fs = gridfs.GridFS(db, collection='samples')
myFile_sam = open(filenamee+'_Feature_selected.csv', 'rb')
fileID = fs.put(myFile_sam, filename=filenamee+'_Feature_selected.csv' )

#out = fs.get(fileID)
fz = gridfs.GridFS( de, collection= 'feature_file' )
#fileID = fz.put( open( r'formatted.csv', 'rb'), filename="formatted.csv"  )
#out = fz.get(fileID)

fz = gridfs.GridFS( de, collection= 'feature_file' )
myFile_out = open(filenamee+'_Feature_selected.csv', 'rb')
fileID = fz.put(myFile_out, filename=filenamee+'_Feature_selected.csv')


#def csv_to_json(filename, header=None):
#    data = pd.read_csv(filename, header=header)
#    return data.to_dict('records')

#df.reset_index(inplace=True)
#df_dict = df.to_dict("records")
#collection.insert_many(df_dict)

#collection.insert_many(csv_to_json('formatted-data.csv', header=0))

#collection.insert_one(df.to_csv('formatted-data.csv')) 

# Generate a plot for the number of features against their cross-validation scores
plt.figure()
plt.xlabel("Number of features selected")
plt.ylabel("Cross-validation balanced accuracy score")
plt.plot(range(1, len(rfecv.grid_scores_) + 1), rfecv.grid_scores_)
plt.savefig(filenamee+'_Feature_selection_graph.pdf')
#fs = gridfs.GridFS( de )
#fileID = fz.put( open( r'Feature_selection_graph.pdf', 'rb'), filename="Feature_selection_graph.pdf"  )

myFile_gar = open(filenamee+'_Feature_selection_graph.pdf', 'rb')
fileID = fz.put(myFile_gar, filename=filenamee+'_Feature_selection_graph.pdf'  )
#out = fs.get(fileID)	   
##collection.insert_one(plt.savefig('Feature_selection_graph.pdf')) 