## Help to create a survey {#adminsugo}

Below is a description of how the admin interface works.


### Registration {#registration}

After [registration](/register), anyone can use the app with full access to its functions and free of charge. PARTIMAP is currently available in Hungarian and English, and you can switch between languages by clicking on the button in the top right-hand corner (<i class="fas fa-globe fa-fw"></i>). If you would like to use the program in another language and help with translation, please contact us at <hello@partimap.eu>!

In the admin interface, you can create new surveys, modify previous ones ([**Projects**](/admin/projects)) and edit maps related to surveys ([**Maps**](/admin/maps)).


### Create new project and manage previous ones {#ujprojekt}

A new project can be created by entering the **project name** on the Projects page after logging in and clicking on the *Add* button.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Create project"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/project-en.png"
			>
			<figcaption class="figure-caption text-center">
				Creating a project
			</figcaption>
		</figure>
	</div>
</div>

In the Project menu you can find a list of your own projects. Here you can see the number of views and responses, and by clicking on **Download report** you can download the report generated from the completions in .xlsx format.

The data, questions and content related to the survey can be entered in the project data sheet after the project has been created.


### Project data sheet {#project data sheet}

From the [Projects](/admin/projects) menu, click on the project name in the list or create a new project to go to the project details page.

It is divided into two parts: the top part of the page provides general information about the survey and the second part allows you to edit the worksheets.

In the related data and settings you have the option to

