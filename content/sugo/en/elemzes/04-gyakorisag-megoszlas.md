# Frequency and distribution

One of the simplest and most frequently used steps in data analysis is examining frequencies and distributions. They give you a quick overview of how respondents are distributed across the answer options.

For example, you can easily determine:

- what percentage of respondents are women and what percentage are men,
- what the age distribution is,
- or what levels of education the respondents have.

## Creating frequencies and distributions with a PivotTable

In Excel, the easiest way to create frequency and percentage distribution tables is with a PivotTable.

The steps are:

1. Select the column containing the variable you want to analyze.
2. On the Insert tab, choose PivotTable.
3. In the dialog box that appears, click OK.

Excel creates a new worksheet containing the PivotTable.

<figure>
	<img src="/help/sugo/elemzes-pivot-create.png" alt="Creating a PivotTable in Excel" />
	<figcaption>The process of creating a PivotTable</figcaption>
</figure>

## Setting up the PivotTable

In the PivotTable Fields pane that appears on the right, drag the selected variable:

- once to the Rows (Axis) area,
- and once to the Values area.

This displays the frequency of each category, for example, the number of male and female respondents.

## Displaying the percentage distribution

If you want to see the percentage distribution instead of, or in addition to, the counts:

1. click Value Field Settings,
2. select the Show Values As tab,
3. then choose % of Grand Total from the drop-down list.

<figure>
	<img src="/help/sugo/elemzes-pivot-percent.png" alt="Setting up the percentage distribution" />
	<figcaption>Setting up the display of the percentage distribution</figcaption>
</figure>

## Frequency and percentage together

If you want to see the counts and the percentage distribution at the same time, drag the same variable to the Values area twice. Then change the display of only one of the fields to % of Grand Total.

This way, the table shows both the number of cases and the percentage share of each category.

## Interpreting the results

Based on the data in the example, the sample contains 594 respondents, of whom:

- 367 are women (62%),
- 221 are men (37%),
- 6 chose the Other category (1%).

<figure>
	<img src="/help/sugo/elemzes-pivot-table.png" alt="Example PivotTable" />
	<figcaption>An example of a PivotChart</figcaption>
</figure>

It is worth applying the same method to the other basic demographic variables as well, so that you get a comprehensive picture of the composition of the respondents before you start analyzing the substantive questions of the survey.
