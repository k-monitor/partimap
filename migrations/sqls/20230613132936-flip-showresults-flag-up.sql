UPDATE sheet
SET survey = REPLACE(survey, '"showResults":false', '"showResults":true')
WHERE survey NOT LIKE '%"showResult"%'
AND survey LIKE '%"showResultsOnly":true%'
AND survey LIKE '%"showResults":false%';
