# Map tasks sheet

The Map tasks sheet is used to create map-based surveys in which respondents don't just view the map but actively draw on it. Respondents give their answers by drawing points, lines or areas, which you can supplement with further questions.

With this sheet you can:<br />
📍 identify favorite or problematic places,<br />
🚶 map routes and movement patterns,<br />
🌳 collect development needs and proposals,<br />
📊 request structured answers linked to spatial data,<br />
🗺 create complex community mapping surveys.

## Main settings

When editing the sheet, you can set:

#### Sheet title

It appears in the header of the public survey, so choose a title that respondents may also see.

#### Sheet description

Informational text shown at the start of the survey that helps respondents understand the task.

In the description you can:

- Insert an image
- Add a link to text
- Insert a video
- Format text: bold and italic
- Insert headings
- Create bulleted lists
- Align text to the center, right or left.

> 💡 **Tip:** It's worth describing here in detail exactly what kind of markings you expect from respondents.

#### Show search box

With the search box, you can search the map by address to find where you want to set the bounds of your map. If you tick the checkbox, respondents can also search the map.

#### Set map bounds

You can mark on the map which area you want respondents to assess, without drawing a point, line or polygon.

#### Importing map elements

Elements can be loaded onto the map in several ways, using the **Import markers** window:

- **from an existing map stored in the Maps menu** – by selecting the map in the *Import from a map* section;
- **from other sheets** – in the *Import from a sheet* section, by selecting the survey and the sheet;
- **from elements submitted on a Map tasks sheet** – using the *Import submitted markers* function;
- **from fixed elements saved on other sheets** – with the *Import fixed markers* option;
- **from an external source, using a KML file**.

The import window also shows the number of elements that can be imported from each source (e.g. “Import 0 marker(s)”, “Import 0 submitted marker(s)”, “Import 0 fixed marker(s)”).

> 💡 **Tip:** You can also restrict the visible area of the map and the zoom range available to respondents.

### Searching for elements

You can also search for a specific element on the maps. The search function lets you search among the map elements you have created.

<figure>
	<img src="/help/sugo/keszites-map-task-sheet.png" alt="Map tasks sheet interface" />
	<figcaption>Map tasks sheet interface</figcaption>
</figure>

#### Creating map tasks

In the **Map tasks for respondents** section, you can add the map tasks that respondents are asked to complete.

A task always means drawing one map element:

- 📍 a point,
- ➖ a line,
- 🔷 an area.

There is no limit on the number of tasks, so you can even create several different point, line or area marking tasks.

Click the **+ Add new map task** button to specify the details of the task.

### Type of element to draw

You can choose whether the respondent should draw:

- a point,
- a line,
- or an area.

### Creating map elements

You can also draw elements directly in the editor, from the admin view, in case you want these elements to appear on the interactive map as well.

- **Point** – placed with a single click.
- **Line** – drawn by connecting several points.
- **Area (polygon)** – created as a closed shape.

The appearance of the drawn elements can be customized in detail:

**Name** – the name of the element.

**Color** – choosing the color of the element.

**Size** – setting the size of the element.

**Extra stroke** – for example, adding a gray outline to the element.

**Opacity** – controls how transparent the element is (0–100%). For areas, the fill color can also be made fainter.

**Label on map** – the text of the label shown next to the element.

**Category name** – assigning the element to a category.

**Description** – a detailed text description, with formatting options:

- headings (H1, H2),
- paragraph,
- bulleted list,
- alignment,
- bold and italic text,
- inserting a link,
- inserting images and videos,
- undo and redo.

**Hide from the list of features** – the element can be hidden from the list view.

**Delete feature** – deletes the element.

#### Unique task name

A short technical name that:

- appears in the admin interface,
- is included in the reports,
- is also used by default as the name of the drawn elements.

**Examples:**

- Favorite place
- Problem spot
- Walking route
- Dangerous intersection

#### Instruction

The task description shown to the respondent.

**Examples:**

- “What is your favorite place in the city?”
- “Which way do you travel to work?”
- “Where is more green space needed?”

The instruction is visible in the map's sidebar and also while drawing.

#### Expected nr. of markers (max.)

You can set the maximum number of elements the respondent can draw.

**For example:**

- at most 1 favorite place,
- at most 3 problem spots,
- at most 5 routes.

The system notifies the respondent when they have reached the allowed number.

#### Color

You can set:

- the color of the button for the task,
- the color of the pop-up info bubble,
- the color of the drawn map elements.

#### Additional questions

Further questions can be attached to the drawn elements, and these questions can also be made required.

#### Add title to marker

When this is turned on, the respondent has to give a name to the element they drew.

**For example:**

- “Kossuth tér”
- “Dangerous crossroads”
- “My morning cycling route”

#### Add checkbox question

Lets you collect structured answers.

**Examples:**

| Question | Question type | Example answer options |
| --- | --- | --- |
| **At what time of day do you use it?** | Closed, multiple-choice question | ☐ Morning (6:00–10:00) ☐ Late morning (10:00–12:00) ☐ Afternoon (12:00–18:00) ☐ Evening (18:00–22:00) ☐ Night (22:00–6:00) |
| **What mode of transport do you use?** | Closed, single or multiple choice | ☐ On foot ☐ Bicycle ☐ Car ☐ Public transport ☐ Motorcycle ☐ Scooter ☐ Other: |
| **How often do you come here?** | Closed, frequency-scale question | ☐ Daily ☐ Several times a week ☐ Once a week ☐ Several times a month ☐ Once a month ☐ Less often |

> 💡 **Tip:** Structured answers make it easier to analyze and filter the data later.

#### Add text question

You can ask for a free-text explanation of the marking.

**For example:**

- Why did you choose this place?
- What is the problem in this area?
- What improvement would you suggest?

#### Conditional display

With the **Show only if...** setting, map tasks can be displayed conditionally.

**For example:**

- only to female respondents,
- only to those who travel by car,
- only if a specific answer is given to a particular question.

If every task on the sheet is conditional, respondents to whom the condition does not apply will not see the sheet at all.
