export async function postToWebhook(url: string, body: unknown) {
  if (!url) {
    console.warn('Webhook URL is missing – skipping webhook call');
    return null;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn('Make.com webhook returned error status:', res.status, await res.text());
    }
    return res;
  } catch (err) {
    console.error('Make.com webhook fetch error:', err);
    return null;
  }
}
