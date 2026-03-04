// netlify/functions/getCount.js
exports.handler = async () => {
  try {
    const token = process.env.NETLIFY_AUTH_TOKEN;
    const formId = process.env.NETLIFY_FORM_ID;

    if (!token || !formId) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: "Missing NETLIFY_AUTH_TOKEN or NETLIFY_FORM_ID",
          count: 0
        })
      };
    }

    // Netlify API: form object includes submission_count
    const res = await fetch(`https://api.netlify.com/api/v1/forms/${formId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, error: text, count: 0 })
      };
    }

    const form = await res.json();
    const count = Number(form.submission_count || 0);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, count })
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: false, error: String(e), count: 0 })
    };
  }
};
