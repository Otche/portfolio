output "public_ip" {
  description = "L'adresse IP publique de l'instance EC2."
  value       = aws_instance.web_server.public_ip
}