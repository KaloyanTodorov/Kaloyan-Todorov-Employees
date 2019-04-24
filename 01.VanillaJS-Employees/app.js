const fs = require('fs');
const helpers = require('./helpers');

// Read the data from file named 'file.txt'. It should be in the same folder. If not in the same folder or with different name, then change the name and path to it.
const data = fs.readFileSync('file.txt');

const projects = {};

helpers.populateAllProjects(data, projects);

// Here we initialize a map which will hold all co-worker pairs
const coworkersPairs = {};

for (const projectName in projects) {
    // Iterate all projects
    if (projects.hasOwnProperty(projectName)) {
        const project = projects[projectName];
        
        // If only one employee working on the project
        if(project.length === 1) {
            continue;
        }

        for (let i = 0; i < project.length - 1; i++) {
            for (let j = i + 1; j < project.length; j++) {
                
                const currentEmployee = project[i];
                const nextEmployee = project[j];
    
                // Check if they did not work at the same time
                if(currentEmployee.dateFrom > nextEmployee.dateTo || 
                    currentEmployee.dateTo < nextEmployee.dateFrom) {
                    continue;
                }

                // Sort the pair so we get the same key for the map
                const pair = [currentEmployee.empId, nextEmployee.empId].sort();

                if(!coworkersPairs[pair]) {
                    coworkersPairs[pair] = {
                        dates: [],
                        totalDays: 0
                    };
                }
                
                const dateStartedWorkingTogether = new Date(Math.max(currentEmployee.dateFrom, nextEmployee.dateFrom));
                const dateEndedWorkingTogether = new Date(Math.min(currentEmployee.dateTo, nextEmployee.dateTo));
                
                coworkersPairs[pair].dates.push([dateStartedWorkingTogether, dateEndedWorkingTogether]);
            }
        }
    }
}

// Sort the map 
helpers.sortMap(coworkersPairs);

helpers.sumTotalWorkDays(coworkersPairs);

// Unhide to see all raw data. Use unique pair of empId's to 
console.log(coworkersPairs);

const finalResult = helpers.findPairWhoWorkedMost(coworkersPairs);

helpers.printResult(finalResult);