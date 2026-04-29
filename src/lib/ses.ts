import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.SES_REGION ?? "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const from = process.env.SES_FROM_EMAIL;
  if (!from) {
    console.warn("[ses] SES_FROM_EMAIL not set — skipping email to", to);
    return false;
  }

  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: html, Charset: "UTF-8" },
            ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
          },
        },
      })
    );
    console.log(`[ses] Sent "${subject}" → ${to}`);
    return true;
  } catch (err) {
    console.error("[ses] Failed to send to", to, err);
    return false;
  }
}
