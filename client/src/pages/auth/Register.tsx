import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/auth.api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-10 bg-white border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

      <div className="space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Start managing your workflow today
          </p>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30"
              variant="light"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30"
              variant="light"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30"
              variant="light"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

        </form>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>

    </Card>
  );
};

export default Register;