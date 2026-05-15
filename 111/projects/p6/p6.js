/*
  Author: Quinn Smiley
  Description: Project 6 CS 111
*/

// Implement the createPeopleArray function
function createPeopleArray(columnText, peopleText) {
    const people=[];
    const columnData=columnText.split("\t");
    const rows=peopleText.split("\n");
    for (let rowIndex=0; rowIndex<rows.length; rowIndex++){
        const row=rows[rowIndex].split("\t");
        const person={};
        
        for (let columnIndex=0; columnIndex < row.length; columnIndex++){
          let value = row[columnIndex];
          let property = columnData[columnIndex];


          person[property] = value

        }
        people.push(person);
    }
    return people;
 }


 function createPeopleArrayWithDataType(columnText, peopleText){
    const people=[];
    const columnData=columnText.split("\t");
    const rows=peopleText.split("\n");
    for (let rowIndex=0; rowIndex<rows.length; rowIndex++){
    
        const row=rows[rowIndex].split("\t");
        const person={};
        
        for (let columnIndex=0; columnIndex < columnData.length; columnIndex++){
          const key = columnData[columnIndex].split("|")[0];
          const type = columnData[columnIndex].split("|")[1];

          switch(type){
            case "number":
              person[key] = Number(row[columnIndex]);
            break;
            case "string[]":
              person[key]=row[columnIndex].split(",");
            break;
            default:
              person[key]=row[columnIndex];
            break;
          }

        }
        people.push(person);
    }
    return people;
 }





// Output the result of createPeopleArray using COLUMN and DATA
console.log("*** createPeopleArray ***");
console.log(createPeopleArray(COLUMNS, DATA));


// Output the result of createPeopleArrayWithDataType using COLUMN_WITH_DATATYPE and DATA
console.log("*** createPeopleArrayWithDataType ***");
console.log(createPeopleArrayWithDataType(COLUMNS_WITH_DATATYPE, DATA));