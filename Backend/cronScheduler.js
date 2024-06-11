import cron from "node-cron";
import nodemailer from "nodemailer";

let contents;
let transporter;

export default class CronScheduler {
  static async injectDB(conn) {
    if (contents) {
      return;
    }

    try {
      contents = await conn.db("users").collection("contents");
    } catch (e) {
      console.error(
        `Unable to establish connection handles in cronScheduler: ${e}`
      );
    }
  }

  static async updateStatus() {
    try {
      const currentDateTime = new Date();
      const currentDate = currentDateTime.toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

      // Get current time in 'HH:MM' format with leading zeros for hours and minutes
      const hours = currentDateTime.getHours().toString().padStart(2, "0");
      const minutes = currentDateTime.getMinutes().toString().padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      // Query for entries with matching publishDate and publishTime
      const query = {
        publishDate: currentDate,
        publishTime: currentTime,
      };

      console.log(currentDate);
      console.log(currentTime);
      // Update status to "published" for matching entries
      const updateResult = await contents.updateMany(query, {
        $set: { status: "published" },
      });

      console.log(
        `${updateResult.modifiedCount} entries updated to 'published' status.`
      );

      // Send email notification
      if (updateResult.modifiedCount > 0) {
        await CronScheduler.sendEmailNotifications(query);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  static async sendEmailNotifications(query) {
    try {
      const entries = await contents.find(query).toArray();

      if (!entries || entries.length === 0) {
        console.log("No entries found for email notification.");
        return;
      }

      for (const entry of entries) {
        const { createdBy, title } = entry;

        // Send email to createdBy
        await transporter.sendMail({
          from: "logindevendrasinhchauhan@gmail.com",
          to: createdBy,
          subject: "Your blog has been published",
          html: `<p>Your blog ${title} has been successfully published.</p>`,
        });

        console.log(`Email notification sent to ${createdBy}`);
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }
}

// Initialize nodemailer transporter
transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "logindevendrasinhchauhan@gmail.com",
    pass: "nwxinxawxympxdgd",
  },
});

cron.schedule("*/1 * * * *", () => {
  console.log("Running publish scheduler...");
  CronScheduler.updateStatus();
});
