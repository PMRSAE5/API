const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "email-smtp.eu-north-1.amazonaws.com", // Remplace par le serveur SMTP de ta région AWS SES
  port: 587, // 465 pour SSL, mais 587 recommandé avec STARTTLS
  secure: false, // false = STARTTLS, true = SSL
  auth: {
    user: "AKIAV5AJYDPKEDV33AAX", // Mets ici ton SMTP Username SES
    pass: "BCsPFF3ByRUqy0tcK4Xt2xPpEPoEMJ208fHfAWhNdlf9", // Mets ici ton SMTP Password SES
  },
});

const sendConfirmationEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: `"PMove" <pmove213@gmail.com>`, // Utilise une adresse vérifiée sur AWS SES
    to: email,
    subject: subject || "Confirmation de réservation",
    html: `
      <h1>Confirmation de réservation</h1>
      <p>Bonjour ${name || "Client"},</p>
      <p>${message}</p>
      <p>Merci de choisir PMove !</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès :", info.response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw new Error("Échec de l'envoi de l'e-mail.");
  }
};

module.exports = { sendConfirmationEmail };
