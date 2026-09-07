import { randomUUID } from "node:crypto";
import { storage } from "./storage";

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  receivedAt: string;
  read: boolean;
};

const KEY = "messages.json";

export async function readMessages(): Promise<Message[]> {
  return (await storage().readJson<Message[]>(KEY)) ?? [];
}

export async function addMessage(
  input: Omit<Message, "id" | "receivedAt" | "read">,
): Promise<Message> {
  const all = await readMessages();
  const message: Message = {
    ...input,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    read: false,
  };
  // Newest first, and capped so an unattended form cannot grow without bound.
  await storage().writeJson(KEY, [message, ...all].slice(0, 500));
  return message;
}

export async function setRead(id: string, read: boolean): Promise<void> {
  const all = await readMessages();
  await storage().writeJson(
    KEY,
    all.map((m) => (m.id === id ? { ...m, read } : m)),
  );
}

export async function deleteMessage(id: string): Promise<void> {
  const all = await readMessages();
  await storage().writeJson(
    KEY,
    all.filter((m) => m.id !== id),
  );
}
