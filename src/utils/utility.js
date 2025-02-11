export  const calculateDaysUntilReset = (expiryDate)=> {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    if (diff <= 0) return -1;
  
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 7);
  };
   

export const calculateWorkingTimePeriod = (startTime)=>{
    const start = new Date(startTime);
    
    const today = new Date();
    const diffHours = (today.getTime() - start.getTime())/ 60 / 60 / 1000;

    return diffHours % (24 * 7);
}