"use server";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function saveFingerprint(fingerprintData: any) {
  const response = await fetch("/api/fingerprint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fingerprintData),
  });

  if (!response.ok) {
    throw new Error("Failed to save fingerprint data");
  }

  return await response.json();
}
