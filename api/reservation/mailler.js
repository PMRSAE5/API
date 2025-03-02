const nodemailer = require("nodemailer");

// Fonction pour envoyer l'email
const sendConfirmationEmail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "pmove213@gmail.com", // Remplace par ton email Gmail
      pass: "edmajzchjelwyjex",
    },
  });

  const mailOptions = {
    from: `"PMove" <tonEmail@gmail.com>`, // Expéditeur
    to: email, // Email cible (du client)
    subject: subject || "Confirmation de réservation", // Sujet
    html: `
      <h1>Confirmation de réservation</h1>
      <p>Bonjour ${name || "Client"},</p>
      <p>${message}</p>
      <p>Merci de choisir PMove !</p>
    `, // Contenu du mail en HTML
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
