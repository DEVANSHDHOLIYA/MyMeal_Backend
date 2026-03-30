import emailjs from "@emailjs/nodejs";
import {
  EMAILJS_TEMPLATE_ID,
  EMAILJS_OTP_TEMPLATE_ID,
  EMAILJS_PRIVATE_KEY,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
} from "../config/config.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
  privateKey: EMAILJS_PRIVATE_KEY,
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_OTP_TEMPLATE_ID,
      {
        email: email,
        passcode: otp,
      },
    );

    console.log(" OTP Email Sent");

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Email Error:", error);

    return {
      success: false,
      error,
    };
  }
};

export const sendBuySubscriptionEmail = async (subscriptiondata) => {
  const mycustomhtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MyMeal Confirmation</title>
  <style>
    /* Responsive overrides for small screens */
    @media screen and (max-width: 600px) {
      .header-text {
        font-size: 26px !important; /* Reduced from 36px */
      }
      .sub-header-text {
        font-size: 20px !important; /* Reduced from 26px */
      }
      .body-text {
        font-size: 14px !important; /* Slightly smaller for readability */
        line-height: 1.5 !important;
      }
      .content-wrapper {
        padding: 24px 20px !important; /* Tighter padding */
      }
      .plan-title {
        font-size: 16px !important;
      }
      .price-text {
        font-size: 20px !important; /* Scaled down the total price */
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fff7ed;">
  <center style="width: 100%; background-color: #fff7ed;">
    <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1e293b; padding: 20px 10px;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(249, 115, 22, 0.1); border: 1px solid #ffedd5;">
        
        <div style="padding: 30px 20px; text-align: center;">
          <h1 class="header-text" style="margin: 0; color: #0f172a; font-size: 36px; font-weight: 900; letter-spacing: -1.5px;">
            My<span style="color: #f97316;">Meal</span>
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em;">
            Premium Subscription
          </p>
        </div>

        <div style="height: 4px; background: linear-gradient(to right, #f97316, #fb923c); width: 60px; margin: 0 auto;"></div>

        <div class="content-wrapper" style="padding: 40px 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 class="sub-header-text" style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0;">Order Confirmed!</h2>
            <p class="body-text" style="font-size: 16px; color: #64748b; margin-top: 10px; line-height: 1.6;">
              Payment confirmed! Your seat at our family table is reserved. Get ready for home-cooked magic, delivered fresh to your door.
            </p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 20px; padding: 20px; border: 1px solid #f1f5f9;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 15px;">
                  <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Selected Plan</div>
                  <div class="plan-title" style="font-size: 18px; font-weight: 800; color: #0f172a;">${subscriptiondata.vendor_name}</div>
                  <div style="font-size: 13px; color: #64748b;">${subscriptiondata.plan_duration} Duration</div>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 15px; border-top: 1px solid #e2e8f0;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <div style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Start Date</div>
                        <div style="font-size: 13px; font-weight: 700; color: #1e293b;">${subscriptiondata.start_date}</div>
                      </td>
                      <td style="text-align: right;">
                        <div style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Valid Until</div>
                        <div style="font-size: 13px; font-weight: 700; color: #1e293b;">${subscriptiondata.end_date}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Subscription ID</td>
              <td align="right" style="padding: 8px 0; font-weight: 700; color: #0f172a; font-size: 13px;">#${subscriptiondata.subscription_id}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0 0 0; border-top: 2px solid #0f172a; font-size: 16px; font-weight: 800; color: #0f172a;">Total Paid</td>
              <td class="price-text" align="right" style="padding: 15px 0 0 0; border-top: 2px solid #0f172a; font-size: 24px; font-weight: 900; color: #f97316;">₹${subscriptiondata.price}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            Questions? <a href="mailto:support@mymeal.com" style="color: #f97316; text-decoration: none; font-weight: 700;">Contact Support</a>
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 10px; padding: 0 10px;">
        © 2026 MyMeal Technologies. All rights reserved.<br>
        Sent to {{email}}
      </div>
    </div>
  </center>
</body>
</html>`;
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        title: "Subscription Confirmation - MyMeal",
        email: subscriptiondata.email,
        mycustomhtml: mycustomhtml,
      },
    );

    console.log("Email Sent");

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Email Error:", error);

    return {
      success: false,
      error,
    };
  }
};

export const sendboughtsubscriptionmail = async (emaildata) => {
     const mycustomhtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New MyMeal Subscriber</title>
  <style>
    @media screen and (max-width: 600px) {
      .header-text { font-size: 26px !important; }
      .sub-header-text { font-size: 20px !important; }
      .body-text { font-size: 14px !important; line-height: 1.5 !important; }
      .content-wrapper { padding: 24px 20px !important; }
      .plan-title { font-size: 16px !important; }
      .price-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fff7ed;">
  <center style="width: 100%; background-color: #fff7ed;">
    <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1e293b; padding: 20px 10px;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(249, 115, 22, 0.1); border: 1px solid #ffedd5;">
        
        <div style="padding: 30px 20px; text-align: center;">
          <h1 class="header-text" style="margin: 0; color: #0f172a; font-size: 36px; font-weight: 900; letter-spacing: -1.5px;">
            My<span style="color: #f97316;">Meal</span>
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em;">
            Vendor Alert
          </p>
        </div>

        <div style="height: 4px; background: linear-gradient(to right, #f97316, #fb923c); width: 60px; margin: 0 auto;"></div>

        <div class="content-wrapper" style="padding: 40px 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 class="sub-header-text" style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0;">New Order Received!</h2>
            <p class="body-text" style="font-size: 16px; color: #64748b; margin-top: 10px; line-height: 1.6;">
              Great news! A new customer has just subscribed to your plan. Please check your dashboard to manage their meal deliveries.
            </p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 20px; padding: 20px; border: 1px solid #f1f5f9;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 15px;">
                  <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Customer Name</div>
                  <div class="plan-title" style="font-size: 16px; font-weight: 700; color: #0f172a;">${emaildata.name}</div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 15px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                  <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Plan Purchased</div>
                  <div class="plan-title" style="font-size: 18px; font-weight: 800; color: #f97316;">${emaildata.plan_duration} Plan</div>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 15px; border-top: 1px solid #e2e8f0;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <div style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Service Starts</div>
                        <div style="font-size: 13px; font-weight: 700; color: #1e293b;">${emaildata.start_date}</div>
                      </td>
                      <td style="text-align: right;">
                        <div style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Service Ends</div>
                        <div style="font-size: 13px; font-weight: 700; color: #1e293b;">${emaildata.end_date}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Transaction ID</td>
              <td align="right" style="padding: 8px 0; font-weight: 700; color: #0f172a; font-size: 13px;">#${emaildata.subscription_id}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0 0 0; border-top: 2px solid #0f172a; font-size: 16px; font-weight: 800; color: #0f172a;">Vendor Earnings</td>
              <td class="price-text" align="right" style="padding: 15px 0 0 0; border-top: 2px solid #0f172a; font-size: 24px; font-weight: 900; color: #f97316;">₹${emaildata.price}</td>
            </tr>
          </table>
        </div>

       
      </div>

      <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 10px; padding: 0 10px;">
        © 2026 MyMeal for Partners. All rights reserved.
      </div>
    </div>
  </center>
</body>
</html>`;
try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        title: "New Customer - MyMeal",
        email: emaildata.email,
        mycustomhtml: mycustomhtml,
      },
    );

    console.log("Email Sent");

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Email Error:", error);

    return {
      success: false,
      error,
    };
  }
};
