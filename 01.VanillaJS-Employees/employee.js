class Employee {
    constructor(empId, dateFrom, dateTo) {
        this.empId = empId;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
    
    get dateFrom(){
        return this._dateFrom;
    }

    set dateFrom(date) {
        this._dateFrom = new Date(date);
    }

    get dateTo(){
        return this._dateTo;
    }

    set dateTo(date) {
        if(date === 'NULL') {
            this._dateTo = new Date();
        } else {
            this._dateTo = new Date(date);
        }
    }
}

module.exports = Employee;