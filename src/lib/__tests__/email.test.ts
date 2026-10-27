import { describe, it, expect, vi, beforeEach } from"vitest";

// vi.mock factory runs before imports — cannot reference outer variables.
// Use vi.hoisted() to create the mock function before hoisting.
const { mockSendMail } = vi.hoisted(() => ({
  mockSendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({ sendMail: mockSendMail }),
  },
}));

import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from"../email";

const order = {
  id:"order_1",
  accessToken:"tok_access_1",
  customerName:"Ada Lovelace",
  customerEmail:"ada@example.com",
  total:"1500.00",
  items: [{ productName:"Elektrikli Hasta Yatağı Pro", quantity: 1, unitPrice:"1500.00" }],
};

describe("email notifications", () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    process.env.SMTP_HOST ="mail.mcaris.com.tr";
    process.env.SMTP_PORT ="465";
    process.env.SMTP_USER ="info@mcaris.com.tr";
    process.env.SMTP_PASS ="test-password";
    process.env.ORDER_NOTIFICATION_EMAIL ="siparis@mcaris.com";
  });

  it("sends a confirmation email to the customer via SMTP", async () => {
    mockSendMail.mockResolvedValue({ messageId:"msg_1" });
    await sendOrderConfirmationEmail(order);
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({ to:"ada@example.com" }));
  });

  it("sends a notification email to the business address via SMTP", async () => {
    mockSendMail.mockResolvedValue({ messageId:"msg_2" });
    await sendOrderNotificationEmail(order);
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({ to:"siparis@mcaris.com" }));
  });

  it("does not throw when the send fails", async () => {
    mockSendMail.mockRejectedValue(new Error("SMTP connection failed"));
    await expect(sendOrderConfirmationEmail(order)).resolves.toBeUndefined();
  });

});
