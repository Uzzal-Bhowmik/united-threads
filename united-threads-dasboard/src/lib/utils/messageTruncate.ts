export default function messageTruncate(message: string) {
  if (message?.length > 30) {
    return message.slice(0, 30) + "...";
  }

  return message;
}
