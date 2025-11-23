import React, { useEffect, useState } from "react";
import { getLinks } from "../api";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const token = useSelector((s) => s.auth.token);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (!token) return;

    async function fetchLinks() {
      try {
        const res = await getLinks(token);
        setLinks(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchLinks();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Links</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Short</th>
              <th className="p-3 text-left">Original URL</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Last Click</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-t">
                <td className="p-3">{link.slug}</td>
                <td className="p-3 break-all">{link.url}</td>
                <td className="p-3">{link.clicks}</td>
                <td className="p-3">
                  {link.lastClick
                    ? new Date(link.lastClick.ts).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
