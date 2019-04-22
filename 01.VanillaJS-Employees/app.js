const fs = require('fs');
const Employee = require('./employee');

// Read the data from file named 'file.txt'. It should be in the same folder. If not, then change the name and path to it.
const data = fs.readFileSync('file.txt', 'utf8');

// Get all text for each line
const regex = /^.+$/gm;

let matches;
const projects = {};

while ((matches = regex.exec(data)) !== null) {
    // Skip the headers line
    if(matches.index === 0) {
        continue;
    }
    
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `matches`-variable.
    matches.forEach(match => {
        let args = match.split(', ');
        let [empId, projId, dateFrom, dateTo] = args;

        dateFrom = convertDate(dateFrom);
        dateTo = convertDate(dateTo);

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
        
        if(project.length === 1) {
            console.log( `Only one employee worked on project >>${projectName}<<.`);
            continue;
        }

        // Here we save the pa
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

                if(mostDaysWorkingTogether <= numberOfDaysTogether / (24 * 3600 * 1000)) {
                    mostDaysWorkingTogether = numberOfDaysTogether / (24 * 3600 * 1000);
                    selectedPair.length = 0;
                    selectedPair.push(currentEmployee);
                    selectedPair.push(nextEmployee);
                } 
            }
        }

        printResult(projectName, selectedPair);
    }
}

function convertDate(date) {
    if (date === 'NULL') {
        date = new Date();
    } else {
        date = new Date(date);
    }
    
    return date;
}

function printResult(projectName, selectedPair) {
    console.log(`The two employees who worked most on project >>${projectName}<< are ~${selectedPair[0].empId}~ and ~${selectedPair[1].empId}~`);
}