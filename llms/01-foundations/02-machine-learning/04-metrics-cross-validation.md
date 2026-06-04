# 1.2.4 评估指标与交叉验证

## pass @ K

### 生成 k 个sample，只要有一个正确的就行

### Human Eval 的代码当中是需要 eval

## ACC

### 无论是正确还是错误

### (TP + TN) / (TP + TN + FP + FN)

## Recall

### 主要用于在数据集当中召回正确数据的指标，所以只关注 Positive 的情况，不需要关心 Negative 的数据

### 公式： TP / (TP + FN)

#### 在所有 Positive 的数据集上面，能够正确召回出多少正确的数据

## Precision

### 在所有正确的结果中，真正正确的结果占比到底是多少

### 公式： TP / (TP + FP)
