import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
    },
  });
};

interface AdminNotificationProps {
  userName: string;
  userEmail: string;
  paperTitle: string;
  category: string;
  subject: string;
  uploadDate: string;
}

interface UserNotificationProps {
  userName: string;
  userEmail: string;
  paperTitle: string;
  status: 'uploaded' | 'approved' | 'rejected';
  rewardAmount?: number;
  adminMessage?: string;
}

// Email to admin when new paper is uploaded
export const sendAdminUploadNotification = async (props: AdminNotificationProps) => {
  const { userName, userEmail, paperTitle, category, subject, uploadDate } = props;

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || 'akash21052000singh@gmail.com', // Your admin email
    subject: `🆕 New Question Paper Upload - ${paperTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            📚 New Question Paper Uploaded
          </h2>

          <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
            <h3 style="color: #92400e; margin: 0;">⏰ Requires Your Approval</h3>
            <p style="color: #92400e; margin: 5px 0;">A new paper is waiting for your review and approval.</p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">📄 Paper Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Title:</td>
                <td style="padding: 8px 0; color: #1f2937;">${paperTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Category:</td>
                <td style="padding: 8px 0; color: #1f2937;">${category}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 8px 0; color: #1f2937;">${subject}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Upload Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${uploadDate}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">👤 Uploader Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 8px 0; color: #1f2937;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937;">${userEmail}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/admin/dashboard"
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🔍 Review Paper & Approve
            </a>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 5px;">
            <h4 style="color: #047857; margin: 0;">💰 Reward System</h4>
            <p style="color: #047857; margin: 5px 0; font-size: 14px;">
              If approved, the user will receive ₹4 reward for this upload.
            </p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 5px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>BookHaven Admin Notification System</p>
            <p>This email was sent automatically when a user uploaded a new question paper.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
};

// Email to user about their upload status and rewards
export const sendUserNotification = async (props: UserNotificationProps) => {
  const { userName, userEmail, paperTitle, status, rewardAmount, adminMessage } = props;

  const transporter = createTransporter();

  let subject: string;
  let statusColor: string;
  let statusIcon: string;
  let statusMessage: string;
  let rewardSection: string = '';

  switch (status) {
    case 'uploaded':
      subject = `📚 Upload Confirmed - ${paperTitle}`;
      statusColor = '#f59e0b';
      statusIcon = '⏰';
      statusMessage = 'Your question paper has been uploaded successfully and is pending admin approval.';
      break;
    case 'approved':
      subject = `✅ Paper Approved - ₹${rewardAmount} Reward Earned!`;
      statusColor = '#10b981';
      statusIcon = '✅';
      statusMessage = 'Congratulations! Your question paper has been approved.';
      rewardSection = `
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="color: #047857; margin-top: 0;">💰 Reward Earned!</h3>
          <p style="color: #047857; font-size: 18px; font-weight: bold; margin: 10px 0;">
            You have earned ₹${rewardAmount} for this upload!
          </p>
          <p style="color: #047857; font-size: 14px; margin: 5px 0;">
            Your reward has been credited to your account and will be processed for payment.
          </p>
        </div>
      `;
      break;
    case 'rejected':
      subject = `❌ Paper Status Update - ${paperTitle}`;
      statusColor = '#dc2626';
      statusIcon = '❌';
      statusMessage = 'Your question paper has been reviewed but was not approved.';
      break;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: ${statusColor}; border-bottom: 2px solid ${statusColor}; padding-bottom: 10px;">
            ${statusIcon} BookHaven - Paper Status Update
          </h2>

          <div style="margin: 20px 0; padding: 15px; background-color: ${status === 'approved' ? '#ecfdf5' : status === 'rejected' ? '#fef2f2' : '#fef3c7'}; border-left: 4px solid ${statusColor}; border-radius: 5px;">
            <h3 style="color: ${statusColor === '#f59e0b' ? '#92400e' : statusColor}; margin: 0;">Hello ${userName}!</h3>
            <p style="color: ${statusColor === '#f59e0b' ? '#92400e' : statusColor}; margin: 5px 0;">${statusMessage}</p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">📄 Paper Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Title:</td>
                <td style="padding: 8px 0; color: #1f2937;">${paperTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Status:</td>
                <td style="padding: 8px 0; color: ${statusColor}; font-weight: bold;">${status.toUpperCase()}</td>
              </tr>
            </table>
          </div>

          ${rewardSection}

          ${adminMessage ? `
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">💬 Message from Admin:</h3>
            <p style="color: #1f2937; font-style: italic;">${adminMessage}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/dashboard"
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              📚 View Your Account
            </a>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 5px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>Thank you for contributing to BookHaven!</p>
            <p>Questions? Contact us at admin@bookhaven.com</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`User ${status} notification email sent successfully to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending user ${status} notification email:`, error);
  }
};