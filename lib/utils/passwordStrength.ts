export function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (!password) return { level: 0, label: "", color: "" };
  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Fair", color: "bg-orange-500" };
  if (score === 3) return { level: 3, label: "Good", color: "bg-yellow-500" };
  if (score === 4) return { level: 4, label: "Strong", color: "bg-green-500" };

  return { level: 5, label: "Very Strong", color: "bg-emerald-500" };
}
