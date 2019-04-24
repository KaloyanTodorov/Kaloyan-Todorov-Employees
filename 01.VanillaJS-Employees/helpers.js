const Employee = require('./employee');
const ONE_DAY = (24 * 60 * 60 * 1000);


const helpers = (() => {

    function populateAllProjects(data, projects) {
            
        // Get all text for each line
        const regex = /^.+$/gm;
        let matches;

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
    }

    function sortMap(coworkersPairs) {
        for (const pair in coworkersPairs) {
            const dates = coworkersPairs[pair].dates;
        
            if(dates.length === 1) {
                continue;
            }
        
            coworkersPairs[pair].dates.sort((a, b) => {
                if(a[0] < b[0]) {
                    return a[0] > b[0];
                }
        
                return a[1] > b[1];
            });
        }
    }
    
    function sumTotalWorkDays(coworkersPairs) {
        let currentPair = []
        for (const key in coworkersPairs) {
            currentPair = coworkersPairs[key];
            if(currentPair.dates.length === 1) {
                currentPair.totalDays = _countDays(currentPair);
                continue;
            }

            let continuedWork = [];
            for (let i = 0; i < currentPair.dates.length - 1; i++) {
                const firstDates = currentPair.dates[i];
                const nextDates = currentPair.dates[i + 1];
                
                if(firstDates[1] < nextDates[0]) {
                    currentPair.totalDays += _countDays(currentPair);
                    continuedWork.length = 0;
                } else {
                    if(continuedWork.length === 0) {
                        continuedWork.push(firstDates[0], nextDates[1]);
                    } else if(continuedWork[1] < nextDates[1]){
                        continuedWork.length = 1;
                        continuedWork.push(nextDates[1]);
                    }

                    if(i === currentPair.dates.length - 2) {
                        currentPair.totalDays += (continuedWork[1] - continuedWork[0]) / ONE_DAY;
                    }
                }
            }
        }
    }


    function findPairWhoWorkedMost(coworkersPairs) {

        const finalPair = ['', 0];
        for (const key in coworkersPairs) {
            if(finalPair[1] <= coworkersPairs[key].totalDays) {
                finalPair.length = 0;
                finalPair.push(key, coworkersPairs[key].totalDays);
            }
        }

        return finalPair;
    }

    function printResult(pair) {
        console.log(`The pair of co-workers who worked most days togather on various projects are ${pair[0]}. They worked for a total of ${pair[1]} days togather.`);
    }

    function _countDays(currentPair) {
        const dateStartedWorkingTogether = currentPair.dates[0][0];
        const dateEndedWorkingTogether = currentPair.dates[0][1];

        return (dateEndedWorkingTogether - dateStartedWorkingTogether) / ONE_DAY + 1;
    }

    return{
        populateAllProjects,
        sortMap,
        sumTotalWorkDays,
        findPairWhoWorkedMost,
        printResult
    }
})();

module.exports = helpers;