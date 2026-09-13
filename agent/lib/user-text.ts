type TextPart = {
  type?: string;
  text?: string;
};

type ModelLikeMessage = {
  role?: string;
  content?: string | readonly TextPart[];
};

function contentText(content: ModelLikeMessage["content"]): string {
  if (typeof content === "string") {
    return content;
  }
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("\n");
}

/** Last user-role message text in a dynamic-resolver snapshot, oldest-first. */
export function extractLastUserText(messages: readonly ModelLikeMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "user") {
      continue;
    }
    const text = contentText(message.content).trim();
    if (text.length > 0) {
      return text;
    }
  }
  return "";
}

export function isMorningReturn(text: string): boolean {
  return /\b(good morning|this morning|morning check[- ]?in|woke up|waking (temp|pulse)|i'?m back|im back|next day|new day)\b/i.test(
    text,
  );
}
