# Calculations for variables at higher levels of measurement

In sociological survey research, ratio-level variables are less common. Most questions are nominal or ordinal, while interval-level variables are typically various rating scales (for example, satisfaction scales from 1 to 5 or from 1 to 10).

One of the most common examples of a ratio scale is exact age, provided that respondents gave their age as a number rather than selecting an age group.

For such variables, you can use Excel to calculate several descriptive statistics.

## Average

The average shows the arithmetic mean of the data, for example, the average age of the respondents.

Excel formula: `=AVERAGE()`

> 💡 **Important:** The average can be heavily influenced by extreme values.

## Standard deviation

The standard deviation shows how much the data deviate from the average.

- With a small standard deviation, the answers are close to the average.
- With a large standard deviation, the answers are more spread out.

Excel formula: `=STDEV()`

## Percentile

A percentile shows the value below which a given percentage of respondents fall.

For example, if the 25th percentile of age is 40 years, this means that:

- 25% of respondents are younger than 40,
- and 75% of respondents are 40 or older.

Excel formula: `=PERCENTILE.EXC()`

## Converting age into age groups

During analysis, it is often more useful to divide age into age groups, because this makes it easier to create distributions and crosstabs.

For example, you can create the following categories:

- 18–29 years,
- 30–39 years,
- 40–49 years,
- 50–64 years,
- 65 and over.

To do this, you can use Excel's IF() function:

```
=IF(A2<=29,"18-29", IF(A2<=39,"30-39", IF(A2<=49,"40-49", IF(A2<=64,"50-64","65+"))))
```

The age group variable created this way can be considered an ordinal variable, which works well:

- for creating simple percentage distributions,
- in PivotTables,
- and for crosstab analyses as well.
