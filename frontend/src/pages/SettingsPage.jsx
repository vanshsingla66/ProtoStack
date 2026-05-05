import { useState } from "react";

export default function SettingsPage({ user, onUserUpdate }) {
  const initial = user || {};
  const [name, setName] = useState(initial.name || "");
  const [email] = useState(initial.email || "");
  const [theme, setTheme] = useState((initial.settings && initial.settings.theme) || "system");
  const [emailNotifications, setEmailNotifications] = useState(
    initial.settings ? !!initial.settings.emailNotifications : true
  );
  const [profileVisibility, setProfileVisibility] = useState(
    (initial.settings && initial.settings.profileVisibility) || "public"
  );
  const [nativeLanguage, setNativeLanguage] = useState(initial.nativeLanguage || "");
  const [learningLanguage, setLearningLanguage] = useState(initial.learningLanguage || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name,
        nativeLanguage,
        learningLanguage,
        settings: {
          theme,
          emailNotifications,
          profileVisibility,
        },
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Settings saved.");
        if (onUserUpdate && typeof onUserUpdate === "function") {
          onUserUpdate(data.user);
        }
      } else {
        setMessage(data.message || "Save failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Account</h3>

          <label className="block text-sm text-neutral-600">Display name</label>
          <input
            className="w-full border rounded px-3 py-2 my-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm text-neutral-600">Email</label>
          <input className="w-full border rounded px-3 py-2 my-2 bg-neutral-50" value={email} readOnly />

          <label className="block text-sm text-neutral-600">Native language</label>
          <input
            className="w-full border rounded px-3 py-2 my-2"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
          />

          <label className="block text-sm text-neutral-600">Learning language</label>
          <input
            className="w-full border rounded px-3 py-2 my-2"
            value={learningLanguage}
            onChange={(e) => setLearningLanguage(e.target.value)}
          />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Appearance & Privacy</h3>

          <label className="block text-sm text-neutral-600">Theme</label>
          <select
            className="w-full border rounded px-3 py-2 my-2"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <label className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <span className="text-sm">Email notifications</span>
          </label>

          <label className="block text-sm text-neutral-600 mt-3">Profile visibility</label>
          <select
            className="w-full border rounded px-3 py-2 my-2"
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save settings"}
        </button>

        {message && <div className="text-sm text-neutral-700">{message}</div>}
      </div>
    </div>
  );
}
