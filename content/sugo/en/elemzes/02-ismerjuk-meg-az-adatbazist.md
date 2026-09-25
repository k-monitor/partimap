# Get to know your dataset!

Once you have the dataset of your survey, the first thing to do is to review its structure.

Typically:

- one row = one respondent,
- one column = one variable.

Variables can include not only the survey questions but also various auxiliary variables, such as:

- the time of completion,
- the device used to complete the survey,
- or other technical information.

Understanding the structure of the dataset makes it easier to find your way around the data during the analysis.

<figure>
	<img src="/help/sugo/elemzes-excel-rows.png" alt="Dataset in Excel" />
	<figcaption>In Excel, you can see that each row represents one respondent</figcaption>
</figure>

## Determine the sample size!

The first step is to establish how many respondents your dataset contains.

It is important to know that not every question receives the same number of answers. There can be several reasons for this:

- some questions were only shown to certain respondents (for example, only those in employment were asked which sector they work in),
- the respondent moved past a question without answering it.

To interpret these precisely, you need to know how the survey was programmed, but the number of answers can also tell you useful things.

### Determining the number of respondents in Excel

To determine the number of respondents, find a variable that **definitely** has a value for every respondent, such as:

- the time of completion,
- the respondent's ID.

Then:

1. Select the entire column.
2. The number of selected cells appears in the bottom right corner of the Excel window.
3. If the dataset includes a header row, subtract one from the number of cells to get the number of people who completed the survey.

<figure>
	<img src="/help/sugo/elemzes-response-count.png" alt="Calculating the number of responses" />
	<figcaption>Calculating the number of responses</figcaption>
</figure>
