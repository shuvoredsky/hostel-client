export const sendChatMessage = async (message: string): Promise<string> => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Chat failed");
  
  const data = await res.json();
  return data.reply;
};