output "security_group_id" {
  description = "L'ID du Security Group créé."
  value       = aws_security_group.web_sg.id
}