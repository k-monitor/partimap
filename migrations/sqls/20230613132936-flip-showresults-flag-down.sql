UPDATE sheet
SET survey = REPLACE(survey, '"showResults":true', '"showResults":false')
WHERE survey NOT LIKE '%"showResult"%'
AND survey LIKE '%"showResultsOnly":true%'
AND survey LIKE '%"showResults":true%';

