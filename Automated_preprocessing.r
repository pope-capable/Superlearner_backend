# Perform data preprocessing - this includes the removal of outliers (+/-4SD) for continuous variables and one-hot-encoding for nominal variables.
# Pre-processing performed using R/3.5.1

# Import packages 
library(dplyr)
library(dataPreparation)
library(openxlsx)
library(webr)

###########################
### Data Pre=processing ###
###########################
# 
# Import the dataset containing the 54 original candidate features and asthma outcome
args <- commandArgs(TRUE)
srcFile <- args[1]
Uncleaned_data <- read.xlsx(
  "AS.xlsx",
  sheet = 1,
  startRow = 1,
  colNames = TRUE,
  rowNames = FALSE,
  detectDates = FALSE,
  skipEmptyRows = TRUE,
  skipEmptyCols = TRUE,
  rows = NULL,
  cols = NULL,
  check.names = FALSE
)
# Identify continuous variables for distribution check and outlier removal 
is_binary<- function(x) { all(na.omit(x) %in% 0:1) }


is_catergory<- function(x) { all(na.omit(x) %in% 0:5) }

Continous_variable <- c(FALSE, Uncleaned_data[!(apply(Uncleaned_data,2,is_catergory))])
Continous_variable <- as.data.frame(Continous_variable)
Continous_variable <- Continous_variable[,-1]
Study_ID <- Continous_variable[,1, drop=FALSE]

to.remove<-colnames(Continous_variable)
`%ni%` <- Negate(`%in%`)
Binaries_Variables<-subset(Uncleaned_data,select = names(Uncleaned_data) %ni% to.remove)
Continous_variable <- Continous_variable[,-1]


remove_outliers <- function(x, na.rm = TRUE) {
  qnt <- quantile(x, probs=c(.25, .75), na.rm = na.rm)
  H <- 1.5 * IQR(x, na.rm = na.rm)
  y <- x
  y[x < (qnt[1] - H)] <- NA
  y[x > (qnt[2] + H)] <- NA
  y
}

remove_all_outliers <- function(df){
 
  df[,sapply(df, is.numeric)] <- lapply(df[,sapply(df, is.numeric)], remove_outliers)
  df
}

files_with_no_outliers<- remove_all_outliers(Continous_variable)
boxplot(files_with_no_outliers)

files_with_no_outliers<- cbind(Study_ID,files_with_no_outliers)

Cleaned_data<- cbind(files_with_no_outliers, Binaries_Variables)
write.csv(Cleaned_data,"CLeanedData.csv", row.names = FALSE)
