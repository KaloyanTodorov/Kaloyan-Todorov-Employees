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
            this._dateTo = this._getTodayDate();
        } else {
            this._dateTo = new Date(date);
        }
    }

    _getTodayDate() {
        let date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
    
        return new Date(yyyy + '-' + mm + '-' + dd );
    }
    
}

module.exports = Employee;