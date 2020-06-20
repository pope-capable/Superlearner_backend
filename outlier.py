# Import packages
import os
import sys

import inline as inline
import matplotlib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
##% matplotlib inline


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


### Import and prepare data for RFE
# Import cleaned, unstandardised dataset
inFile = sys.argv[1]
name = sys.argv[2]
File = pd.read_csv(inFile, index_col=False)

# Remove individuals with missing data to create a subset of individuals with only complete data
New_File = File
##New_File.drop(New_File.filter(regex="Unname"),axis=1, inplace=True)

Binary_Var_Col = bool_cols = [col for col in New_File
             if np.isin(New_File[col].dropna().unique(), [0, 1,2,3,4,5]).all()]

ContinousVar= New_File.drop(Binary_Var_Col, axis=1)
Binary_V = New_File[Binary_Var_Col]
print(ContinousVar)
Study_ID=ContinousVar.iloc[:,0]
print(Study_ID)
ContinousVar= ContinousVar.drop(ContinousVar.columns[0], axis=1)
print(ContinousVar)

ContinousVar_NO_Outlier =ContinousVar.mask(ContinousVar.sub(ContinousVar.mean()).div(ContinousVar.std()).abs().gt(2))
print(ContinousVar_NO_Outlier)


##plt.boxplot(ContinousVar_NO_Outlier.columns.values)
boxplot = ContinousVar_NO_Outlier.boxplot(grid=False, rot=55, fontsize=25)
plt.savefig(name+'_Outlier_removed_graph.pdf')
plt.show()
File_without_Outlier = pd.concat([Study_ID,ContinousVar_NO_Outlier,Binary_V], axis=1)
File_without_Outlier.to_csv(name+'_No_Outlier.csv')


fs = gridfs.GridFS(db, collection='samples')
myFile_sam = open(name+'_No_Outlier.csv', 'rb')
fileID = fs.put(myFile_sam, filename=name+"_No_Outlier.csv"  )
##with open(name+'_No_Outlier.csv', "rb") as f:
##  db_csv_sam = fs.put(f, content_type='text/csv', filename=name+'_No_Outlier.csv')

#out = fs.get(fileID)
fz = gridfs.GridFS( de, collection= 'Outlier_File' )
myFile_out = open(name+'_No_Outlier.csv', 'rb')
fileID = fz.put(myFile_out, filename=name+"_No_Outlier.csv"  )
##with open(name+'_No_Outlier.csv', "rb") as d:
##  db_csv_it = fz.put(d, content_type='text/csv', filename=name+'_No_Outlier.csv')

#out = fz.get(fileID)
#fs = gridfs.GridFS( de )
myFile_gar = open(name+'_Outlier_removed_graph.pdf', 'rb')
fileID = fz.put(myFile_gar, filename=name+"_Outlier_removed_graph.pdf"  )
#with open(name+'_Outlier_removed_graph.pdf', "rb") as y:
#  db_garph = fz.put(y, content_type='application/pdf', filename=name+'_Outlier_removed_graph.pdf')

