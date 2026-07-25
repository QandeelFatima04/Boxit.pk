import net from "node:net";

// Minimal SMTP client for the Mailcow relay that runs on the same VPS.
// Postfix trusts localhost (mynetworks), so no auth/password is needed, and
// outbound is SPF-aligned (sent from the MX IP) and DKIM-signed by Mailcow.
//
// Deliberately dependency-free: a single plaintext hop to 127.0.0.1:25.

export type OutMail = {
  fromName: string;
  fromAddr: string; // envelope + From header address
  to: string; // single recipient address
  replyTo?: string;
  subject: string;
  text: string;
};

const HOST = process.env.SMTP_HOST || "127.0.0.1";
const PORT = Number(process.env.SMTP_PORT || 25);
const HELO = process.env.SMTP_HELO || "boxit.pk";

// Strip CR/LF from any value interpolated into a header (prevents header injection).
function headerSafe(v: string): string {
  return String(v ?? "").replace(/[\r\n]/g, " ").trim();
}

function buildMessage(mail: OutMail): string {
  const from = headerSafe(mail.fromAddr);
  const fromName = headerSafe(mail.fromName);
  const headers =
    `From: ${fromName ? `${fromName} <${from}>` : from}\r\n` +
    `To: ${headerSafe(mail.to)}\r\n` +
    (mail.replyTo ? `Reply-To: ${headerSafe(mail.replyTo)}\r\n` : "") +
    `Subject: ${headerSafe(mail.subject)}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset=utf-8\r\n` +
    `Content-Transfer-Encoding: 8bit\r\n` +
    `\r\n`;
  // Normalize newlines and dot-stuff lines that begin with "." per RFC 5321.
  const body = String(mail.text)
    .replace(/\r?\n/g, "\r\n")
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? "." + line : line))
    .join("\r\n");
  return headers + body + "\r\n.\r\n";
}

export function sendMailLocal(mail: OutMail): Promise<void> {
  return new Promise((resolve, reject) => {
    const from = headerSafe(mail.fromAddr);
    const to = headerSafe(mail.to);
    const message = buildMessage(mail);

    const socket = net.createConnection({ host: HOST, port: PORT });
    socket.setTimeout(15000);

    let buf = "";
    let step = 0;
    let done = false;

    const finish = (err?: Error) => {
      if (done) return;
      done = true;
      try {
        socket.destroy();
      } catch {
        // ignore
      }
      if (err) reject(err);
      else resolve();
    };

    // command i is sent once the previous reply arrives with the expected code
    const script: Array<{ expect: string; send: string }> = [
      { expect: "220", send: `EHLO ${HELO}\r\n` },
      { expect: "250", send: `MAIL FROM:<${from}>\r\n` },
      { expect: "250", send: `RCPT TO:<${to}>\r\n` },
      { expect: "250", send: `DATA\r\n` },
      { expect: "354", send: message },
      { expect: "250", send: `QUIT\r\n` },
    ];

    const onReply = (line: string) => {
      const stage = script[step];
      if (!stage) return;
      if (!line.startsWith(stage.expect)) {
        finish(new Error(`SMTP unexpected reply at step ${step}: ${line}`));
        return;
      }
      socket.write(stage.send);
      step += 1;
      if (step === script.length) finish(); // QUIT sent; treat as success
    };

    socket.on("data", (chunk) => {
      buf += chunk.toString("utf8");
      let idx: number;
      while ((idx = buf.indexOf("\r\n")) >= 0) {
        const line = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        // Multiline SMTP replies have "-" as the 4th char until the final line.
        if (line.length >= 4 && line[3] === "-") continue;
        onReply(line);
      }
    });

    socket.on("timeout", () => finish(new Error("SMTP timeout")));
    socket.on("error", (err) => finish(err));
  });
}
