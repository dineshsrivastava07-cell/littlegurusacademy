"""Resend email helpers — non-blocking, fail-safe.

Never raises out — if Resend is misconfigured or unreachable we just log and
return None, so user-facing form submissions still succeed.
"""
from __future__ import annotations

import asyncio
import logging
import os
from typing import Optional

import resend

logger = logging.getLogger(__name__)

ADMIN_EMAIL = "littlegurusacademy@gmail.com"
BRAND = "Little Gurus Academy"


def _configured() -> bool:
    key = os.environ.get("RESEND_API_KEY", "").strip()
    if not key:
        return False
    resend.api_key = key
    return True


def _sender() -> str:
    return os.environ.get("SENDER_EMAIL", "Little Gurus <onboarding@resend.dev>").strip()


async def _send(params: dict) -> Optional[str]:
    if not _configured():
        logger.info("Resend not configured (RESEND_API_KEY missing) — skipping email.")
        return None
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        eid = result.get("id") if isinstance(result, dict) else None
        logger.info(f"Resend email sent id={eid}")
        return eid
    except Exception as e:  # noqa: BLE001
        logger.error(f"Resend send failed: {e}")
        return None


def _escape(s: str) -> str:
    return (
        (s or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br>")
    )


# ---------- Templates ----------
def _wrapper(title: str, body_html: str) -> str:
    return f"""\
<!doctype html><html><body style="margin:0;padding:0;background:#FFFBEB;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #fde9c8;">
        <tr>
          <td style="background:linear-gradient(135deg,#fb923c,#f97316);padding:28px 32px;color:#ffffff;">
            <div style="font-size:20px;font-weight:700;letter-spacing:.2px;">✨ {BRAND}</div>
            <div style="font-size:13px;opacity:.9;margin-top:4px;">{title}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;font-size:15px;line-height:1.65;color:#334155;">
            {body_html}
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px;background:#FFFBEB;font-size:12px;color:#94a3b8;text-align:center;">
            Little Gurus Academy · Where little minds grow big · {ADMIN_EMAIL}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


def enquiry_admin_html(name, email, phone, child_age, program, message):
    rows = [
        ("Parent name", name),
        ("Email", email),
        ("Phone", phone),
        ("Child's age", f"{child_age} years"),
        ("Program", program),
        ("Message", message or "—"),
    ]
    inner = "".join(
        f'<tr><td style="padding:8px 0;font-size:13px;color:#64748b;width:140px;">{k}</td>'
        f'<td style="padding:8px 0;font-weight:600;color:#0f172a;">{_escape(str(v))}</td></tr>'
        for k, v in rows
    )
    body = f"""\
<h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">New enquiry received 🎉</h2>
<p style="margin:0 0 16px;color:#475569;">A new parent just reached out via the website. Reply within 24 hours for best conversion.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed #fde9c8;border-bottom:1px dashed #fde9c8;margin:10px 0;">
{inner}
</table>
<p style="margin-top:18px;font-size:13px;color:#64748b;">Tip: open Gmail and reply to <b>{_escape(email)}</b> directly.</p>"""
    return _wrapper("New enquiry from the website", body)


def enquiry_parent_html(name, program):
    body = f"""\
<h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">Hi {_escape(name.split()[0] if name else "there")}, thank you! 💛</h2>
<p style="margin:0 0 14px;">We just received your enquiry for <b>{_escape(program)}</b>, and we are <b>so excited</b> to meet your little one.</p>
<p style="margin:0 0 14px;">A friendly guru will reach out within <b>24 hours</b> to set up your free, no-pressure tour and demo class. In the meantime, feel free to peek at us on YouTube and Instagram.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0;">
<tr><td style="background:#f97316;border-radius:999px;">
<a href="https://youtube.com/@littlegurusacademy" style="display:inline-block;padding:12px 22px;color:#ffffff;font-weight:700;text-decoration:none;font-size:14px;">Watch a sample class</a>
</td></tr>
</table>
<p style="margin:18px 0 6px;color:#475569;font-size:14px;">If anything's urgent, just hit reply — a real human reads every email.</p>
<p style="margin:0;color:#475569;font-size:14px;">With love,<br><b>The Little Gurus team</b></p>"""
    return _wrapper("Thanks for booking a tour", body)


def contact_admin_html(name, email, subject, message):
    body = f"""\
<h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">New contact message 💬</h2>
<p style="margin:0 0 14px;color:#475569;">From <b>{_escape(name)}</b> &lt;{_escape(email)}&gt;</p>
<p style="margin:0 0 8px;color:#0f172a;"><b>Subject:</b> {_escape(subject or "(no subject)")}</p>
<div style="padding:14px 16px;background:#FFFBEB;border-radius:12px;border:1px solid #fde9c8;white-space:pre-wrap;">
{_escape(message)}
</div>
<p style="margin-top:16px;font-size:13px;color:#64748b;">Reply directly to {_escape(email)}.</p>"""
    return _wrapper("New message via Contact form", body)


# ---------- Public helpers ----------
async def send_enquiry_emails(name, email, phone, child_age, program, message):
    await _send({
        "from": _sender(),
        "to": [ADMIN_EMAIL],
        "reply_to": email,
        "subject": f"New enquiry · {program} · {name}",
        "html": enquiry_admin_html(name, email, phone, child_age, program, message),
    })
    await _send({
        "from": _sender(),
        "to": [email],
        "subject": f"Thanks {name.split()[0] if name else 'there'} — your free tour is on the way ✨",
        "html": enquiry_parent_html(name, program),
    })


async def send_contact_email(name, email, subject, message):
    await _send({
        "from": _sender(),
        "to": [ADMIN_EMAIL],
        "reply_to": email,
        "subject": f"Contact form · {subject or 'No subject'} · {name}",
        "html": contact_admin_html(name, email, subject, message),
    })
