const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

async function sendOTPEmail(to, otp) {
  try {
    const mailOptions = {
      from: `"ICRE Student Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔐 Your OTP Code for Registration",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">ICRE Student Registration</h1>
                    <p style="color: white; margin: 10px 0 0 0;">Welcome to ICRE Student Registration Portal</p>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
                    <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                        Hi student!<br>
                        Welcome to ICRE! Please use the verification code below to complete your registration:
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        This code will expire in 5 minutes. If you didn't request this code, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        This is an automated email from ICRE. Please do not reply to this email.
                    </p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to", to);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return false;
  }

  return transporter.sendMail(mailOptions);

}

module.exports = { sendOTPEmail };
