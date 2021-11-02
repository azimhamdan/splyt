//ASSESMENT 1

function add(a, b) {
    return a + b;
}

function defaultArguments(func, obj) {
    return function (a, b) {
        let valA = a ? a : obj.a;
        let valB = b ? b : obj.b;
        //console.log('a,b', valA,valB)
        return add(valA, valB)
    }
}

const add2 = defaultArguments(add, { b: 9 });
console.log(add2(10) === 19);
console.log(add2(10, 7) === 17);
console.log(isNaN(add2()));
const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.log(add3(10) === 13);
console.log(add3() === 5);
console.log(add3(undefined, 10) === 12);
const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything, since c isn't an argument
console.log(isNaN(add4(10)));
console.log(add4(10, 10) === 20);

//ASSESMENT 2
/** Need to install NPM moment */
const moment = require('moment');

let schedules = [
    [["09:00", "11:30"], ["13:30", "16:00"], ["16:00", "17:30"], ["17:45", "19:00"]],
    [["09:15", "12:00"], ["14:00", "16:30"], ["17:00", "17:30"]],
    [["11:30", "12:15"], ["15:00", "16:30"], ["17:45", "19:00"]]
];

// iterate over the time list from above

let getKey = [];
let arrayReducer

//convert all blocked slot in JSON string
//TODO : Not necessary to convert to string, better Obj just for reading purpose
function blockedSlot() {
    for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < schedules[i].length; j++) {
            //get all starting time
            getKey.push({ [i]: schedules[i][j][0] + '-' + schedules[i][j][1] })
            arrayReducer = getKey.reduce(function (r, e) {
                return Object.keys(e).forEach(function (k) {
                    if (!r[k]) r[k] = [].concat(e[k])
                    else r[k] = r[k].concat(e[k])
                }), r
            }, {})
        }
    }
    return JSON.stringify(arrayReducer)
}


let blockedSlotData = blockedSlot();
let getKeyForSlot = []

// Get avaliable slot after identified the meeting schedule
function avaliableSlot() {
    let startWorkingTime = '09:00';
    let endWorkingTime = '19:00'
    let parseJSONobj = JSON.parse(blockedSlotData);
    let count = Object.keys(parseJSONobj).length;
    //console.log(count)
    for (var o = 0; o < count; o++ ){
        for (var i = 0; i < parseJSONobj[o].length; i++) {
            let startingAvalibleTimeRow = parseJSONobj[o][i].split('-');
            let startingAvalibleTimeBefore = startingAvalibleTimeRow[0];
            let startingAvalibleTime = startingAvalibleTimeRow[1];
            //console.log(startingAvalibleTimeRow, )
            if (i == 0) {
                if (startWorkingTime != startingAvalibleTimeBefore && startWorkingTime < startingAvalibleTime) {
                    //console.log(startWorkingTime, '-', startingAvalibleTimeBefore)
                    getKeyForSlot.push({ [o]: startWorkingTime+ '-' + startingAvalibleTimeBefore})
                }
            }
            if (i == 1) {
                let endingAvalibleTimeRow = parseJSONobj[o][i + 1].split('-');
                let endingAvalibleTime = endingAvalibleTimeRow[0];
    
    
                if (startingAvalibleTime != endingAvalibleTime) {
                    //console.log(startingAvalibleTime, '-', endingAvalibleTime)
                    getKeyForSlot.push({ [o]: startingAvalibleTime+ '-' + endingAvalibleTime})
                }
            }
            else if (i + 1 < parseJSONobj[o].length) {
                let endingAvalibleTimeRow = parseJSONobj[o][i + 1].split('-');
                let endingAvalibleTime = endingAvalibleTimeRow[0];
    
    
                if (startingAvalibleTime != endingAvalibleTime) {
                    //console.log(startingAvalibleTime, '-', endingAvalibleTime)
                    getKeyForSlot.push({ [o]: startingAvalibleTime+ '-' + endingAvalibleTime})
                }
            }
            else {
                let lastMeetingTimeRow = parseJSONobj[o][i].split('-');
                let lastMeetingTime = lastMeetingTimeRow[1]
                if (lastMeetingTime < endWorkingTime) {
                    //console.log(lastMeetingTime, '-', endWorkingTime)
                    getKeyForSlot.push({ [o]: lastMeetingTime+ '-' + endWorkingTime})
                }
            }
    
        }

    }

            arrayReducer = getKeyForSlot.reduce(function (r, e) {
                return Object.keys(e).forEach(function (k) {
                    if (!r[k]) r[k] = [].concat(e[k])
                    else r[k] = r[k].concat(e[k])
                }), r
            }, {})

            return JSON.stringify(arrayReducer)


}

let avaliableSlotData = avaliableSlot();
console.log('Avaliable Slot: ', avaliableSlotData);

// Get logic after avaliable appoiment slot constructed
let parseJSONobjAvaliable = JSON.parse(avaliableSlotData);
function getAppointmentSlot(person, durations){
    switch(person) {
        case "A":
            for (var i = 0; i < parseJSONobjAvaliable["0"].length; i++){
                let startingGetAvalibleTimeRow = parseJSONobjAvaliable["0"][i].split('-');
                let startingGetAvalibleTimeBefore = startingGetAvalibleTimeRow[0];
                let startingGetAvalibleTime = startingGetAvalibleTimeRow[1];
                let appointmentGetSlotStart = moment(startingGetAvalibleTimeBefore, 'HH:mm').add(durations, 'minutes').format('HH:mm');

                if (appointmentGetSlotStart < startingGetAvalibleTime){
                    return ('Availabe at:' + startingGetAvalibleTimeBefore +'-'+ startingGetAvalibleTime)
                }
                
                
            }
            return null
 
        case "B":
            console.log('IM B')
            for (var i = 0; i < parseJSONobjAvaliable["1"].length; i++){
                let startingGetAvalibleTimeRow = parseJSONobjAvaliable["1"][i].split('-');
                let startingGetAvalibleTimeBefore = startingGetAvalibleTimeRow[0];
                let startingGetAvalibleTime = startingGetAvalibleTimeRow[1];
                let appointmentGetSlotStart = moment(startingGetAvalibleTimeBefore, 'HH:mm').add(durations, 'minutes').format('HH:mm');
                if (appointmentGetSlotStart < startingGetAvalibleTime){
                    return ('Availabe at:' + startingGetAvalibleTimeBefore +'-'+ startingGetAvalibleTime)
                }
            }
            return null
     
        case "C":
            for (var i = 0; i < parseJSONobjAvaliable["2"].length; i++){
                let startingGetAvalibleTimeRow = parseJSONobjAvaliable["2"][i].split('-');
                let startingGetAvalibleTimeBefore = startingGetAvalibleTimeRow[0];
                let startingGetAvalibleTime = startingGetAvalibleTimeRow[1];
                let appointmentGetSlotStart = moment(startingGetAvalibleTimeBefore, 'HH:mm').add(durations, 'minutes').format('HH:mm');
                if (appointmentGetSlotStart < startingGetAvalibleTime){
                    return ('Availabe at:' + startingGetAvalibleTimeBefore +'-'+ startingGetAvalibleTime)
                }
            }
            return null;

        default:
          return null;
      }
    
}

//input controller
let inputPerson = 'C';
let inputDurations = 60
let getMatchAppoimentTime = getAppointmentSlot(inputPerson,inputDurations);
console.log(getMatchAppoimentTime) 
