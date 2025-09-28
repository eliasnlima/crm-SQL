export function isAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Acesso negado: apenas administradores" });
  }
  next();
}