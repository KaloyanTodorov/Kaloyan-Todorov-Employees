const fs = require('fs');
const Employee = require('./employee');

// Read the data from file named 'file.txt'. It should be in the same folder. If not in the same folder or with different name, then change the name and path to it.
const data = fs.readFileSync('file.txt', 'utf8');

// Get all text for each line
const regex = /^.+$/gm;

let matches;
const projects = {};

// Iterate through all lines of the file
while ((matches = regex.exec(data)) !== null) {
    // Skip the headers line
    if(matches.index === 0) {
        continue;
    }
    
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // Iterating through all matches
    matches.forEach(match => {
        let args = match.split(', ');
        let [empId, projId, dateFrom, dateTo] = args;

        if(!projects.hasOwnProperty(projId)) {
            projects[projId] = [];
        }

        projects[projId].push(new Employee(
            empId,
            dateFrom,
            dateTo,
        ));
    })
}

for (const projectName in projects) {
    // Iterate all projects
    if (projects.hasOwnProperty(projectName)) {
        const project = projects[projectName];
        
        // If only one employee working on the project
        if(project.length === 1) {
            console.log( `Only one employee worked on project >>${projectName}<<.`);
            continue;
        }

        // Here we initialize an empty array for the pair
        const selectedPair = [];
        let mostDaysWorkingTogether = 0;

        for (let i = 0; i < project.length - 1; i++) {
            for (let j = i + 1; j < project.length; j++) {
                
                const currentEmployee = project[i];
                const nextEmployee = project[j];
    
                // Check if they did not work at the same time
                if(currentEmployee.dateFrom > nextEmployee.dateTo || 
                    currentEmployee.dateTo < nextEmployee.dateFrom) {
                    continue;
                }
                
                const dateStartedWorkingTogether = new Date(Math.max(currentEmployee.dateFrom, nextEmployee.dateFrom));
                const dateEndedWorkingTogether = new Date(Math.min(currentEmployee.dateTo, nextEmployee.dateTo));

                const numberOfDaysTogether = dateEndedWorkingTogether - dateStartedWorkingTogether;
                const oneDay = (24 * 60 * 60 * 1000);

                // Check if there is a pair who worked for more days than the previous one, initially it's 0 days.
                if(mostDaysWorkingTogether <= numberOfDaysTogether / oneDay) {
                    mostDaysWorkingTogether = numberOfDaysTogether / oneDay;
                    
                    // Empty the array
                    selectedPair.length = 0;

                    selectedPair.push(currentEmployee, nextEmployee);
                } 
            }
        }

        printResult(projectName, selectedPair);
    }
}

function printResult(projectName, selectedPair) {
    console.log(`The two employees who worked most on project >>${projectName}<< are ~${selectedPair[0].empId}~ and ~${selectedPair[1].empId}~`);
}