export const formatDate = (updatedAt:string ) => {
  
  const date = new Date(updatedAt);
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  
  
  return `${day}.${month}.${year} at ${hours}:${minutes}`;
  };