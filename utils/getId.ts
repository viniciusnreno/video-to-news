export function getId(url: string): string | false {
  const youtubeIdRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed|shorts|watch)(?:\?v=|\/))|youtu\.be\/)(?<id>[\w\-]{11})(?=\?|&|$|\/|)/;
  return url.match(youtubeIdRegex)?.groups?.id || false;
}
