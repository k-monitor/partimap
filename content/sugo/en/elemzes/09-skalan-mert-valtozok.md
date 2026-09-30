# Analyzing variables measured on a scale

Surveys often include questions where respondents have to give their opinion on a rating scale. Examples include satisfaction, agreement or importance scales from 1 to 5 or from 1 to 10.

For such variables, in addition to percentage distributions, you can also calculate an average, which neatly summarizes the respondents' overall opinion.

You can calculate averages:

- for the total sample,
- for different demographic groups (for example, by gender, age or level of education),
- and to compare several different questions.

Averages give you a quick overview of which groups are more satisfied with a given service, and which services perform better or worse in the respondents' view.

**Example:**

Suppose the survey asked respondents to rate 15 different services on Piac utca.

Respondents rated each service on a scale of 1 to 5, where:

- 1 = not at all satisfied,
- 5 = completely satisfied.

By comparing the average scores of the individual services, you can easily determine which services respondents are most satisfied with and which areas need improvement.

The table below shows the average satisfaction scores of the 15 services.

| Service | Average |
| --- | --- |
| Street lighting | 3.9 |
| Location and design of pedestrian crossings | 3.3 |
| Condition of sidewalks | 3.2 |
| Noise level | 3.1 |
| Public safety | 3.1 |
| Street cleanliness | 3.1 |
| Condition of buildings | 2.9 |
| Condition and number of benches | 2.9 |
| Information on monuments and landmarks | 2.7 |
| Range of shops and services | 2.7 |
| Number of bike racks | 2.5 |
| Affordability of shops' offerings | 2.5 |
| Air quality | 2.4 |
| Number of parking spaces | 2.4 |
| Amount of greenery | 2.2 |

Based on the data in the example, respondents are most satisfied with street lighting. Based on the averages, the following were also rated favorably:

- the location and design of pedestrian crossings,
- the condition of the sidewalks,
- the noise level,
- public safety,
- street cleanliness.

In contrast, the following received lower ratings:

- the condition of buildings,
- the condition of benches,
- the available information,
- the range of offerings.

And the lowest averages went to:

- air quality,
- the number of parking spaces,
- and the amount of greenery,

meaning that these are the areas most in need of improvement.

## Comparing averages across demographic groups

You can calculate averages not only for the total sample but also for different demographic groups. This makes it easy to examine whether the rating of a given service differs, for example, by gender, age or income situation.

To do this, create a PivotTable as usual, then:

1. select the service you are examining and the demographic variable,
2. drag the demographic variable to the Rows area,
3. and place the service rating only in the Values area.

Then, in Value Field Settings, on the Summarize Values By tab, choose Average.

You can make the finished table even easier to read with conditional formatting. After selecting the table, go to Home → Conditional Formatting → Color Scales to display the size of the values with colors.

| Group | Average |
| --- | --- |
| Total sample | 3.1 |
| Male | 3.0 |
| Female/other | 3.1 |
| 18-29 | 3.0 |
| 30-39 | 3.0 |
| 40-49 | 3.3 |
| 50-64 | 3.1 |
| 65+ | 3.1 |
| We live comfortably on our current income. | 3.3 |
| We get by on our current income. | 3.0 |
| We find it difficult to get by on our current income. | 2.8 |
| Primary education | 3.1 |
| Secondary school diploma | 3.0 |
| Tertiary (college, university) | 3.1 |

## Interpreting the results

In the example, we compared the average rating of public safety across different demographic groups.

The data show that:

- those in a difficult financial situation gave public safety the lowest rating;
- those living comfortably and the 40–49 age group were the most satisfied.

However, it is important to keep in mind that the average alone does not give a complete picture of the answers.

For example, two groups may have the same average while the distribution of their answers is completely different. An average of 3.0 can arise when most people chose the middle value, but also when half of the respondents selected the lowest value and the other half the highest.

That is why you should always complement the interpretation of averages by examining the distribution of the answers. In the next step, we look at how the public safety ratings are distributed across the age groups.

|  | 1 - Not at all satisfied | 2 | 3 | 4 | 5 - Completely satisfied | Grand Total |
| --- | --- | --- | --- | --- | --- | --- |
| 18-29 | 6% | 21% | 42% | 25% | 6% | 100% |
| 30-39 | 11% | 23% | 31% | 23% | 12% | 100% |
| 40-49 | 12% | 13% | 24% | 38% | 13% | 100% |
| 50-64 | 8% | 26% | 28% | 30% | 9% | 100% |
| 65+ | 5% | 23% | 37% | 28% | 7% | 100% |

It is clear that the average alone does not always reflect the true distribution of the answers. Although in the previous example the 40–49 age group had the highest average, the detailed distribution also reveals that this age group also has the highest share of those who gave a rating of 1, that is, the lowest level of satisfaction.

> 💡 **Important:** To be able to speak of statistically significant differences, that is, to rule out that the difference between the averages measured in two groups is purely due to chance, you need to use a t-test, which we won't cover here for reasons of space.

This suggests that the opinions of respondents aged 40–49 are divided: the majority are rather satisfied with public safety, but a significant minority (12%) do not feel safe on Piac utca at all.

This clearly shows why you should always complement the interpretation of averages by examining the distribution of the answers.

## Simplifying scales

When analyzing five-point rating scales, it is often useful to simplify the answer categories. A common way of doing this is to:

- merge values 1 and 2 into a “rather dissatisfied” category,
- merge values 4 and 5 into a “rather satisfied” category,
- and keep value 3 as a separate, neutral category.

This gives you an easier-to-interpret three-category scale instead of the original five-point scale.

## Satisfaction balance

To simplify the data further, you can also use what is known as the satisfaction balance. To calculate it, subtract the share of those who are rather dissatisfied from the share of those who are rather satisfied.

The resulting indicator quickly shows whether a service is viewed more positively or more negatively within a given group.

Interpreting the values is simple:

- positive value: more people are satisfied than dissatisfied;
- negative value: more people are dissatisfied than satisfied;
- value around 0: the shares of satisfied and dissatisfied respondents are roughly equal.

This indicator is especially useful if you want to compare many demographic groups quickly, as it makes the most positive and the most critical groups visible at a glance.

Although the satisfaction balance makes analysis and comparison easier, when presenting the results it is better to return to the original five-point scale or the three-point scale derived from it. This is much easier for readers to interpret.

For example, instead of the balance, it is better to phrase the results like this:

*Respondents are divided in their assessment of public safety: 37% are rather satisfied, while 30% are rather dissatisfied.*
