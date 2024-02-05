export function getId(url: string): string | false {
  const youtubeIdRegex =
    /^(?:(?:https|http):\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be).*(?<=\/|v\/|u\/|embed\/|shorts\/|watch\?v=)(?<!\/user\/)(?<id>[\w\-]{11})(?=\?|&|$)/;
  return url.match(youtubeIdRegex)?.groups?.id || false;
}
