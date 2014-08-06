####Rally Rollup Tooling:

Rally Rollup tooling is a set of custom Rally apps for managing the rollups in
rally of epics and user stories brought in from jira.


##How to install: 

These custom apps are deployed in rally itself.  First create
a custom page. Then click start adding apps. Choose Custom HTML and insert the
code from app.html for the app you want to use. Likely classpath is
deploy/app.html if accessing from source code.

https://help.rallydev.com/use_apps#custom


##How to use: 

There are 3 apps: StoryToFeatureConverter, StoryLinker, and
EpicToInitiativeLinker. Each app performs a different step, one self evident
to the app name. All 3 have a common user interface of a grid of the stories
or epics to be acted on. Simply select which stories or epics you want to link
or convert and click the convert/link button at the bottom of the grid. The
scope of the grid is the current project: only stories from the project you
are in on rally will appear on the grid.

  To illustrate the process of using these tools, consider the example of
Jira- Rally integration of a made up project called Foobar. Foobar team members create user
stories and epics in Jira. These objects are brought over into Rally through
the rally jira connector: stories become user stories and epics also become
user stories due to limitations of the Jira-Rally connector. User stories from jira are
mapped to their corresponding project. Epics however go to a project acting as
a staging area. In Foobar's case, this project is Foobar EPICS.

  From here, use the StoryToFeatureConverter on the user stories which
represent epics to convert them to PortfolioItem/Features. They will remain in
this same staging area project. As such, they will need to be moved to the
project they belong in, where their child user stories and parent initiatives
are.

  THIS IS A LIMITATION OF STORYLINKER AND EPICTOINITIATIVELINKER: LINKING
WILL ONLY WORK IF THE STORIES AND THEIR PARENT FEATURES AND THE FEATURES WITH
THEIR PARENT INITIATIVES ARE IN THE SAME PROJECT. BE SURE TO MOVE CONVERTED
FEATURES TO THE CORRECT PROJECT AFTER THE CONVERSION.

  Once the epics are in the correct project, use the storylinker app to link
child user stories to their parent epics/features and use the
epicToInitiativeLinker app to link child epics/features to their parent
initiatives


##Dependences: What needs to be happen in Jira and rally for these apps to work

StoryToFeatureConverter: Rally Project or workspace has components, jiraid,
jiraLink, fixversion, and components fields visible for portfolio items and
for userstories in the designated project.  The boolean field isConverted
should also be present and visible in the project to avoid duplication on
repeated passes of userstories.

StoryLinker: The imported user story has a epic/theme value, and this
specified epic/theme from jira is a Feature with its jiraID stored in the
jiraID custom field in Rally. The user story and its parent epic should be in
the same project in Rally.

EpicToinitiativeLinker: The initiatives are for each quarter of the year and
have appropriate planned start date amd planned end date values.  The feature
has to have a components field value corresponding to its theme (whether full
name or rally id). FixVersion should be a format of Month Year: August 2014 or
Aug 2014. The Feature and its parent initiative should e in the same project
in rally
.

##The Apps:

StoryToFeatureConverter: StoryToFeatureConverter converts Epics from jira, as
user stories in rally, to Features in Rally. It prevents duplicated copies of
features via the isConverted flag: once a user story has been converted to a
feature, it will not create another copy if selected to convert more than
once. Changing this field's value to false will allow for conversion again.

StoryLinker: StoryLinker finds and sets the parent of selected user stories to
be their parent epic from jira. It only links stories to epics in the same
project. Stories are linked by matching the epicID field of the user story to
the JiraID field of the feature. Stories which are improperly assigned a
parent will be reassigned to the correct parent if the epicID field is updated
in the user story, allowing for synced updating of stories in rally with those
in jira.

EpicToInitiativelinker: EpicToInitiativeLinker finds and sets the parent of
the selected feature to be their parent initiative. Using the fix version (A
time value imported from jira of the format Month Year) to determine the
quarter and the components field (An imported field corresponding to either
the name of the theme - "Last Mile Execution" - or the rally id of the theme -
"T424") to determine the theme, the app allows for bulk linking of epics to
initiatives. The epics and initiatives are only linked if they are in the same
project.

##Technical Documentation: 

Source code can be found at:
https://github.com/thewillychen/RallyUtilities 

Useful resources at the Rally app sdk and Rally developers page:
https://help.rallydev.com/for-developers
https://help.rallydev.com/apps/2.0rc3/doc/#  

In particular, the data models and data stores pages are good primary
resources and are involved in most of the backend of the apps:
https://help.rallydev.com/apps/2.0rc3/doc/#!/guide/data_models

All three programs follow a general structure.  A grid populated by
userstories or features acts as the core of each program. From this grid, user
selected stories or features are added onto an array. When the button under
each grid is clicked, each selection is iterated through and the application
function is called on the object following confirmation. The
StoryToFeatureConverter creates a new feature and copies over the relevent
fields to it before saving it in rally. The StoryLinker determines the parent
using the story's epicID and the feature's JiraID before updating the story's
parent field with the parent's id. The EpicToInitiativeLinker uses a
combination of the fixVersion date along with the Initiative dates and the
components fields to determine the parent. It then updates the feature with
this parent initiative's id. Hopefully the function naming in the source code
for each app is easy to follow.





