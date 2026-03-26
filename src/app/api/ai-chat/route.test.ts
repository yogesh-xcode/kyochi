import { POST } from "@/app/api/ai-chat/route";

describe("/api/ai-chat auth", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const request = new Request("http://localhost/api/ai-chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt: "show pending invoices" }),
    });

    const response = await POST(request);
    if (!response) {
      throw new Error("Expected a response from /api/ai-chat");
    }
    expect(response.status).toBe(401);

    const payload = (await response.json()) as { message?: string };
    expect(payload.message).toBe("Unauthorized");
  });
});
