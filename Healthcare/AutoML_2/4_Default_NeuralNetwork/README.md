# Summary of 4_Default_NeuralNetwork

[<< Go back](../README.md)


## Neural Network
- **n_jobs**: -1
- **dense_1_size**: 32
- **dense_2_size**: 16
- **learning_rate**: 0.05
- **num_class**: 6
- **explain_level**: 2

## Validation
 - **validation_type**: split
 - **train_ratio**: 0.75
 - **shuffle**: True
 - **stratify**: True

## Optimized metric
logloss

## Training time

9.5 seconds

### Metric details
|           |           0 |    1 |    2 |    3 |    4 |    5 |   accuracy |     macro avg |   weighted avg |   logloss |
|:----------|------------:|-----:|-----:|-----:|-----:|-----:|-----------:|--------------:|---------------:|----------:|
| precision |    0.166486 |    0 |    0 |    0 |    0 |    0 |   0.166486 |     0.0277477 |      0.0277178 |    1.7928 |
| recall    |    1        |    0 |    0 |    0 |    0 |    0 |   0.166486 |     0.166667  |      0.166486  |    1.7928 |
| f1-score  |    0.285449 |    0 |    0 |    0 |    0 |    0 |   0.166486 |     0.0475749 |      0.0475235 |    1.7928 |
| support   | 1848        | 1834 | 1839 | 1871 | 1864 | 1844 |   0.166486 | 11100         |  11100         |    1.7928 |


## Confusion matrix
|              |   Predicted as 0 |   Predicted as 1 |   Predicted as 2 |   Predicted as 3 |   Predicted as 4 |   Predicted as 5 |
|:-------------|-----------------:|-----------------:|-----------------:|-----------------:|-----------------:|-----------------:|
| Labeled as 0 |             1848 |                0 |                0 |                0 |                0 |                0 |
| Labeled as 1 |             1834 |                0 |                0 |                0 |                0 |                0 |
| Labeled as 2 |             1839 |                0 |                0 |                0 |                0 |                0 |
| Labeled as 3 |             1871 |                0 |                0 |                0 |                0 |                0 |
| Labeled as 4 |             1864 |                0 |                0 |                0 |                0 |                0 |
| Labeled as 5 |             1844 |                0 |                0 |                0 |                0 |                0 |

## Learning curves
![Learning curves](learning_curves.png)

## Permutation-based Importance
![Permutation-based Importance](permutation_importance.png)
## Confusion Matrix

![Confusion Matrix](confusion_matrix.png)


## Normalized Confusion Matrix

![Normalized Confusion Matrix](confusion_matrix_normalized.png)


## ROC Curve

![ROC Curve](roc_curve.png)


## Precision Recall Curve

![Precision Recall Curve](precision_recall_curve.png)



[<< Go back](../README.md)
