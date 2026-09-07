import { readMessages } from "@/lib/messages";
import { deleteMessage, toggleMessage } from "../../actions";

export default async function MessagesPage() {
  const messages = await readMessages();

  if (messages.length === 0) {
    return (
      <p className="border border-dashed border-black/15 p-10 text-center text-sm text-black/55">
        Nothing yet. Messages sent through the contact form land here.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`border p-5 ${m.read ? "border-black/10 bg-white" : "border-brand/40 bg-white"}`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-semibold">
              {m.name}{" "}
              <a href={`mailto:${m.email}`} className="ml-1 text-sm font-normal text-brand-ink hover:underline">
                {m.email}
              </a>
            </p>
            <time className="text-xs text-black/55" dateTime={m.receivedAt}>
              {new Date(m.receivedAt).toLocaleString()}
            </time>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/70">{m.body}</p>

          <div className="mt-4 flex items-center gap-4">
            <form action={toggleMessage}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="read" value={String(!m.read)} />
              <button className="text-xs font-semibold uppercase tracking-[0.14em] text-black/55 hover:text-ink">
                Mark {m.read ? "unread" : "read"}
              </button>
            </form>
            <form action={deleteMessage}>
              <input type="hidden" name="id" value={m.id} />
              <button className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink hover:underline">
                Delete
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
