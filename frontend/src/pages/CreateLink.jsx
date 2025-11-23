// frontend/src/pages/CreateLink.jsx
import React, { useState } from "react";
import { createLink, createLinkPublic } from "../api";
import { useSelector } from "react-redux";

export default function CreateLink() {
  const [url, setUrl] = useState("");
  const [desired, setDesired] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [aiInfo, setAiInfo] = useState(null); // { aiUsed, aiSuggestion }
  const [useAi, setUseAi] = useState(true);
  const [loading, setLoading] = useState(false);
  const token = useSelector((s) => s.auth.token);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiInfo(null);
    setShortUrl("");
    try {
      const payload = {
        url,
        desiredSlug: desired || undefined,
        useAi: useAi
      };

      const res = token ? await createLink(token, payload) : await createLinkPublic(payload);

      const aiUsed = res.data.aiUsed || false;
      const aiSuggestion = res.data.aiSuggestion || null;

      setAiInfo({ aiUsed, aiSuggestion });
      setShortUrl(res.data.short || `${import.meta.env.VITE_API_URL}/s/${res.data.slug}`);
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Short Link</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/some/long/path"
          className="w-full p-2 border rounded"
        />

        <input
          value={desired}
          onChange={(e) => setDesired(e.target.value)}
          placeholder="Optional: desired slug (abc123) — leave empty to use AI or random"
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={useAi} onChange={() => setUseAi((v) => !v)} />
          <span>Use AI suggestion (if available)</span>
        </label>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {aiInfo && (
        <div className="mt-4 p-3 rounded bg-gray-50">
          <div>
            <strong>AI used:</strong> {aiInfo.aiUsed ? "Yes" : "No (fallback or disabled)"}
          </div>
          <div>
            <strong>AI suggestion:</strong> {aiInfo.aiSuggestion || "—"}
          </div>
        </div>
      )}

      {shortUrl && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          Short URL:{" "}
          <a className="text-blue-600 break-all" href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}