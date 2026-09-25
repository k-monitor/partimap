# Handling categories with few cases

When interpreting crosstabs, you need to pay attention not only to the percentages but also to the number of cases in each category.

We saw earlier that only 6 respondents fall into the “other” category of the gender variable. With such a small number of cases, percentage distributions can easily be misleading, since even a single answer can cause a significant difference in percentage.

As a general rule, categories with fewer than about 30 people are not worth analyzing on their own, although the exact threshold also depends on the purpose of the analysis and the size of the crosstab.

In such cases, you have several options:

- skip the separate analysis of that category,
- or merge it with another category with similar content.

## Merging categories in Excel

In this example, we merge the female and other categories. To do this, insert a new column next to the *gender* variable, then use the following formula:

```
=IF(OR(E2="Female",E2="Other"),"Female/other","Male")
```

Similarly, for the frequency of visiting Piac utca variable, it is also worth merging categories with very few cases. In the example, only one respondent falls into the “Never” category, so it makes sense to combine it with the “Less often” category.

|  | Daily | Several times a week | Once a week | Less often | Grand Total |
| --- | --- | --- | --- | --- | --- |
| Total sample | 24% | 34% | 18% | 25% | 100% |
| Male | 27% | 33% | 15% | 26% | 100% |
| Female/other | 22% | 34% | 20% | 25% | 100% |
| Primary education | 33% | 28% | 18% | 23% | 100% |
| Secondary education | 29% | 34% | 16% | 21% | 100% |
| Tertiary education | 20% | 34% | 19% | 27% | 100% |
| We live comfortably on our current income. | 18% | 36% | 20% | 25% | 100% |
| We get by on our current income. | 26% | 33% | 18% | 24% | 100% |
| We find it (very) difficult to get by on our current income. | 22% | 31% | 16% | 31% | 100% |

## Comparing several demographic variables

Crosstab analysis is not only useful for comparisons by gender. It is worth including other demographic variables as well, such as:

- age,
- level of education,
- subjective income situation.

This gives you a more comprehensive picture of how the answers of the different groups differ from one another.

## Interpreting the results

Crosstabs can be interpreted in several ways.

#### 1. Comparison with the total sample

You can examine how much a given group differs from the average distribution of the total sample.

For example, 33% of those with primary education visit Piac utca daily, while this share is 24% in the total sample. This suggests that daily visits are more common among people with primary education.

#### 2. Comparing demographic groups

You can also compare the groups with one another.

In the example, you can see that men are more likely to visit Piac utca daily, while women tend to visit it on a weekly basis.

#### 3. Looking for trends

For ordinal (orderable) variables, you can look not only for differences between individual categories but also for general trends.

In the example, looking at level of education, you can see that the lower the respondents' level of education, the higher the share who visit Piac utca daily.

Patterns like these help you gain a deeper understanding of the relationships in the data and can provide a basis for later conclusions.

> 💡 **Important:** To state with full certainty that there is a statistical relationship between level of education and the frequency of visiting Piac utca, the data would need to be examined with a chi-square test. For reasons of space, we won't cover the chi-square test here, but it is important to note that without performing it, you cannot rule out that the differences are due to chance.
