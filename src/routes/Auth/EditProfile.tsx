import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getUserById, updateUser } from "~/data/users";
import { getUserID } from "~/data/auth";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = getUserID();
      if (!userId) {
        navigate("/login");
        return;
      }
      try {
        const user = await getUserById(userId);
        if (user) {
          setUsername(user.username || "");
          setDisplayName(user.displayName || user.username || "");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const userId = getUserID();
    if (!userId) {
        navigate("/login");
        return;
    }

    try {
      const updates: Record<string, string> = { username, displayName };
      if (password) {
        updates.password = password;
      }
      await updateUser(userId, updates);
      setSuccess("Profile updated successfully.");
      setPassword(""); // Clear password field
      setTimeout(() => navigate("/"), 1500); 
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-neutral-100">
            <div className="text-center">Loading...</div>
        </div>
     );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-neutral-100">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-neutral-800 bg-neutral-900 p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Edit Profile
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            <Link
              to="/"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
            >
              Back to Dashboard
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-neutral-100 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-md border-0 bg-neutral-800 py-2.5 px-3 text-neutral-100 ring-1 ring-inset ring-neutral-700 placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 outline-none transition-all"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium leading-6 text-neutral-100 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                className="block w-full rounded-md border-0 bg-neutral-800 py-2.5 px-3 text-neutral-100 ring-1 ring-inset ring-neutral-700 placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 outline-none transition-all"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-100 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="block w-full rounded-md border-0 bg-neutral-800 py-2.5 px-3 text-neutral-100 ring-1 ring-inset ring-neutral-700 placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 outline-none transition-all"
                placeholder="New Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-500 text-center">{success}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-100 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
