export type Environment = {
  NODE_ENV: "development" | "production";
  API_PORT: string;
  JWT_SECRET: string;
}

export const getEnv = <K extends keyof Environment>(key: K, fallback?: Environment[K]): Environment[K] => {
  const value = process.env[key] as Environment[K] | undefined;

  if (!value) {
    if (fallback) {
      return fallback;
    }
    throw new Error(`Missing environment variable: ${key}.`);
  }

  return value;
};

export default { getEnv }
