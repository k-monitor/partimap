# Cross-tabulation

Once you have got to know your sample through its most important demographic characteristics, you can begin analyzing the substantive questions of the survey.

Here, too, it is worth first determining the level of measurement of the variable you are working with. For a single variable, you can still create simple frequency or percentage distribution tables, but if you are interested in the relationship between two variables, a crosstab will be one of the most useful analytical tools.

With a crosstab, you can examine, for example:

- how often men and women visit Piac utca,
- whether the opinions of different age groups about a service differ,
- or whether the answers of different education groups vary.

## Creating a crosstab in Excel

In this example, we examine whether there is a relationship between gender and the frequency of visiting Piac utca.

Steps for creating the PivotTable:

1. Select the columns containing the gender and the frequency of visiting Piac utca variables.
2. On the Insert tab, choose PivotTable, then click OK.
3. In the PivotTable Fields pane:
	- drag the gender variable to the Rows area,
	- drag the frequency of visiting Piac utca variable to the Columns area,
	- then drag the same variable to the Values area as well.

<figure>
	<img src="/help/sugo/elemzes-crosstab-setup.png" alt="Setting up a crosstab" />
	<figcaption>How to set up a crosstab</figcaption>
</figure>

## Displaying percentages

In the Values area, click the variable, then choose Value Field Settings.

On the Show Values As tab, change the display to % of Row Total.

This way, each row adds up to 100%, which makes it much easier to compare the individual groups.

<figure>
	<img src="/help/sugo/elemzes-valuefield-settings.png" alt="Value Field Settings" />
	<figcaption>How to configure the value field settings</figcaption>
</figure>

## Interpreting the results

From the resulting table, you can read off at once:

- the distribution of the total sample,
- as well as the results of each demographic group.

<figure>
	<img src="/help/sugo/elemzes-crosstab-example.png" alt="Example crosstab" />
	<figcaption>An example of a crosstab created from a PivotTable</figcaption>
</figure>

In our example, the following can be established for the total sample:

- 24% visit Piac utca daily,
- 33.5% several times a week,
- 18% once a week,
- and 25% less often.

The breakdown by gender shows that, overall, men and women visit the street with similar frequency, although some minor differences can be observed.

**For example:**

- 27% of men visit Piac utca daily, while among women this share is 21%;
- women are more likely to visit once a week or several times a week (20% and 35%, respectively);
- the share of those who visit less often than once a week is nearly the same (men: 26%, women: 24%).

Comparisons like these help reveal the extent to which a given answer is related to different demographic characteristics.
