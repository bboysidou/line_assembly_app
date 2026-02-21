const { VITE_API_KEY, VITE_SECRET } = import.meta.env;

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export const generateSignature = async (
  apiKey: string,
  secret: string,
): Promise<string> => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const data = `${apiKey}${secret}${timestamp}`;

  return await sha256(data);
};

export const getHeadersHotelBeds = async (): Promise<
  Record<string, string>
> => {
  const apiKey = VITE_API_KEY || "";
  const secret = VITE_SECRET || "";

  const signature = await generateSignature(apiKey, secret);

  return {
    "Api-key": apiKey,
    "X-Signature": signature,
    "Accept-Encoding": "gzip",
  };
};
