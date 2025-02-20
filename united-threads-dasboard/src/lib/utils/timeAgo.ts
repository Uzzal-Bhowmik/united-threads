import { formatDistanceToNow } from "date-fns";

export default function timeAgo(time: Date) {
  const distance = formatDistanceToNow(new Date(time), { addSuffix: true });

  // Custom mapping to short format
  if (distance.includes("less than a minute")) {
    return distance.replace(" minute", " m");
  }
  if (distance.includes("minute")) {
    return distance.replace(" minutes", "m").replace(" minute", "m");
  }
  if (distance.includes("hour")) {
    return distance.replace(" hours", "hr").replace(" hour", "hr");
  }
  if (distance.includes("day")) {
    return distance.replace(" days", "d").replace(" day", "d");
  }
  if (distance.includes("month")) {
    return distance.replace(" months", "mo").replace(" month", "mo");
  }
  if (distance.includes("year")) {
    return distance.replace(" years", "y").replace(" year", "y");
  }

  return distance;
}
