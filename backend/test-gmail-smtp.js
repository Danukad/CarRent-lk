/**
 * Test Gmail SMTP Configuration
 * Run with: node test-gmail-smtp.js
 *
 * This script verifies your Gmail SMTP settings without needing the full server
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

const testGmailConfig = async () => {
  console.log("🔍 Testing Gmail SMTP Configuration...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(
    `   EMAIL_PASS: ${process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing"}`,
  );

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("\n❌ ERROR: EMAIL_USER or EMAIL_PASS not set in .env file!");
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // Port 465 = implicit TLS, 587 = STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true, // Enable logging
    debug: true, // Enable debug mode
  });

  try {
    console.log("\n🔗 Verifying SMTP Connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection verified successfully!");

    // Ask if user wants to send a test email
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("\n📧 Send a test email? (yes/no): ", async (answer) => {
      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        rl.question("Enter test email address: ", async (testEmail) => {
          try {
            console.log(`\n📤 Sending test email to ${testEmail}...`);
            const info = await transporter.sendMail({
              from: `"CarRents.lk Test" <${process.env.EMAIL_USER}>`,
              to: testEmail,
              subject: "✅ CarRents.lk SMTP Test Successful",
              html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #7C3AED;">✅ SMTP Configuration Working!</h2>
                    <p>Your Gmail SMTP configuration is correctly set up.</p>
                    <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
                    <p style="color: #999; margin-top: 30px; font-size: 12px;">
                      If you received this email, your OTP system should work correctly.
                    </p>
                  </div>
                `,
            });
            console.log(`✅ Test email sent successfully!`);
            console.log(`   Message ID: ${info.messageId}`);
          } catch (err) {
            console.error(`❌ Failed to send test email:`, err.message);
            console.error(`   Error Code: ${err.code}`);
          }
          rl.close();
        });
      } else {
        console.log("\n⏭️  Skipping test email.\n");
        rl.close();
      }
    });
  } catch (err) {
    console.error("\n❌ SMTP Verification Failed!");
    console.error(`   Error: ${err.message}`);
    console.error(`   Code: ${err.code}`);

    if (err.code === "EAUTH") {
      console.error("\n🔐 AUTHENTICATION ERROR - Troubleshooting:");
      console.error(
        "   1. Use a 16-character App Password (not your Gmail password)",
      );
      console.error(
        "   2. Enable 2-Step Verification: https://myaccount.google.com/security",
      );
      console.error(
        "   3. Generate App Password: https://myaccount.google.com/apppasswords",
      );
      console.error(
        "   4. Or enable Less Secure Apps: https://myaccount.google.com/lesssecureapps",
      );
      console.error(
        "   5. Ensure EMAIL_USER is your full Gmail address (with @gmail.com)",
      );
    } else if (err.code === "ENOTFOUND") {
      console.error("\n🌐 CONNECTION ERROR - Check:");
      console.error("   1. Internet connection is working");
      console.error("   2. SMTP host: smtp.gmail.com (correct)");
      console.error("   3. Port: 587 or 465");
    }
  }
};

testGmailConfig();
