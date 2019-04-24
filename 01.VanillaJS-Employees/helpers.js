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
                if(a.dateFrom < b.dateFrom) {
                    return a.dateFrom > b.dateFrom;
                }
        
                return a.dateTo > b.dateTo;
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

            const continuedWork = {
                dateFrom: '',
                dateTo: ''
            };
            for (let i = 0; i < currentPair.dates.length - 1; i++) {
                const firstDates = currentPair.dates[i];
                const nextDates = currentPair.dates[i + 1];
                
                if(firstDates.dateTo < nextDates.dateFrom) {
                    currentPair.totalDays += _countDays(firstDates, i);

                    continuedWork.dateFrom = '';
                    continuedWork.dateTo = '';
                } else {
                    if(continuedWork.dateFrom === '') {
                        continuedWork.dateFrom = firstDates.dateFrom;
                        continuedWork.dateTo = nextDates.dateTo;
                    } else if(continuedWork.dateTo < nextDates.dateTo){
                        continuedWork.dateTo = nextDates.dateTo;
                    }

                    if(i === currentPair.dates.length - 2) {

                        currentPair.totalDays += _countDays(continuedWork);
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

    // Private function
    function _countDays(currentPair, i = 0) {
        const dateStartedWorkingTogether = currentPair.dateFrom;
        const dateEndedWorkingTogether = currentPair.dateTo;

        return (dateEndedWorkingTogether - dateStartedWorkingTogether) / ONE_DAY + 1;
    }

    return {
        populateAllProjects,
        sortMap,
        sumTotalWorkDays,
        findPairWhoWorkedMost,
        printResult
    }
})();

module.exports = helpers;