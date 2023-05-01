export const truncateNameList = (nameString: string) => {
  if (nameString) {
    //console.log("String in: "+nameString);
    const array = nameString.split(',');
    //console.log("String array length: "+array.length);
    let stringOut;
    if (array.length>2) {
//       console.log("Array too long");
      const newArray = array.splice(0, 2);
//        console.log("New array length: "+newArray.length);
      stringOut = newArray.join(', ');
      const reminderCount = array.length;
      stringOut += " +";
      stringOut += reminderCount;
    } else {
      stringOut = array.join(', ');
    }
//        console.log("String out: "+stringOut);
    return stringOut;
  } else {
    return "";
  }
}
