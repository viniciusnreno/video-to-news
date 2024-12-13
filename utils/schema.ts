import { z } from "zod";

export const schema = z.object({
  youtubeLink: z
    .string()
    .url("O link fornecido não é válido.")
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      "Insira um link válido do YouTube."
    ),
});
