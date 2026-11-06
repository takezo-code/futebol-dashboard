import "server-only";
import { z } from "zod";

const envSchema = z.object({
  FOOTBALL_DATA_TOKEN: z.string().trim().min(1),
});

export type Env = z.infer<typeof envSchema>;

const MISSING_TOKEN_MESSAGE =
  "Variável de ambiente FOOTBALL_DATA_TOKEN ausente. Copie .env.example para .env.local e preencha o token.";

export function getEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(MISSING_TOKEN_MESSAGE);
  }
  return result.data;
}
