import { z } from "zod";

export const schema = z.object({
  youtubeLink: z.string().url({ message: "Insira um link válido do YouTube" }),
});
