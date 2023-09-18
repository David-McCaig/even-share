export const getFormattedDate = (seconds: number, nanoseconds: number) => {
    const totalMilliseconds = (seconds * 1000) + (nanoseconds / 1000000);
  
    const createdAtDate = new Date(totalMilliseconds);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const monthIndex = createdAtDate.getMonth();
    
      const day = createdAtDate.getDate();
      if (day >= 11 && day <= 13) {
        return `${day}th`;
      }
      
      switch (day % 10) {
        case 1:
         return `${monthNames[monthIndex]} ${day}st`;
        case 2:
         return `${monthNames[monthIndex]} ${day}nd`;
        case 3:
          return `${monthNames[monthIndex]} ${day}rd`;
        default:
          return `${monthNames[monthIndex]} ${day}th`;
      }
  }
  
  