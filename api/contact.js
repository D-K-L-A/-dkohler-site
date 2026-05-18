export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const data = req.body || {};

  const name = data.name || "No name provided";
  const email = data.email || "No email provided";
  const company = data.company || "No company provided";
  const problem = data.problem || "No message provided";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Dan Kohler <connect@dkohler.com>",
        to: ["kohdan@gmail.com"],
        reply_to: email,
        subject: `New note from dkohler.com: ${name}`,
        html: `
          <h2>New message from dkohler.com</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company or project:</strong> ${company}</p>
          <p><strong>Message:</strong></p>
          <p>${problem}</p>
        `
      })
    });

    if (!response.ok) {
      return res.redirect(303, "/contact.html?sent=error");
    }

    return res.redirect(303, "/thanks.html");
  } catch (error) {
    return res.redirect(303, "/contact.html?sent=error");
  }
}