- enter the name of the project, which will appear in the browser page title and when sharing on social media, in addition to the admin interface;
- edit its path (URL - <code>https://partimap.eu/p/*</code>),
- set password protection to restrict who can fill it in. In this case, navigating to the URL of the questionnaire will prompt for a password, which can then be used to complete the questionnaire. If you don't want to receive any more completions, you can also set the questionnaire to inactive by setting a password;
- Add a unique meta description (preview text) for Facebook sharing,
- upload a unique image for Facebook sharing;
- provide the contact details of the data controller, which will appear in the privacy statement;
- Provide a unique thank you message and a link to continue navigation (Next URL) at the end of the completion (after submission) and to turn on/off the buttons (Facebook, Twitter, email) at the end of the completion inviting the respondent to share the survey.


### List of worksheets

The project is divided into worksheets. In the editing interface of each worksheet, you can set up different questionnaire questions, informative texts and map elements prompting interaction from the respondents.

Worksheets can be edited under the general survey settings. For a new project, this section is empty, and you can start editing the survey content by clicking on the *Add Worksheet* button. A list view of already created worksheets is also available here.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="List of worksheets"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/sheets-en.png"
			>
			<figcaption class="figure-caption text-center">
				List of worksheets
			</figcaption>
		</figure>
	</div>
</div>

If there are already several worksheets in the project, the up and down arrows can be used to change the order of the worksheets, and the trash can icon deletes the unnecessary worksheet.

You can select the type of worksheet (*Text, Questionnaire, Map* or *Interactive map*) by clicking on the pictograms.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Add new worksheet"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/newsheet-en.png"
			>
			<figcaption class="figure-caption text-center">
				Add a new worksheet
			</figcaption>
		</figure>
	</div>
</div>

In the first worksheet, respondents must accept the terms of use and the privacy policy. As a first worksheet, it is useful to provide a Text worksheet where the scope (e.g. expected length of the survey) and purpose of the survey can be clarified.

By clicking on the **View** button in the top right corner of the Project Data Sheet, you can go directly to the questionnaire being built, tracking the changes you have saved. When editing the questionnaire, it is a good idea to track changes here in parallel with the editor interface.


### Worksheet types {#worksheets}


#### Text worksheet {#soveges}

A worksheet with text and images, which can be used to describe, among other things, the objectives of the survey, the activities of the organisation or institution carrying out the survey, the background to the decision situation. They can be provided when editing the worksheet:

- The *Worksheet title*, which will also appear in the public questionnaire;
- The *Worksheet description*, which is the main text of the dialog box that appears. The text can be customised with basic formatting options, with the possibility to insert a link or image (by providing an external source link);
- *Your background image*, which fills the space behind the dialog box;
- Buttons to *share the survey*.

To save your changes, press the *Save* button, and a pop-up window will warn you when you navigate to another page. The blue right/left arrows at the bottom of the page are used to navigate between the worksheets under editing.

From the worksheet editing interface, you can also go back to the project sheet by clicking on the PARTIMAP icon (*Back to project*) in the top left corner.


#### Questionnaire worksheet {#kerdoiv}

The Questionnaire worksheet allows you to create traditional questionnaire surveys. They can be entered when editing the worksheet:

- The *Worksheet title*, which will also appear in the public questionnaire;
- The *Worksheet description*, which appears at the top of the dialog box. The text can be customised with basic formatting options, with the possibility to insert a link or an image, similar to the Text worksheet. By adding an image, it is possible to condition questions on the image;
- *Questionnaire:* for the worksheet, here is the possibility to add questionnaire questions, whose properties are editable in the dialog that appears;
- *Show response statistics to the visitor after completion:* if checked, after continuing to the next page, the visitor is shown a simple aggregated statistics of the responses so far in a bar chart;
- *Display results only:* if checked, the worksheet questions are closed, no answers are collected anymore. In this worksheet, only the results of previous responses will be visible to visitors. This gives you the opportunity to convert the closed survey into a project displaying the outcome of the survey while maintaining the same link;
- *Supply background image*, which fills the space behind the dialogue box;
- Buttons to *share the survey*. This is useful for the last worksheet, which often contains demographic questions.

The following question types can be added to the Questionnaire block by specifying *Question text*:

*Text answer:* a text box allows the respondent to type in any answer. The result report will include this text response.

*Numeric answer (typing):* the field can be filled in by typing a number. You can set the minimum and maximum value of the answer that can be given. The report contains the answer in numeric format.

*Numeric answer (with slider):* here the respondent can set a numeric answer without typing, using a slider. Here you can also specify the minimum and maximum value of the answer. The two extremes can also be named in text, which will appear on both sides of the slider in the questionnaire, forming a scale. The report contains the answer in number format.

*Checkboxes:* In the Options section, click on the *New option* button to enter any number of response options, to which the respondent can individually respond by ticking the box. The maximum number of answers that can be selected can be set. By ticking the *Add Other option* box, an Other... option will be added to the list of answers, allowing the respondent to enter their own text response to the question. The report will contain the name of the selected answer options and the other answer given, separated by semicolons.

*Multiple choice:* In the Options section, clicking on the *New option* button allows you to select any number of options, from which the respondent can choose one. The report contains the name of the response option in text form.

*Dropdown (one can be selected):* like the multiple-choice, the filler can select one of the given Options from a drop-down list. In addition to the Options, you can also specify an Other... option. The report will contain the name of the response option in text form.

*Star rating (5 stars):* the respondent can give a rating of 1 to 5 stars on the question by simply clicking on it. The report contains the answer in number format.

*Multiple Choice grid:* similar to the multiple-choice question type, but multiple rows can be entered, for which the respondent is asked to select one of the answer options (Column). Any number of rows and columns can be entered for the question. If a response is mandatory, an option must be selected for each row. The report will contain the name of the response option in text form, broken down by line.

*Checkbox grid:* Like the checkboxes question type, the filler can select more than one response option for a row, which can be set by clicking on the *New column* button. You can add any number of rows and columns to a question. If a response is mandatory, at least one option must be selected for each row. The report will contain the names of the answer options in text form, separated by semicolons.

Each question can be made compulsory by ticking the *Request to be answered* box, without which the respondent will not be able to proceed or submit your answer.

In the Questionnaire section of the worksheet's editor interface (in the list of questions), questions can be deleted by clicking on the trash can icon, or their order can be changed by dragging and dropping them onto the question drawer.


#### Map worksheet (static map) {#static}

The worksheet can be used to create a map-based survey that can be used to present a completed development or plan, and to collect evaluations and feedback on it. Here, respondents are asked to answer questions related to what they see on the map, but unlike the interactive map worksheet, they are not allowed to draw on the map.

When creating the Map worksheet, you can import the map content from an existing map stored in the Maps menu (*Copy map elements from here*) or upload it directly from an external source (e.g. Google Maps) using a .kml file. For more information on moving the map, see the introduction under the subsection on Maps.

Elements that can be defined when editing the worksheet:

- The *Worksheet title*, which will also appear in the public questionnaire;
- The *Worksheet description*, which appears at the top of the dialog box. Here it is worth explaining concisely what the respondent is expected to do on the worksheet. The text can be customised with basic formatting options, and there is also the possibility to insert links and images.
- *Questionnaire:* it is also possible to add questionnaire questions here for the whole worksheet, which can be edited in the dialog box, similarly to the Questionnaire worksheet. The questionnaire questions are displayed in the sidebar below the description for those completing the survey.
- *Show response statistics to the visitor after completion:*  if checked, after continuing to the next page, the visitor is shown a simple aggregated statistics of the responses so far: both the results of the worksheet-level questionnaire questions and the average of the scores assigned to the items.
- *Display results only:* if checked, the worksheet will not collect responses, only the statistics of the responses will be displayed to the respondent.
- *Respondent interactions:* if *Rating fixed items* is checked, respondents can rate the items displayed on the map. Two types of rating can be selected:
    - *Stars:* the respondent can rate the item with stars by clicking on the item. The number of stars can be set (1-10), but if a single star is selected it can be used as a yes/no answer. The rating does not include a worksheet level question, the instructions for this must be provided either comprehensively in the worksheet description or individually in the item description. If the response statistic is set, the average number of stars and the number of ratings will be displayed for the items after continuing to the next page -- this is shown by default in the admin interface.
    - *Like/dislike:* the respondent can give items a positive (<i class="fas fa-fw fa-thumbs-up text-success"></i>) or negative (<i class="fas fa-fw fa-thumbs-up fa-flip-both text-danger"></i>) rating. If the response statistic is set, the number of positive and negative ratings will be displayed for the items after continuing to the next page -- this is shown by default in the admin interface.
    - The report displays the ratings data in a separate Ratings worksheet, which includes the respondent ID used to associate the rating with other responses, the name of the rated item, and the rating in number format (number of stars, [1, -1]). In addition, the generated report also displays the total number and average of ratings in an Aggregated Ratings worksheet.
- *Default basemap:* Here you can set the basemap that will be displayed behind the elements drawn on the map (e.g. road network, satellite, black and white, cycle paths, topographic, etc.). Respondents can change the display themselves.
- *Map Elements:* The elements drawn on the base map are displayed here. The content that is displayed to respondents when they click on the element or drawer can be edited in the element drawers. In the item drawer, you can set name, colour, size, style and picture description.
    - By filling in the *Category* field, map items can be filtered by respondents for that category. By setting a category, different elements can be separated and more easily analysed.
    - By checking *Hide item in list*, the item will appear on the map, but cannot be interacted with: it will not appear as a drawer among the Map items and cannot be clicked on in the map. This is useful when drawing an auxiliary element on the map that only orients the respondents, e.g. the boundary of a city.
- Using the KML buttons above the element list, it is possible to load a map created in another editor interface (<i class="fas fa-fw fa-upload"></i>) or to download map elements (<i class="fas fa-fw fa-download"></i>).

You can also use the *point, line* and *area* buttons in the top right corner of the static map worksheet's editing interface to draw elements directly onto the map displayed on the worksheet. Any number of elements can be drawn on the map. You can zoom in on the map by using the +/- buttons or by using the two-finger zoom function.

*Drawing a point (red):* click on the white pin on the red background to place a point marker. The marker can be placed with a single click.

*Draw a line (blue):* Click on the white line on the blue background to draw a line. Single-click to place the start point of the line on the map, click again to mark the intermediate points of the line and double-click to mark the end point.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img alt="Draw line" class="figure-img img-fluid rounded shadow-sm" src="/help/line-en.png">
			<figcaption class="figure-caption text-center">
				Drawing a line
			</figcaption>
		</figure>
	</div>
</div>

*Draw area (green):* Click on the white outline on the green background to draw an area (polygon). Click once to place the starting point of the shape on the map, click again to mark the boundaries, and then click again on the starting point to end the drawing.

*Mobile view:* If you are using the editor interface on a tablet or mobile phone, you can switch between the question panel and the map by pressing the hide (<<) and open (>>) buttons for map worksheets. The drawing buttons are available in the map view by hiding the sidebar.

#### Interactive map worksheet {#interaktiv}

In this worksheet, respondents can draw on the map. As with the static map, the admin has the option to draw elements on the map to orient the respondents or to expect map markings in relation to it. However, no questionnaire questions or ratings can be added to the worksheet and its elements here.

The *Worksheet title* and *Worksheet description* should contain information that will help the respondent to give an accurate answer to the question asked.

The *Respondent Interactions* menu allows you to set the type of markup (dot, line, area) that is collected from the respondent. You can request multiple types of markup on a worksheet, but only one task can be assigned to an item type. For example, several different tasks for point plotting (favourite places and unpleasant places) can be specified on separate interactive worksheets.

For the selected items, the *Instruction to plot point/line/area* text box allows you to specify exactly what respondents should mark (e.g. Which is your favourite place? [dot], Which way do you travel to work? [line], Where would you like more green space? [area]). This text will appear in the sidebar next to the button that starts the drawing. If the respondent draws something on the map, they can add text to their answer. You can enter the corresponding instructions in the *Question assigned to drawn items* field, thus guiding the response.

The *Map Elements* contains a list of elements added (drawn or uploaded) in the admin area, similar to a static map. Note, the description given to them is not displayed to the respondent, these elements only appear on the map like the hidden elements of the static map! The drawn elements can be used here to orient the respondents, their colour, size and style can be adjusted. They can be used to indicate the area or zones within which the elements are expected to be drawn. They are also useful because the map automatically zooms in on these elements.

If elements drawn by respondents have already been submitted to an interactive map, they can be exported to a personal map by clicking on the *Send to own map* link next to the worksheet in the list on the project data sheet, where they can be browsed, edited or downloaded in .kml format for external use. The .xlsx report also contains the data of the submitted elements (fill identifier, coordinates, description).


### Create maps and manage history {#terkepekek}

In the <a href="/admin/maps" target="_blank">Maps</a> menu, you can store and edit your own map drawings (.kml format shapefiles). Here you can collect and edit maps of the user's city and its surroundings that have been created previously, and the answers collected from questionnaires. Using .kml format files, it is easy to export the elements stored here to external map editors and import maps from there into PARTIMAP. It's also easy to move between the Maps menu and projects: you can move the contents of your own maps to worksheets (*Copy map elements from here*).

PARTIMAP does not currently offer graphical analysis functions, but you can edit individual elements on your own map: in addition to their name and description, you can customise their appearance (colour, size, line style in the case of lines).

To create your own new map:

- On the <a href="/admin/maps" target="_blank">Maps</a> page, enter the name of the new map and click on the *Add* button. Here you can load data from a .kml file in the editor interface;
- From the submissions of a survey's respondents, with the *Send to New Own Map* button in the row of the corresponding worksheet on the project data sheet.

You can edit the following details of your own map in an interface similar to worksheets:

- *Name of map*
- *Map elements:* objects drawn on the base map are displayed here. Using the *KML export/import* buttons at the bottom of the page, you can import a map created in another editor interface to the base map and save the map elements in .kml format.

The .kml file containing the PARTIMAP survey completions contains the type of markers as a category, so you can use an external analysis program or convert the .kml file [into a spreadsheet](https://mygeodata.cloud/converter/kml-to-xlsx) to separate the different markers and edit the parameters of the items.

The .kml files generated and used by PARTIMAP use the following parameters, which also provide interoperability with Google Maps:

- The x and y coordinates of the points that make up the elements;
- The element's serial number (gid) and name (Name);
- The category assigned to the element (partimapCategory);
- The style of the line or area boundary (partimapLineStyle), the size of the point (partimapPointSize) and other parameters (size, colour) automatically read by Google Maps (ExtendedData);
- The content of the description field used by PARTIMAP (partimapDescription);
- More information about this is available on the project's [Github page](https://github.com/k-monitor/partimap/blob/master/KML.md).


### Report and results {#riport}

You can download a survey in .xlsx format from the [Projects](/admin/projects) list view page. The report contains the results in the format detailed earlier. The map elements can be linked to the answers to the survey questions, such as the demographic data of the respondents, by means of identification numbers. Once the data are linked, the spatial markers can be analysed in more depth, filtered along each group of respondents.


### Tips for making a questionnaire {#tips}

Before we start to compile the questionnaire, we need to be clear about the decision or activity we want to ask respondents to support. It makes sense to focus on one topic, since if the focus of the questionnaire is too broad, the answers will be less accurate and respondents may be discouraged if they have to answer too many questions or questions that are not relevant to them. If properly focused, target groups can also be more easily identified and reached.

**Plan who you want to reach with your questionnaire and how!**

A questionnaire about playgrounds, for example, should be sent to a Facebook group for local mums, but if you want to ask local young people about an issue that concerns them, you should reach them through platforms or institutions they use on a daily basis.

Focus on the more hard-to-reach social groups. Online questionnaires tend to reach young or middle-aged respondents with higher incomes and education. However, with proper design and different (even offline) tools, we can ensure that everyone has the opportunity to express their views. Let's put the paper questionnaire in the library, put a QR code pointing to the questionnaire in community spaces, encourage NGOs to share the questionnaire with their clients and followers!

It is also worth being aware of what data is already available on the topic you want to map. Don't ask questions that we already know the answer to or can easily find out without asking!

**The questionnaire should be concise!**

As a survey is conducted, new ideas on the subject emerge, and more and more details are sought. However, respondents are not as committed and may drop out if they see a longer survey. We recommend that you use no more than 6-8 worksheets in a survey. Measure the time it takes to complete a survey, **and make it no longer than 10-12 minutes!

Please indicate the estimated completion time on the first worksheet of the survey. If the number of people completing the survey is far below the number of views (e.g. only one in ten views will result in a full survey completion), your survey is probably too long.

Try to give a precise explanation of the tasks, highlighting the text, using emotive icons, and as concisely as possible!

**Review your work!**

Due to the complexity of a survey consisting of several worksheets with a series of questions and information, mistakes and typos can slip through despite all the care and attention. If the wrong questions are asked, the answers will be useless.

In parallel with editing the admin interface, you should track the changes on the public interface. Changes made in the editor are updated in the public interface after saving. Once the survey has been launched, the questionnaire should only be modified if justified, as the results of the modified questions will not be comparable with the answers to the previous versions. Check the results received to see if they can be analysed and used for the intended purpose.

**Prepare the structure of the incoming data!**

Once you have received a sufficient number of responses and the campaign has ended, you will have to process the data received. Think in advance about the type of responses you expect, the format, interfaces and tools you plan to use to present the results.

- It may be a good idea to use open-ended, expository questions, but it is not a good idea to ask more than 1 or 2 of these in a questionnaire. Open-ended questions are also more demanding for the respondents to answer, and it is much more difficult to analyse text responses when processing the data than if respondents were to choose from the options provided.
- PARTIMAP allows for the possibility of accepting other responses from respondents to a question with a multiple-choice or a fixed number of options. This makes most open-ended questions redundant. However, at the end of the questionnaire, it is worth giving the respondent the opportunity to write down in text any aspects of the topic that were left out of the questionnaire.
- For multiple-choice questions, it is important that the options are clear and distinguishable. The difference between "Rarely" and "Sometimes" may not be obvious to all respondents.
- For all types of questions, it is crucial that the question asked is not suggestive and does not influence the respondents, as this will lead to biased results.
- Do not ask two different questions within the same question and avoid similar or repetitive questions as this can also discourage respondents.
- You can make some questions compulsory if you think the answers to them are important, but too many compulsory questions will lead to drop-out.
- In the map interaction, you should always encourage respondents to provide meaningful textual justifications, without which you can only guess why the place on the map is marked!
- In most cases, it is important to collect socio-demographic data (age, gender, income, education level), as this will help you to determine who your respondents were, whether they were representative of the whole population concerned or only constitute a narrow group of respondents. However, collect personal data only to the extent necessary and be clear about how it is used (in line with the terms of use). If you publish data, you should hide any personal, sensitive data (e.g. data provided in a text response, place of residence marked on a map).
- Set target completion rates before launching the survey and track how many responses have been collected. If you fall short of the targets, make further efforts to disseminate the questionnaire.

**Make your questionnaire unique and recognisable!**

Under Users, you can enter a mini logo and web address for your profile, which will then appear at the top of each worksheet, indicating who the owner of the questionnaire is. You can also customise the worksheets with individual background images. Keep it simple, clean and coherent!

You can also place images in the description fields, but you need to store the image on an external repository or find a copyright-free, freely usable illustration. These can make the decision more tangible for the person filling in the form.

You can colour the points and lines of the static map worksheet to match the colour of your organisation. You can also add descriptions and images to the map elements, making it easier to identify the places you have marked.

You can add your own url and Facebook share options to the questionnaire in the project's editor interface. This is important as the easiest way to distribute the questionnaire is through social media. If you add Facebook preview details after the questionnaire has been shared, the preview will not be updated to the one you have set. If this is the case, it should be [indicated to Facebook](https://developers.facebook.com/tools/debug/), who will then update the image and title.

The questionnaire can be embedded on your website by placing the following code in the HTML code of the page, with the link to the project in the appropriate place.

```
<embed src="https://partimap.eu/en/p/demo" style="width:100%; height:550px;">
```

The width and height of the embedded element can be adjusted.
