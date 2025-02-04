function formatDateToTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDateTimeDetails(dateTime: string): string {
  const date = new Date(dateTime);

  const time = date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });

  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return `${time} on ${day} ${dayNum} ${month}`;
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}

function timeDifference(arrival: string, depature: string): string {
  const diff = new Date(depature).getTime() - new Date(arrival).getTime();
  return formatMinutes(diff / 60000);
}

export { formatDateToTime, formatDateTimeDetails, formatMinutes, timeDifference };