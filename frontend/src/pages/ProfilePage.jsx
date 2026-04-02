import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage({ user }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    role: user?.role,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated (connect backend later)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-neutral-500">
          Manage your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border rounded-xl p-6 flex items-center gap-5">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-black text-white text-lg font-bold">
            {form.name?.[0] || "M"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-lg font-semibold">{form.name}</h2>
          <p className="text-sm text-neutral-500">{form.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        {/* Name */}
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option>Student</option>
            <option>Developer</option>
            <option>Designer</option>
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            placeholder="Write something about yourself..."
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-neutral-800"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}